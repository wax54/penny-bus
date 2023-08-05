import { InferGetStaticPropsType } from "next";
import * as publicBlogPage from "../../blog/index";
import { useState } from "react";
import { BlogApi } from "../../../api";
export const getStaticProps = publicBlogPage.getStaticProps;
export const UpdateBlog = ({
  blogs,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [showCreator, setShowCreator] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newBody, setNewBody] = useState("");
  const [loading, setLoading] = useState(false);
  const makeNewPost = (blog: { slugId: string; body: string }) => {
    console.log(blog);
    setLoading(true);
    BlogApi.update(blog.slugId, blog.body)
      .then((resp) => {
        setLoading(false);
        // blogRef.current = { ...blogRef.current, ...updatedBlog };
      })
      .catch((e) => setLoading(false));
  };
  return (
    <div className="bg-offWhite">
      <button onClick={() => setShowCreator((state) => !state)}>
        New post
      </button>
      <div className={showCreator ? "" : "hidden"}>
        <input
          value={newSlug}
          onChange={(evt) => {
            const { value } = evt.target;
            setNewSlug(value.replace(/\s/g, ""));
          }}
        />

        <textarea
          name="body"
          className=" my-4 p-4 w-full h-full"
          value={newBody}
          onChange={(evt) => {
            const { value } = evt.target;
            setNewBody(value);
          }}
        />
        <button
          disabled={loading || !newSlug || !newBody}
          onClick={() => makeNewPost({ slugId: newSlug, body: newBody })}
        >
          {loading ? "Loading" : "Create!"}
        </button>
      </div>
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
