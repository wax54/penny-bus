import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { Layout } from "../../components/Layout";
import { nav } from "../../constants/nav";
import { BlogDate, BlogData } from "../../types";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { styles } from "../../constants/styles";
import { BlogApi } from "../../api";

export function BlogPost({ blog }: { blog: BlogData }) {
  console.log(blog);
  function DateStamp({ date }: { date: BlogDate }) {
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
          {new Date(date.arrival).toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "long",
          })}
        </p>
        <p>
          Departed:{" "}
          {new Date(date.departure).toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "long",
          })}
        </p>

        <p>
          Stay length:{" "}
          {getStayLength(
            new Date(date.departure).getTime() -
              new Date(date.arrival).getTime()
          )}
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="bg-accent/30 text-white mt-[20px] p-10 rounded-ss-[100px]">
        <h1>{blog.title}</h1>
        <h2>{blog.subtitle}</h2>
        <div className="pb-10">
          <DateStamp date={blog.date} />
        </div>
        {blog.body ? (
          <ReactMarkdown className="">
            {blog.body.replace(/\n/gi, "\n &nbsp;  \n  ")}
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
    <Layout nav={nav} style={styles}>
      <BlogPost blog={blog} />
    </Layout>
  );
}
export async function getStaticPaths({}: GetStaticPathsContext): Promise<GetStaticPathsResult> {
  const blogs = await BlogApi.getAll();
  const keys = blogs.map((blog) => ({ params: { slug: blog.key } }));
  console.log(keys);
  return {
    paths: keys,
    fallback: "blocking",
  };
}
export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ slug: string }>): Promise<
  GetStaticPropsResult<{
    blog: BlogData;
    slug: string;
  }>
> {
  if (!params)
    return {
      redirect: { destination: "/", permanent: false },
    };
  const slug = params.slug;
  const { status, blog, error } = await BlogApi.get(slug);

  if (status !== "success") {
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
  return { props: { blog, slug } };
}
