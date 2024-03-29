import {
  MinAuthDBData,
  UserDBData,
  TokenDBData,
  TokenData,
  UserData,
  UserGSI1KeyComponents,
  UserKeyComponents,
  UserGSI1Key,
  UserKey,
  TokenKeyComponents,
  TokenKey,
} from "../../types";
import {
  DeleteObjectFromDynamo,
  GetAllInPartitionFromDynamo,
  GetObjectFromDynamo,
  GetObjectsFromDynamoIndex,
  PutObjectToDynamo,
  UpdateObjectInDynamo,
} from "../../shared-utils/dynamo";
import { pruneObject } from "./common";

export const TABLES = {
  AUTH: "auth",
} as const;
export type TableName = (typeof TABLES)[keyof typeof TABLES];

export const PARTITIONS = {
  USER: "user",
  TOKEN: "user-token",
} as const;
export type PartitionName = (typeof PARTITIONS)[keyof typeof PARTITIONS];

export const ORIGINS = {
  PENNY: "https://pennybusproject.com",
} as const;
export type OriginName = (typeof ORIGINS)[keyof typeof ORIGINS];

const getTableName = (table: TableName): string => {
  let tableName;
  if (table === TABLES.AUTH) {
    tableName = process.env.AUTH_TABLE;
  }
  if (!tableName) {
    throw Error("No table name defined for table " + table);
  }
  return tableName;
};

