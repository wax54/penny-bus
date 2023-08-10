import { PARTITIONS, PartitionName } from "../backend/utils/busTable";

export type MinDBData = {
  PK: PartitionName;
  SK: string;
};

export type BlogKey = {
  PK: typeof PARTITIONS.BLOG;
  SK: string;
};

export type BlogKeyComponents = {
  slug: string;
  type: typeof PARTITIONS.BLOG;
};

export type BlogData = BlogKeyComponents & {
  title: string;
  subtitle?: string;
  arrival: string;
  departure: string;
  body?: string;
  author: string;
  fee?: number;
  bodyLink?: string;
  isHidden?: boolean;
};
export type BlogDBData = BlogKey & BlogData;

export type BusTableItem = BlogData;
export type BusTableKeyComponents = BlogKeyComponents;
export type BusTableDBItem = MinDBData & BlogDBData;
