import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { Layout } from "../components/Layout";
import { useMemo, useRef } from "react";
import { IMAGE_PATH, SITE_URL } from "../config";
import { useBreakPoint } from "../hooks";

const pins = ["blue_pin.png", "red_pin.png", "bl_pin.png", "yl_pin.png"].map(
  (imageFile) => SITE_URL + "/" + IMAGE_PATH + "/" + imageFile
);

const LifestyleArticle = ({
  article,
}: {
  article: { img: string; title: string; body: string };
}) => {
  const breakPoint = useBreakPoint();
  const { offset, pinXOffset, pinYOffset } = useMemo(() => {
    return {
      offset: Math.floor(
        Math.random() *
          (breakPoint === "sm" || breakPoint === "md"
            ? 5
            : breakPoint === "lg"
            ? 10
            : 40) -
          (breakPoint === "sm" || breakPoint === "md"
            ? 2
            : breakPoint === "lg"
            ? 5
            : 20)
      ),
      pinXOffset: Math.floor(Math.random() * 100 + 50),
      pinYOffset: Math.floor(
        Math.random() * (Math.random() < 0.3 ? 225 : 50) - 25
      ),
    };
  }, [breakPoint]);
  const pinNumber = useRef(Math.floor(Math.random() * 4));
  return article ? (
    <div className="">
      <div
        className={` m-auto p-5 w-[300px] md:w-[600px] bg-main rounded-xl text-textPrimary`}
        style={{
          translate: `calc(${offset}vw )`,
        }}
      >
        <img
          src={pins[pinNumber.current]}
          alt="pin"
          style={{
            translate: `${pinXOffset}px ${pinYOffset}px `,
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
      {/* <h2
        style={{
          textAlign: "center",
          padding: 10,
          margin: 10,
          fontSize: "2rem",
        }}
      >
        LIFE STYLE
      </h2> */}
      <div
        className="h-[full] bg-repeat dark:invert"
        style={{
          backgroundImage: `url(${SITE_URL}/${IMAGE_PATH}/repeating-lifestyle.jpg)`,
        }}
      >
        <div className="dark:invert">
          {articles.map((article) => (
            <LifestyleArticle key={article.title} article={article} />
          ))}
        </div>
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
