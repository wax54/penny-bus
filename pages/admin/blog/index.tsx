import { InferGetStaticPropsType } from "next";
import * as publicBlogPage from "../../blog/index";
import { useState } from "react";
import { BlogApi } from "../../../api";
import { NEW_BLOG_SLUG } from "../../../constants/config";
export const getStaticProps = publicBlogPage.getStaticProps;
export const UpdateBlog = ({
  blogs,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="bg-offWhite">
      <a href={`./blog/${NEW_BLOG_SLUG}`}>New post</a>
      {blogs.map(({ key, blog }) => {
        return (
          <a className="block my-5 px-2" href={`./blog/` + key} key={key}>
            t: {blog.title} k: {key}
          </a>
        );
      })}
    </div>
  );
};

export default UpdateBlog;
