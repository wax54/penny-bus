import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { Layout } from "../../components/Layout";
import { useState } from "react";
import { BlogData, PARTITIONS } from "../../types";
import { Api } from "../../api";
import { NEW_BLOG_SLUG } from "../../constants/config";
const sortByDate = (a: BlogData, b: BlogData) =>
  new Date(a.arrival).getTime() - new Date(b.arrival).getTime();
const sortByTitle = (a: BlogData, b: BlogData) =>
  a.title > b.title ? 1 : a.title === b.title ? 0 : -1;

const sortOptions = [
  {
    label: "Date",
    value: "date",
    sortFunc: sortByDate,
  },
  {
    label: "Title",
    value: "title",
    sortFunc: sortByTitle,
  },
];
export default function Blog({
  blogs,
  admin,
}: InferGetStaticPropsType<typeof getServerSideProps> & { admin?: boolean }) {
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
    <Layout>
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

      <div className="flex justify-between m-5 px-2">
        {admin ? (
          <a
            className="pl-4 rounded bg-primary/50 px-4 py-2 mr-2 text-textPrimary hover:bg-secondary/50 hover:text-textSecondary"
            href={`./blog/${NEW_BLOG_SLUG}`}
          >
            New post
          </a>
        ) : null}

        <button
          className="rounded bg-primary/50 px-4 py-2 mr-2 text-textPrimary hover:bg-secondary/50 hover:text-textSecondary"
          onClick={progressSort}
        >
          Sort by: {sort.label}
        </button>
      </div>
      <ol className="m-5">
        
        {blogs
          ? blogs
              .sort((a, b) => sort.sortFunc(a, b))
              .map((blog) => (
                <li key={blog.slug} style={{ margin: "auto" }} className="flex">
                  <a
                    href={`./blog/${blog.slug}`}
                    className="flex-1 rounded-xl decoration-none bg-primary text-textPrimary border-b-[2px] border-transparent hover:border-white hover:bg-secondary hover:text-textPrimary cursor-pointer flex justify-between"
                    style={{
                      textTransform: "capitalize",
                      padding: 10,
                      margin: 10,
                      fontSize: "2rem",
                    }}
                  >
                    <span style={{ flex: "0 0 auto" }}>{blog.title}</span>
                    <span style={{ flex: "0 0 auto" }}>
                      {new Date(blog.arrival).toDateString()}
                    </span>
                  </a>
                </li>
              ))
          : "NO BLOGS"}
      </ol>
    </Layout>
  );
}

export async function getServerSideProps({}: GetStaticPropsContext) {
  const response = await Api.getAll<BlogData>({ type: PARTITIONS.BLOG });
  return {
    props: {
      blogs: response.body?.items ?? [],
      // blogs: [] as BlogData[]
    },
  };
}
