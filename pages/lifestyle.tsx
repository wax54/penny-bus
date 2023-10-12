import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { Layout } from "../components/Layout";
import { nav } from "../constants/nav";
import { useRef } from "react";

const LifestyleArticle = ({
  article,
}: {
  article: { img: string; title: string; body: string };
}) => {
  const offset = useRef(Math.random() * 60 - 30);
  return article ? (
    <div className="m-10">
      <div
        className={` m-auto p-5 w-full md:w-[300px] bg-white rounded-xl `}
        style={{
          translate: `calc(${offset.current}vw )`,
        }}
      >
        {article.img ? (
          <div className="m-auto text-center w-full">
            <img src={article.img} />
          </div>
        ) : null}
        <h3 className="pt-3">{article.title}</h3>
        <span>{article.body}</span>
      </div>
    </div>
  ) : null;
};

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
        {articles.map((article) => (
          <LifestyleArticle key={article.title} article={article} />
        ))}
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
