import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { Layout } from "../components/Layout";
import { nav } from "../constants/nav";
import { useState } from "react";
import { BlogData, PARTITIONS } from "../types";
import { Api } from "../api";

export default function Lifestyle({
  articles,
  admin,
}: InferGetStaticPropsType<typeof getServerSideProps> & { admin?: boolean }) {
  return (
    <Layout nav={nav} admin={admin}>
      <h2
        style={{
          color: "white",
          textAlign: "center",
          padding: 10,
          margin: 10,
          fontSize: "2rem",
        }}
      >
        LIFE STYLE
      </h2>
      <div
        className="h-[full] bg-repeat "
        style={{
          backgroundImage: "url(/img/repeating-lifestyle.jpg)",
        }}
      >
        {articles.map((article) => {
          console.log({ article });

          return article ? (
            <div className="bg-white m-5">
              {article.img ? (
                <div className="m-auto text-center w-[300px] h-[300px]">
                  <img src={article.img} />
                  </div>
              ) : null}
              <h3>{article.title}</h3>
              <span>{article.body}</span>
            </div>
          ) : null;
        })}
      </div>
    </Layout>
  );
}

const fakeContent = {
  img: "/img/penny-bus.jpg",
  title: "Test Content",
  body: "To the test of time there is nothing to do. You haev earned my respect Bradward Boimler. I will let your captain know. ",
};
const fakeContents = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((g) => ({
  ...fakeContent,
}));
export async function getServerSideProps({}: GetStaticPropsContext) {
  return {
    props: {
      articles: fakeContents,
      // blogs: [] as BlogData[]
    },
  };
}
