import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
} from "next";
import * as publicSingleBlogPage from "../../blog/[slug]";
// import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useCallback, useEffect, useRef, useState } from "react";
import { Api } from "../../../api";
import {
  BlogData,
  BlogKeyComponents,
  LocationData,
  PARTITIONS,
} from "../../../types";
import { NEW_BLOG_SLUG } from "../../../constants/config";
import { useRouter } from "next/router";
import Link from "next/link";
import { useLocations } from "../../../providers/dataStore";
import { ImagePreview } from "../../../components/ImagePreview";
import { Input } from "../../../components/Input";

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
          locationSlug: "",
          departure: "",
          body: "",
          author: "",
          fee: 0,
          isHidden: true,
        } as BlogData)
  );
  const locations = useLocations();
  const [currBlog, setCurrBlog] = useState(blogRef.current);
  const [loading, setLoading] = useState(false);
  const inSync = Object.entries(currBlog).every(
    ([key, val]) =>
      JSON.stringify(val) ===
      JSON.stringify(blogRef.current[key as keyof typeof currBlog])
  );
  const updateBlog = useCallback(
    (updatedBlog: BlogData & BlogKeyComponents) => {
      setLoading(true);
      const manipulation =
        slug === NEW_BLOG_SLUG ? Api.create<BlogData> : Api.update<BlogData>;
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
    const manipulation = Api.delete;
    manipulation({ type: currBlog.type, slug: currBlog.slug })
      .then((res) => {
        setLoading(false);
        setTimeout(() => router.push("/admin/blog"), 200);
      })
      .catch((e) => setLoading(false));
  }, [slug, setLoading, router, currBlog.slug, currBlog.type]);

  return (
    <div className="bg-white flex flex-column sm:flex-row">
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

        <Input
          label="Slug"
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

        <Input
          label="Title"
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

        <Input
          label="Subtitle"
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
        {locations?.loading ? (
          "..."
        ) : locations?.data ? (
          <Input
            inputType="select"
            label="Location"
            name="locationSlug"
            className="my-4 p-4 w-full"
            placeholder="Location"
            disabled={loading}
            value={currBlog.locationSlug}
            onChange={(evt) => {
              const { value, name } = evt.target;
              setCurrBlog((blog) => ({
                ...blog,
                [name]: value,
              }));
            }}
          >
            <option value="">Select</option>
            {locations.data.map((location) => (
              <option key={location.slug} value={location.slug}>
                {location.name} ({location.city})
              </option>
            ))}
          </Input>
        ) : (
          "ERROR: " + (locations?.error ?? "unknown")
        )}
        <Input
          label="fee"
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
          <Input
            label="arrival"
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
          <Input
            label="departure"
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
            const _replace = (value: string) => {
              const locationImages =
                currBlog.locationSlug &&
                locations?.data &&
                locations.data.find(
                  (location) => location.slug === currBlog.locationSlug
                )?.images;
              if (!locationImages) {
                return value;
              } else {
                for (let image of locationImages) {
                  value = value.replace(
                    `{{${image.ref}}}`,
                    `![test](${process.env.NEXT_PUBLIC_SITE_URL}/images/${image.path})`
                  );
                  value = value.replace(
                    `{{${image.name}}`,
                    `![test](${process.env.NEXT_PUBLIC_SITE_URL}/images/${
                      image.path ?? ""
                    })`
                  );
                }
              }
              return value;
            };
            const valWithReplacement = _replace(value);
            setCurrBlog((blog) => ({ ...blog, body: valWithReplacement }));
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

        {currBlog?.locationSlug && locations?.data
          ? locations.data
              .find((l) => l.slug === currBlog.locationSlug)
              ?.images?.map((image) => (
                <ImagePreview key={image.name} image={image} />
              ))
          : null}
        <div>
          <input
            name="isHidden"
            id="isHidden"
            type="checkbox"
            className="my-4 p-4 w-full"
            disabled={loading}
            checked={currBlog.isHidden ? true : false}
            onChange={(evt) => {
              const { checked, name } = evt.target
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
