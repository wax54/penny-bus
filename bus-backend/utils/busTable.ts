import {
  BlogDBData,
  BusTableDBItem,
  BusTableItem,
  BusTableKeyComponents,
  MinBusDBData,
} from "../../types";
import {
  DeleteObjectFromDynamo,
  GetAllInPartitionFromDynamo,
  GetObjectFromDynamo,
  PutObjectToDynamo,
  UpdateObjectInDynamo,
} from "../../shared-utils/dynamo";
import { PartitionName } from "../../types/busTable";
import { pruneObject } from "./common";

export const TABLES = {
  BUS: "bus",
} as const;
export type TableName = (typeof TABLES)[keyof typeof TABLES];

const getTableName = (table: TableName): string => {
  let tableName;
  if (table === TABLES.BUS) {
    tableName = process.env.BUS_TABLE;
  }
  if (!tableName) {
    throw Error("No table name defined for table " + table);
  }
  return tableName;
};

const sanitize = (item: BusTableDBItem): BusTableItem => {
  const newItem = { ...item, PK: undefined, SK: undefined };
  delete newItem.PK;
  delete newItem.SK;
  return newItem;
};
export const busTable = {
  get: async (item: BusTableKeyComponents) => {
    const { Item } = (await GetObjectFromDynamo({
      TableName: getTableName(TABLES.BUS),
      Key: {
        PK: item.type,
        SK: item.slug,
      } as MinBusDBData,
    })) as { Item: BusTableDBItem | undefined };
    return Item ? sanitize(Item) : undefined;
  },
  getAll: async (input: { type: PartitionName }) => {
    const { Items } = (await GetAllInPartitionFromDynamo({
      TableName: getTableName(TABLES.BUS),
      Partition: input.type,
    })) as { Items: BusTableDBItem[] | undefined };

    Items?.forEach(sanitize);
    return Items;
  },
  create: async (item: BusTableItem, options?: { forceCreate?: boolean }) => {
    return await PutObjectToDynamo({
      TableName: getTableName(TABLES.BUS),
      Item: { ...item, PK: item.type, SK: item.slug } as BusTableDBItem,

      ConditionExpression: options?.forceCreate
        ? undefined
        : "attribute_not_exists(PK) AND attribute_not_exists(SK)",
    });
  },
  update: async (item: Partial<BusTableItem> & BusTableKeyComponents) => {
    const updates = formatUpdateRequest(item);

    return await UpdateObjectInDynamo({
      TableName: getTableName(TABLES.BUS),
      Key: {
        PK: item.type,
        SK: item.slug,
      } as MinBusDBData,
      ...updates,
    });
  },
  delete: async (item: BusTableKeyComponents) => {
    return await DeleteObjectFromDynamo({
      TableName: getTableName(TABLES.BUS),
      Key: {
        PK: item.type,
        SK: item.slug,
      } as MinBusDBData,
    });
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
