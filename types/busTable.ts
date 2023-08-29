import { BlogDBData, BlogData, BlogKeyComponents } from "./blog";
import {
  LocationDBData,
  LocationData,
  LocationKeyComponents,
} from "./location";

export const PARTITIONS = {
  BLOG: "blog",
  LOCATION: "location",
} as const;
export type PartitionName = (typeof PARTITIONS)[keyof typeof PARTITIONS];

export type MinBusDBData = {
  PK: PartitionName;
  SK: string;
};

export type BusTableItem = LocationData | BlogData;
export type BusTableKeyComponents = LocationKeyComponents | BlogKeyComponents;
export type BusTableDBItem = MinBusDBData & (BlogDBData | LocationDBData);
