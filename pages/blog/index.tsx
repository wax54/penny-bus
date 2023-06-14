import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { Layout } from "../../components/Layout";
import { nav } from "../../constants/nav";
import db from "../../db";
import { useState } from "react";

export default function Blog({
  blogs,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [value, set] = useState<0 | 1>(0);
  const handleMouseEnter = () => {
    set(1);
  };
  function handleMouseLeave() {
    set(0);
  }
  return (
    <Layout nav={nav}>
      <h2
        style={{
          color: "white",
          textAlign: 'center',
          padding: 10,
          margin: 10,
          fontSize: "2rem",
        }}
      >
        Our Blog!
      </h2>
      <div style={{position: 'relative', padding: 20}}>
        <span style={{ position: 'absolute', right: 24,  padding: 4, paddingRight: 16, backgroundColor: 'white'}}>
          Sort: By Date
        </span>
      </div>
      <ol style={{ margin: 20 }}>
        {blogs.map(({ key, blog }) => (
          <li style={{ margin: "auto" }}>
            <a
              href={`/blog/${key}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                color: "white",
                textTransform: "capitalize",
                padding: 10,
                display: "flex",
                margin: 10,
                fontSize: "2rem",
                border: "solid 0px #EEFFEE",
                textDecoration: "none",
                justifyContent: "space-around",
                borderBottomWidth: value ? 2 : 0,
                cursor: value ? "pointer" : undefined,
              }}
            >
              <span style={{ flex: "0 0 auto" }}>{blog.title}</span>
              <span style={{ flex: "0 0 auto" }}>
                {new Date(blog.date.arrival).toDateString()}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </Layout>
  );
}

export function getStaticProps({}: GetStaticPropsContext) {
  return {
    props: {
      blogs: Object.keys(db.blog).map((key) => ({
        key: key,
        blog: db.blog[key],
      })),
    },
  };
}
