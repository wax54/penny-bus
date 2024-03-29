import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { Layout } from "../../components/Layout";
import { BlogData, PARTITIONS } from "../../types";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { styles } from "../../constants/styles";
import { Api } from "../../api";
import { NEW_BLOG_SLUG } from "../../constants/config";

export function BlogPost({ blog }: { blog: BlogData }) {
  function DateStamp({
    arrival,
    departure,
  }: Pick<BlogData, "arrival" | "departure">) {
    function getStayLength(lengthMS: number) {
      let hours = Math.round(lengthMS / 1000 / 60 / 60);
      let days = 0;
      while (hours > 24) {
        hours -= 24;
        days += 1;
      }
      if (days > 0 && hours > 12) {
        hours = 0;
        days += 1;
      }
      return `~ ${days > 0 ? `${days} Days` : ""}${
        days > 0 && hours > 0 ? ", " : ""
      }${hours > 0 ? `${hours} Hours` : ""}`;
    }
    return (
      <div>
        <p>
          Arrived:{" "}
          {new Date(arrival).toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "long",
          })}
        </p>
        <p>
          Departed:{" "}
          {new Date(departure).toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "long",
          })}
        </p>

        <p>
          Stay length:{" "}
          {getStayLength(
            new Date(departure).getTime() - new Date(arrival).getTime()
          )}
        </p>
      </div>
    );
  }
  if (!blog) return <div>LOADING</div>;
  return (
    <>
      <div className="bg-accent/30 text-white mt-[20px] p-10 rounded-ss-[100px]">
        <h1>{blog.title}</h1>
        <h2>{blog.subtitle}</h2>
        <div className="pb-10">
          <DateStamp {...blog} />
        </div>
        {blog.body ? (
          <ReactMarkdown className="">
            {blog.body
              ? blog.body.replace(/\n/gi, "\n &nbsp;  \n  ")
              : "PRE RENDER"}
          </ReactMarkdown>
        ) : null}
        <p
          style={{
            padding: 10,
          }}
        >
          <em>Author: {blog.author}</em>
        </p>
      </div>
    </>
  );
}

export default function Blog({
  blog,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!blog) {
    return <div>LOADING!</div>;
  }
  return (
    <Layout style={styles}>
      <BlogPost blog={blog} />
    </Layout>
  );
}
export async function getStaticPaths({}: GetStaticPathsContext): Promise<GetStaticPathsResult> {
  const blogs = await Api.getAll<BlogData>({ type: PARTITIONS.BLOG });
  const keys =
    blogs.body?.items.map((blog) => ({ params: { slug: blog.slug } })) ?? [];
  return {
    paths: keys,
    fallback: "blocking",
  };
}
export async function getStaticProps(
  { params }: GetStaticPropsContext<{ slug: string }>,
  admin?: boolean
): Promise<
  GetStaticPropsResult<{
    blog?: BlogData;
    slug: string;
    admin?: boolean;
  }>
> {
  if (!params)
    return {
      redirect: { destination: "/", permanent: false },
    };
  const slug = params.slug;
  if (admin && slug === NEW_BLOG_SLUG) {
    return { props: { slug, admin } };
  }
  const { success, body, error } = await Api.get<BlogData>({
    type: PARTITIONS.BLOG,
    slug,
  });
  console.log({ body, error, success });

  if (!success) {
    const redirect = new URLSearchParams({
      reason: error ?? `${slug}+blog+not+found`,
      redirect: `/blog/${slug}`,
    });
    return {
      redirect: {
        destination: "/404?" + redirect,
        permanent: false,
      },
    };
  }
  return { props: { blog: body, slug } };
}
