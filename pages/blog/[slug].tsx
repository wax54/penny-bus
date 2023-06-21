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
import { styles } from "../../constants/styles";
import { CSSProperties } from "react";
import { brandColors } from "../../constants/colors";

function BlogPost({
  blog,
  style,
}: {
  blog: BlogType;
  style: { main: CSSProperties, author: CSSProperties };
}) {
  function DateStamp({ date }: { date: BlogDate }) {
    function getStayLength(lengthMS: number) {
      let hours = Math.round(lengthMS / 1000 / 60 / 60);
      let days = 0;
      while (hours > 24) {
        hours -= 24;
        days += 1;
      }

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
    <div style={style.main}>
      <h1>{blog.title}</h1>
      <h2>{blog.subtitle}</h2>
      <DateStamp date={blog.date} />
      {blog.body.map((text) => (
        <ReactMarkdown>{text}</ReactMarkdown>
      ))}
      <p style={style.author}><em>Author: {blog.author}</em></p>
    </div>
  );
}

export default function Blog({
  blog,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      nav={nav}
      style={{
        ...styles,
        page: {
          ...styles.page,
          view: {
            ...styles.page.view,
            backgroundColor: brandColors.white,
          },
          header: {
            ...styles.page.header,
            backgroundColor: brandColors.accent,
            borderBottomLeftRadius: 100,
            borderBottomRightRadius: 0,
            padding: 20,
          },
          sideBar: {
            backgroundColor: brandColors.accent,
            float: "right",
            width: 100,
            height: 400,
          },
        },
      }}
    >
      <BlogPost
        blog={blog}
        style={{
          main: {
            borderTopLeftRadius: 100,
            padding: 20,
            marginTop: 50,
            paddingLeft: 80,
            color: brandColors.white,
            backgroundColor: brandColors.accent,
          },
          author: {
            padding: 10,
          }
        }}
      />
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

  if (!blog) {
    const redirect = new URLSearchParams({reason:`${slug}+blog+not+found`, redirect:`/blog/${slug}`});
    return {
      redirect: {
        destination: '/404?' + redirect,
        permanent: false,
      },
    };
  }
  return { props: { blog } };
}
