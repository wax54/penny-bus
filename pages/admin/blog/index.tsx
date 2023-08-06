import { InferGetStaticPropsType } from "next";
import * as publicBlogPage from "../../blog/index";
import { useState } from "react";
import { BlogApi } from "../../../api";
import { NEW_BLOG_SLUG } from "../../../constants/config";
export const getServerSideProps = publicBlogPage.getServerSideProps;
export const UpdateBlog = ({
  blogs,
}: InferGetStaticPropsType<typeof getServerSideProps>) => {
  return (
    <div className="bg-offWhite">
      <a href={`./blog/${NEW_BLOG_SLUG}`}>New post</a>
      {blogs
        ? blogs.map((blog) => {
            return (
              <a
                className="block my-5 px-2"
                href={`./blog/` + blog.slug}
                key={blog.slug}
              >
                t: {blog.title} k: {blog.slug}
              </a>
            );
          })
        : "NO BLOGS"}
    </div>
  );
};

export default UpdateBlog;
