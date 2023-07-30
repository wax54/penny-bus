import { InferGetStaticPropsType } from "next";
import * as publicSingleBlogPage from "../../blog/[slug]";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useEffect, useState } from "react";
import { BlogApi } from "../../../api";

export const getStaticPaths = publicSingleBlogPage.getStaticPaths;
export const getStaticProps = publicSingleBlogPage.getStaticProps;

export const UpdateBlog = ({
  blog,
  slug,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [currBlog, setCurrBlog] = useState(blog);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("EFFECT");
    setLoading(true);
    BlogApi.update(slug, currBlog.body ?? "")
      .then((resp) => {
        setLoading(false);
      })
      .catch((e) => setLoading(false));
  }, [currBlog.body, setLoading]);
  return (
    <div className="bg-offWhite flex">
      <div className="p-4 flex-1">
        <div className="h-[20px] bg-accent">
          {loading ? "SYNCING" : "IN SYNC"}
        </div>

        <input
          name="title"
          className="my-4 p-4 w-full"
          value={currBlog.title}
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrBlog((blog) => ({ ...blog, [name]: value }));
          }}
        />
        <div>
          {Object.entries(blog.date).map(([k, v]) => (
            <div key={k}>
              <span>{k}: </span>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <textarea
          name="body"
          className=" my-4 p-4 w-full h-full"
          value={currBlog.body}
          onChange={(evt) => {
            const { value } = evt.target;
            setCurrBlog((blog) => ({ ...blog, body: value }));
          }}
        />
      </div>
      <div className="flex-1">
        <publicSingleBlogPage.BlogPost blog={currBlog} />
      </div>
    </div>
  );
};

export default UpdateBlog;
