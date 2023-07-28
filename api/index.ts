import db from "../db";
import { logger } from "../logger";
import { BlogData } from "../types";

export const BlogApi = {
  getAll: async () => {
    return Object.keys(db.blog)
      .filter((key) => BlogApi.isViewable(db.blog[key]))
      .map((key) => ({
        key: key,
        blog: db.blog[key],
      }));
  },
  get: async (
    slug: string
  ): Promise<
    | { status: "success"; blog: BlogData; error?: undefined }
    | { status: "failed"; error: string; blog?: undefined }
  > => {
    const blog = db.blog[slug];
    if (blog.bodyLink) {
      const blogBodyUrl = new URL(blog.bodyLink, process.env.NEXT_SITE_URL);
      try {
        const res = await fetch(blogBodyUrl);
        const body = await res.text();
        blog.body = body.split("\n");
      } catch (e) {
        logger(e, "ERROR");
      }
    }
    if (!BlogApi.isViewable(blog))
      return { status: "failed", error: "Blog not viewable" };
    if (!blog) return { status: "failed", error: "Blog not found" };
    return { status: "success", blog };
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
    if (!blog?.date?.arrival) {
      return false;
    }
    return true;
  },

  // V1
  // isViewable: (blog: BlogData): boolean => {
  //   const doesArrivalExist = blog?.date?.arrival ? true : false;
  //   const isHidden =
  //     blog.isHidden &&
  //     (blog.isHidden === true ||
  //       (blog.isHidden.releaseDate &&
  //         new Date(blog.isHidden.releaseDate) > new Date()));
  //   return !isHidden && doesArrivalExist;
  // },
};
