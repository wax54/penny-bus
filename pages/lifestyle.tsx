import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { Layout } from "../components/Layout";
import { useRef } from "react";
import { IMAGE_PATH, SITE_URL } from "../config";

const pins = ["blue_pin.png", "red_pin.png", "bl_pin.png", "yl_pin.png"].map(
  (imageFile) => SITE_URL + "/" + IMAGE_PATH + "/" + imageFile
);

const LifestyleArticle = ({
  article,
}: {
  article: { img: string; title: string; body: string };
}) => {
  const offset = useRef(Math.floor(Math.random() * 60 - 30));
  const pinXOffset = useRef(Math.floor(Math.random() * 150 + 50));
  const pinYOffset = useRef(Math.floor(Math.random() * 50 - 25));
  const pinNumber = useRef(Math.floor(Math.random() * 4));
  return article ? (
    <div className="m-10">
      <div
        className={` m-auto p-5 w-full md:w-[300px] bg-white rounded-xl `}
        style={{
          translate: `calc(${offset.current}vw )`,
        }}
      >
        <img
          src={pins[pinNumber.current]}
          alt="pin"
          style={{
            translate: `${pinXOffset.current}px ${pinYOffset.current}px `,
          }}
          className="rounded-full border-grey border-2"
          width={50}
        />
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
        LIFE STYLE
      </h2>
      <div
        className="h-[full] bg-repeat "
        style={{
          backgroundImage: `url(${SITE_URL}/${IMAGE_PATH}/repeating-lifestyle.jpg)`,
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
  img: SITE_URL + "/" + IMAGE_PATH + "/penny-bus.jpg",
  title: "Test Content",
  body: "To the test of time there is nothing to do. You haev earned my respect Bradward Boimler. I will let your captain know. ",
};
const fakeContents = new Array(10).fill(undefined).map((a) => ({
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
