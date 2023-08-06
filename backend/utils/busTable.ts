import {
  BlogDBData,
  BusTableDBItem,
  BusTableItem,
  BusTableKeyComponents,
  MinDBData,
} from "../../types";
import {
  GetAllInPartitionFromDynamo,
  GetObjectFromDynamo,
  PutObjectToDynamo,
  UpdateObjectInDynamo,
} from "./dynamo";

export const TABLES = {
  BUS: "bus",
} as const;
export type TableName = (typeof TABLES)[keyof typeof TABLES];

export const PARTITIONS = {
  BLOG: "blog",
} as const;
export type PartitionName = (typeof PARTITIONS)[keyof typeof PARTITIONS];

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
      } as MinDBData,
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
  create: async (item: BusTableItem) => {
    return await PutObjectToDynamo({
      TableName: getTableName(TABLES.BUS),
      Item: { ...item, PK: item.type, SK: item.slug } as BlogDBData,
    });
  },
  update: async (item: Partial<BusTableItem> & BusTableKeyComponents) => {
    return await UpdateObjectInDynamo({
      TableName: getTableName(TABLES.BUS),
      Item: item,
      Key: {
        PK: item.type,
        SK: item.slug,
      } as MinDBData,
    });
  },
};
