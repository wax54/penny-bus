import { PARTITIONS } from "./busTable";

export type BlogKey = {
  PK: typeof PARTITIONS.BLOG;
  SK: string;
};

export type BlogKeyComponents = {
  type: typeof PARTITIONS.BLOG;
  slug: string;
};

export type BlogData = BlogKeyComponents & {
  title: string;
  subtitle?: string;
  arrival: string;
  departure: string;
  body?: string;
  author: string;
  locationSlug: string;
  fee?: number;
  bodyLink?: string;
  isHidden?: boolean;
};
export type BlogDBData = BlogKey & BlogData;
