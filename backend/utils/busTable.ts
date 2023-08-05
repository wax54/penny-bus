import {
  BlogDBData,
  BusTableItem,
  BusTableKeyComponents,
  MinDBData,
} from "../../types";
import {
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

export const busTable = {
  get: async (key: BusTableKeyComponents) => {
    return await GetObjectFromDynamo({
      TableName: getTableName(TABLES.BUS),
      Key: key,
    });
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
