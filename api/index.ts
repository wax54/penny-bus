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
    const blogBodyUrl = new URL(
      blog.bodyLink ?? "/db/blog-articles/" + slug + ".md",
      process.env.NEXT_PUBLIC_SITE_URL
    );
    try {
      const res = await fetch(blogBodyUrl);
      const body = await res.text();
      if (body) {
        console.log("bpyddda####", body);
        blog.body = body;
      }
    } catch (e) {
      logger(e, "ERROR");
    }
    console.log("bpyddda####", blog);

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

  update: async (
    slug: string,
    newBody: string
  ): Promise<{ success: boolean } & any> => {
    console.log("NE", process.env.NEXT_PUBLIC_SITE_URL);
    const updateUrl = new URL("/api/update", process.env.NEXT_PUBLIC_SITE_URL);
    try {
      const res = await fetch(updateUrl, {
        method: "PUT",
        body: JSON.stringify({
          blog: {
            slug: slug,
            body: newBody,
          },
        }),
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
