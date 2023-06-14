import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { Layout } from "../../components/Layout";
import { nav } from "../../constants/nav";
import db from "../../db";
import { BlogDate, Blog as BlogType } from "../../types";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

function BlogPost({ blog }: { blog: BlogType }) {
  function DateStamp({ date }: { date: BlogDate }) {
    function getStayLength(lengthMS: number) {
      let hours = Math.round(lengthMS / 1000 / 60 / 60);
      let days = 0;
      console.log({ hours, days });
      while (hours > 24) {
        hours -= 24;
        days += 1;
      }
      console.log({ hours, days });

      return `~ ${days > 0 ? `${days} Days, ` : ""}${
        hours > 0 ? `${hours} Hours` : ""
      }`;
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
    <div style={{ padding: 20, color: "white" }}>
      <h1>{blog.title}</h1>
      <h2>{blog.subtitle}</h2>
      <DateStamp date={blog.date} />
      {blog.body.map((text) => (
        <ReactMarkdown>{text}</ReactMarkdown>
      ))}
    </div>
  );
}

export default function Blog({
  blog,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout nav={nav}>
      <BlogPost blog={blog} />
    </Layout>
  );
}
export function getStaticPaths({}: GetStaticPathsContext): GetStaticPathsResult {
  return {
    paths: [],
    fallback: "blocking",
  };
}
export function getStaticProps({
  params,
}: GetStaticPropsContext<{ slug: string }>): GetStaticPropsResult<{
  blog: BlogType;
}> {
  if (!params)
    return {
      redirect: { destination: "/", permanent: false },
    };
  console.log({ params });
  const slug = params.slug;
  const blog = db.blog[slug];

  if (!blog)
    return {
      redirect: {
        destination: `/404?reason=${slug}++blog+not+found+`,
        permanent: false,
      },
    };
  return { props: { blog } };
}
