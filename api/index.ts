import { PartitionName } from "../backend/utils/busTable";
import { logger } from "../logger";
import { BlogData, BlogKeyComponents } from "../types";

export const BlogApi = {
  // V2
  isViewable: (blog: BlogData): boolean => {
    if (blog.isHidden === true) {
      return false;
    }
    if (!blog?.arrival) {
      return false;
    }
    return true;
  },
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
    const getURL = new URL(`/api/${type}`, process.env.NEXT_PUBLIC_SITE_URL);
    try {
      const res = await fetch(getURL, {
        method: "GET",
      });
      const body = await res.json();
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
    const getURL = new URL(
      `/api/${type}/${slug}`,
      process.env.NEXT_PUBLIC_SITE_URL
    );
    try {
      const res = await fetch(getURL, {
        method: "GET",
      });
      const body = await res.json();
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },

  update: async (
    data: Partial<BlogData> & BlogKeyComponents
  ): Promise<{ success: boolean } & any> => {
    const updateUrl = new URL(
      `/api/${data.type}/${data.slug}`,
      process.env.NEXT_PUBLIC_SITE_URL
    );
    try {
      const res = await fetch(updateUrl, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const body = await res.json();
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },

  create: async (data: BlogData): Promise<{ success: boolean } & any> => {
    const createUrl = new URL(
      `/api/${data.type}/${data.slug}/`,
      process.env.NEXT_PUBLIC_SITE_URL
    );
    try {
      const res = await fetch(createUrl, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const body = await res.json();
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },

  delete: async (
    data: BlogKeyComponents
  ): Promise<{ success: boolean } & any> => {
    const createUrl = new URL(
      `/api/${data.type}/${data.slug}/`,
      process.env.NEXT_PUBLIC_SITE_URL
    );
    try {
      const res = await fetch(createUrl, {
        method: "DELETE",
      });
      const body = await res.json();
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },
};
