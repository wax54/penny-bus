import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
} from "next";
import * as publicSingleBlogPage from "../../blog/[slug]";
// import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useCallback, useEffect, useRef, useState } from "react";
import { BlogApi } from "../../../api";
import { BlogData, BlogKeyComponents } from "../../../types";
import { PARTITIONS } from "../../../bus-backend/utils/busTable";
import { NEW_BLOG_SLUG } from "../../../constants/config";
import { useRouter } from "next/router";
import Link from "next/link";

// export const getStaticPaths = publicSingleBlogPage.getStaticPaths;
export const getServerSideProps = (
  params: GetServerSidePropsContext<{ slug: string }>
) => {
  return publicSingleBlogPage.getStaticProps(params, true);
};

export const UpdateBlog = ({
  blog,
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log("blog", slug);
  const router = useRouter();
  const blogRef = useRef(
    blog
      ? blog
      : ({
          type: PARTITIONS.BLOG,
          slug: "",
          title: "",
          subtitle: "",
          arrival: "",
          departure: "",
          body: "",
          author: "",
          fee: 0,
          isHidden: true,
        } as BlogData)
  );
  const [currBlog, setCurrBlog] = useState(blogRef.current);
  const [loading, setLoading] = useState(false);
  const inSync = Object.entries(currBlog).every(
    ([key, val]) =>
      JSON.stringify(val) ===
      JSON.stringify(blogRef.current[key as keyof typeof currBlog])
  );
  console.log({ inSync });
  const updateBlog = useCallback(
    (updatedBlog: BlogData & BlogKeyComponents) => {
      setLoading(true);
      const manipulation =
        slug === NEW_BLOG_SLUG ? BlogApi.create : BlogApi.update;
      manipulation({ ...updatedBlog })
        .then(() => {
          setLoading(false);
          blogRef.current = { ...blogRef.current, ...updatedBlog };
          if (slug === NEW_BLOG_SLUG) {
            router.push("./" + updatedBlog.slug);
          }
        })
        .catch((e) => {
          setLoading(false);
        });
    },
    [slug, setLoading, router]
  );

  const deleteBlog = useCallback(() => {
    setLoading(true);
    const manipulation = BlogApi.delete;
    manipulation({ type: currBlog.type, slug: currBlog.slug })
      .then((res) => {
        setLoading(false);
        console.log("DONE", res);
        setTimeout(() => router.push("/admin/blog"), 200);
      })
      .catch((e) => setLoading(false));
  }, [slug, setLoading, router]);
  return (
    <div className="bg-offWhite flex flex-column sm:flex-row">
      <Link href="/admin/blog">Blog list</Link>
      <div className="p-4 flex-1">
        <div className="h-[20px]">
          {loading ? (
            <div className="bg-secondary">Loading</div>
          ) : inSync && slug !== NEW_BLOG_SLUG ? (
            <div className="bg-accent">In sync</div>
          ) : (
            <button
              className="bg-primary "
              onClick={() => updateBlog(currBlog)}
            >
              {slug === NEW_BLOG_SLUG ? "Create" : "Sync now"}
            </button>
          )}
        </div>

        <input
          name="slug"
          disabled={slug !== NEW_BLOG_SLUG || loading}
          className="my-4 p-4 w-full"
          placeholder="Slug"
          value={currBlog.slug}
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrBlog((blog) => ({
              ...blog,
              [name]: value.replace(/\s/, ""),
            }));
          }}
        />

        <input
          name="title"
          className="my-4 p-4 w-full"
          disabled={loading}
          placeholder="Title"
          value={currBlog.title}
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrBlog((blog) => ({ ...blog, [name]: value }));
          }}
        />

        <input
          name="subtitle"
          disabled={loading}
          className="my-4 p-4 w-full"
          placeholder="Subtitle"
          value={currBlog.subtitle}
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrBlog((blog) => ({ ...blog, [name]: value }));
          }}
        />

        <input
          name="fee"
          className="my-4 p-4 w-full"
          disabled={loading}
          placeholder="Fee"
          value={currBlog.fee}
          type="number"
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrBlog((blog) => ({ ...blog, [name]: value }));
          }}
        />
        <div>
          <input
            name="arrival"
            type="datetime-local"
            disabled={loading}
            placeholder="Arrival"
            className="my-4 p-4 w-full"
            value={currBlog.arrival}
            onChange={(evt) => {
              const { value, name } = evt.target;
              setCurrBlog((blog) => ({
                ...blog,
                [name]: value,
              }));
            }}
          />
          <input
            name="departure"
            type="datetime-local"
            disabled={loading}
            placeholder="Departure"
            className="my-4 p-4 w-full"
            value={currBlog.departure}
            onChange={(evt) => {
              const { value, name } = evt.target;
              setCurrBlog((blog) => ({
                ...blog,
                [name]: value,
              }));
            }}
          />
        </div>
        <textarea
          name="body"
          className=" my-4 p-4 w-full h-[600px]"
          disabled={loading}
          placeholder="Body"
          value={currBlog.body}
          onChange={(evt) => {
            const { value } = evt.target;
            setCurrBlog((blog) => ({ ...blog, body: value }));
          }}
        />

        <select
          name="author"
          className="my-4 p-4 w-full"
          placeholder="Author"
          disabled={loading}
          value={currBlog.author}
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrBlog((blog) => ({
              ...blog,
              [name]: value,
            }));
          }}
        >
          <option value="">Select</option>
          <option value="Zoë Williams">Z-Word</option>
          <option value="Sam Crewe-Sullam">SAMMA</option>
        </select>
        <div>
          <input
            id="isHidden"
            type="checkbox"
            name="isHidden"
            className="my-4 p-4 w-full"
            disabled={loading}
            checked={currBlog.isHidden ? true : false}
            onChange={(evt) => {
              const { checked, name } = evt.target;
              console.log({ checked });
              setCurrBlog((blog) => ({ ...blog, [name]: checked }));
            }}
          />
          <label htmlFor="isHidden">Is hidden</label>
        </div>
        {slug === NEW_BLOG_SLUG ? (
          <button
            className="bg-secondary hover:bg-primary p-2 rounded my-4"
            onClick={deleteBlog}
          >
            DELETE
          </button>
        ) : null}
      </div>

      <div className="flex-1">
        <publicSingleBlogPage.BlogPost blog={currBlog} />
      </div>
    </div>
  );
};

export default UpdateBlog;
