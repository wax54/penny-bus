import { InferGetStaticPropsType } from "next";
import * as publicSingleBlogPage from "../../blog/[slug]";
// import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useCallback, useEffect, useRef, useState } from "react";
import { BlogApi } from "../../../api";
import { BlogData } from "../../../types";

// export const getStaticPaths = publicSingleBlogPage.getStaticPaths;
export const getServerSideProps = publicSingleBlogPage.getStaticProps;

export const UpdateBlog = ({
  blog,
  slug,
}: InferGetStaticPropsType<typeof getServerSideProps>) => {
  const blogRef = useRef(blog);
  const [currBlog, setCurrBlog] = useState(blog);
  const [loading, setLoading] = useState(false);
  const inSync = currBlog.body === blogRef.current.body;
  const updateBlog = useCallback(
    (updatedBlog: Pick<BlogData, "body">) => {
      console.log("UPDATING", updatedBlog);
      setLoading(true);
      BlogApi.update(slug, updatedBlog.body ?? "")
        .then((resp) => {
          setLoading(false);
          blogRef.current = { ...blogRef.current, ...updatedBlog };
        })
        .catch((e) => setLoading(false));
    },
    [slug, currBlog.body, setLoading]
  );
  return (
    <div className="bg-offWhite flex">
      <div className="p-4 flex-1">
        <div className="h-[20px]">
          {loading ? (
            <div className="bg-secondary">LOADING</div>
          ) : inSync ? (
            <div className="bg-accent">IN SYNC</div>
          ) : (
            <button
              className="bg-primary "
              onClick={() => updateBlog(currBlog)}
            >
              SYNC NOW
            </button>
          )}
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