export const authTable = {
  user: {
    getKeys: (
      item: UserKeyComponents & Partial<UserGSI1KeyComponents>
    ): Partial<UserKey & UserGSI1Key> => {
      return {
        ...authTable.user.getKey(item),
        ...authTable.user.getGSI1Key(item),
      };
    },
    getKey: (item: UserKeyComponents): UserKey | undefined => {
      if (item.id && item.type) {
        return { PK: item.type, SK: item.id };
      }
    },
    getGSI1Key: (
      item: Partial<UserGSI1KeyComponents>
    ): UserGSI1Key | undefined => {
      if (item.username && item.type) {
        return { GSI1PK: item.type, GSI1SK: item.username };
      }
    },
    sanitize: (item: UserDBData): UserData => {
      const newItem = {
        ...item,
        PK: undefined,
        SK: undefined,
        GSI1PK: undefined,
        GSI1SK: undefined,
      };
      delete newItem.PK;
      delete newItem.SK;
      delete newItem.GSI1PK;
      delete newItem.GSI1SK;
      return newItem;
    },
    getByUsername: async (
      keyComponents: UserGSI1KeyComponents
    ): Promise<UserData | undefined> => {
      const keys = authTable.user.getGSI1Key(keyComponents);
      const { Items } = await GetObjectsFromDynamoIndex({
        TableName: getTableName(TABLES.AUTH),
        IndexName: "GSI1",
        KeyConditionExpression: "#PK = :PK AND #SK = :SK",
        ExpressionAttributeNames: {
          "#PK": "GSI1PK",
          "#SK": "GSI1SK",
        },
        ExpressionAttributeValues: {
          ":PK": keys?.GSI1PK,
          ":SK": keys?.GSI1SK,
        },
      });

      const user = Items?.length ? (Items[0] as UserDBData) : undefined;
      return user ? authTable.user.sanitize(user) : undefined;
    },

    get: async (keyComponents: UserKeyComponents) => {
      const keys = authTable.user.getKey(keyComponents);
      const { Item } = (await GetObjectFromDynamo({
        TableName: getTableName(TABLES.AUTH),
        Key: {
          PK: keys?.PK,
          SK: keys?.SK,
        } as MinAuthDBData,
      })) as { Item: UserDBData | undefined };
      return Item ? authTable.user.sanitize(Item) : undefined;
    },

    getAll: async (input: { type: PartitionName }) => {
      const { Items } = (await GetAllInPartitionFromDynamo({
        TableName: getTableName(TABLES.AUTH),
        Partition: input.type,
      })) as { Items: UserDBData[] | undefined };

      Items?.forEach(authTable.user.sanitize);
      return Items;
    },
    create: async (item: UserData, options?: { forceCreate?: boolean }) => {
      return await PutObjectToDynamo({
        TableName: getTableName(TABLES.AUTH),
        Item: {
          ...item,
          ...authTable.user.getKeys(item),
        },
        ConditionExpression: options?.forceCreate
          ? undefined
          : "attribute_not_exists(PK)",
      });
    },

    update: async (item: Partial<UserData> & UserKeyComponents) => {
      const Key = authTable.user.getKey(item);
      const GSI1Key = authTable.user.getGSI1Key({
        username: item.username,
        type: PARTITIONS.USER,
      });
      const updates = formatUpdateRequest({ item, ...GSI1Key });
      if (Key) {
        return await UpdateObjectInDynamo({
          TableName: getTableName(TABLES.AUTH),
          Key,
          ...updates,
        });
      } else
        throw Error(
          "Key not defined for update of item: " +
            Object.entries(item).toString()
        );
    },
    delete: async (keyComponents: UserKeyComponents) => {
      const Key = authTable.user.getKey(keyComponents);
      if (Key) {
        return await DeleteObjectFromDynamo({
          TableName: getTableName(TABLES.AUTH),
          Key,
        });
      } else
        throw Error(
          "Key not defined for delete of item with keyComponents: " +
            Object.entries(keyComponents).toString()
        );
    },
  },
  token: {
    getKey: (item: TokenKeyComponents): TokenKey | undefined => {
      if (
        item.id &&
        (item.valid === true || item.valid === false) &&
        item.tokenHash &&
        item.type
      ) {
        return {
          PK: item.type,
          SK: `${item.id}#${item.valid ? "active" : "expired"}#${
            item.tokenHash
          }`,
        };
      }
    },
    sanitize: (item: TokenDBData): TokenData => {
      const newItem = {
        ...item,
        PK: undefined,
        SK: undefined,
        GSI1PK: undefined,
        GSI1SK: undefined,
      };
      delete newItem.PK;
      delete newItem.SK;
      delete newItem.GSI1PK;
      delete newItem.GSI1SK;
      return newItem;
    },

    get: async (keyComponents: TokenKeyComponents) => {
      const Key = authTable.token.getKey(keyComponents);
      if (Key) {
        const { Item } = await GetObjectFromDynamo({
          TableName: getTableName(TABLES.AUTH),
          Key,
        });
        return Item ? authTable.token.sanitize(Item as TokenDBData) : undefined;
      } else {
        throw Error(
          "Key not defined for read of keyComponents: " +
            Object.entries(keyComponents).toString()
        );
      }
    },

    create: async (item: TokenData, options?: { forceCreate?: boolean }) => {
      const Key = authTable.token.getKey(item);
      if (Key) {
        return await PutObjectToDynamo({
          TableName: getTableName(TABLES.AUTH),
          Item: { ...item, ...Key },
          ConditionExpression: options?.forceCreate
            ? undefined
            : "attribute_not_exists(PK)",
        });
      } else {
        throw Error(
          "Key not defined for create of item: " +
            Object.entries(item).toString()
        );
      }
    },

    invalidate: async (item: TokenKeyComponents & { valid: true }) => {
      const Key = authTable.token.getKey({ ...item });
      const NewKey = authTable.token.getKey({ ...item, valid: false });
      const updates = formatUpdateRequest({ item, ...NewKey });
      if (Key) {
        return await UpdateObjectInDynamo({
          TableName: getTableName(TABLES.AUTH),
          Key,
          ...updates,
        });
      } else {
        throw Error(
          "Key not defined for invalidate of item: " +
            Object.entries(item).toString()
        );
      }
    },
  },
};

export const formatUpdateRequest = <Item extends Object>(
  rawUpdateData: Item
) => {
  const updateData = pruneObject(rawUpdateData);
  if (!Object.keys(updateData).length)
    return {
      updateString: undefined,
      attributeNames: undefined,
      attributeValues: undefined,
    };
  const [updates, attributeNames, attributeValues] = Object.entries(
    updateData
  ).reduce(
    ([updates, attributeNames, attributeValues], [name, value]) => [
      [...updates, `#${name} = :${name}`],
      {
        ...attributeNames,
        [`#${name}`]: name,
      },
      {
        ...attributeValues,
        [`:${name}`]: value,
      },
    ],
    [[] as string[], {} as Record<string, string>, {} as Record<string, any>]
  );
  return {
    UpdateExpression: `SET ${updates.join(",")}`,
    ExpressionAttributeValues: attributeValues,
    ExpressionAttributeNames: attributeNames,
  };
};
