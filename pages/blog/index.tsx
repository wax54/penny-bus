import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { Layout } from "../../components/Layout";
import { nav } from "../../constants/nav";
import { useState } from "react";
import { BlogData } from "../../types";
import { BlogApi } from "../../api";
const sortByDate = (a: BlogData, b: BlogData) =>
  new Date(a.date.arrival).getTime() - new Date(b.date.arrival).getTime();
const sortByTitle = (a: BlogData, b: BlogData) =>
  a.title > b.title ? 1 : a.title === b.title ? 0 : -1;

const sortOptions = [
  {
    label: "By Date",
    value: "date",
    sortFunc: sortByDate,
  },
  {
    label: "By Title",
    value: "title",
    sortFunc: sortByTitle,
  },
];
export default function Blog({
  blogs,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [sort, setSort] = useState(sortOptions[0]);
  const progressSort = () => {
    setSort((sort) => {
      const curr = sortOptions.findIndex(
        (option) => option.value === sort.value
      );
      const next = curr + 1;
      return next < sortOptions.length ? sortOptions[next] : sortOptions[0];
    });
  };
  return (
    <Layout nav={nav}>
      <h2
        style={{
          color: "white",
          textAlign: "center",
          padding: 10,
          margin: 10,
          fontSize: "2rem",
        }}
      >
        Our BlogApi!
      </h2>
      <div className="flex justify-end">
        <button className="rounded bg-primary/50 px-4 py-2 mr-2 hover:bg-secondary/50 hover:text-textSecondary" onClick={progressSort}>
          Sort: {sort.label}
        </button>
      </div>
      <ol style={{ margin: 20 }}>
        {blogs
          .sort((a, b) => sort.sortFunc(a.blog, b.blog))
          .map(({ key, blog }) => (
            <li key={key} style={{ margin: "auto" }}>
              <a
                href={`/blog/${key}`}
                className="rounded-xl decoration-none bg-primary text-text-primary border-b-[2px] border-transparent hover:border-white hover:bg-secondary   hover:text-textSecondary cursor-pointer flex justify-between"
                style={{
                  textTransform: "capitalize",
                  padding: 10,
                  margin: 10,
                  fontSize: "2rem",
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

export async function getStaticProps({}: GetStaticPropsContext) {
  return {
    props: {
      blogs: await BlogApi.getAll(),
    },
  };
}
