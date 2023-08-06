import { PartitionName } from "../backend/utils/busTable";
import { logger } from "../logger";
import { BlogData, BlogKeyComponents } from "../types";

export const BlogApi = {
  getAll: async ({
    type,
  }: {
    type: PartitionName;
  }): Promise<
    | {
        success: true;
        body: { items: BlogData[]; total: number };
        error?: undefined;
      }
    | { success: false; error: string; body?: undefined }
  > => {
    console.log("NE", process.env.NEXT_PUBLIC_SITE_URL);
    const getURL = new URL(
      `/api/get/${type}`,
      process.env.NEXT_PUBLIC_SITE_URL
    );
    try {
      const res = await fetch(getURL, {
        method: "GET",
      });
      const body = await res.json();
      console.log(body);
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },
  get: async ({
    type,
    slug,
  }: BlogKeyComponents): Promise<
    | { success: true; body: BlogData; error?: undefined }
    | { success: false; error: string; body?: undefined }
  > => {
    console.log("NE", process.env.NEXT_PUBLIC_SITE_URL);
    const getURL = new URL(
      `/api/get/${type}/${slug}`,
      process.env.NEXT_PUBLIC_SITE_URL
    );
    try {
      const res = await fetch(getURL, {
        method: "GET",
      });
      const body = await res.json();
      console.log(body);
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },
  // V2
  isViewable: (blog: BlogData): boolean => {
    if (
      blog.isHidden &&
      (blog.isHidden === true ||
        (blog.isHidden?.releaseDate &&
          new Date(blog.isHidden.releaseDate) > new Date()))
    ) {
      return false;
    }
    if (!blog?.arrival) {
      return false;
    }
    return true;
  },

  update: async (
    data: Partial<BlogData> & BlogKeyComponents
  ): Promise<{ success: boolean } & any> => {
    console.log("NE", process.env.NEXT_PUBLIC_SITE_URL);
    const updateUrl = new URL("/api/update", process.env.NEXT_PUBLIC_SITE_URL);
    try {
      const res = await fetch(updateUrl, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const body = await res.json();
      console.log(body);
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },

  create: async (data: BlogData): Promise<{ success: boolean } & any> => {
    console.log("NE", process.env.NEXT_PUBLIC_SITE_URL);
    const createUrl = new URL("/api/create", process.env.NEXT_PUBLIC_SITE_URL);
    try {
      const res = await fetch(createUrl, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const body = await res.json();
      console.log(body);
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },
};
