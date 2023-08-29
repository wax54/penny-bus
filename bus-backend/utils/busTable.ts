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

export const TABLES = {
  BUS: "bus",
} as const;
export type TableName = (typeof TABLES)[keyof typeof TABLES];

const getTableName = (table: TableName): string => {
  let tableName;
  if (table === TABLES.BUS) {
    console.log("BUS")
    tableName = process.env.BUS_TABLE;
    console.log(tableName)
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
    return await UpdateObjectInDynamo({
      TableName: getTableName(TABLES.BUS),
      Item: item,
      Key: {
        PK: item.type,
        SK: item.slug,
      } as MinBusDBData,
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
