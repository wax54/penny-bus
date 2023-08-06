import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { IMAGE_PATH, SITE_URL } from "../../config";
import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { nav } from "../../constants/nav";

const ImageSlideShow = (
  props: {
    urls: string[];
  } & JSX.IntrinsicElements["img"]
) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx((currIdx) => (currIdx + 1 < props.urls.length ? currIdx + 1 : 0));
    const id = setInterval(
      () =>
        setIdx((currIdx) =>
          currIdx + 1 < props.urls.length ? currIdx + 1 : 0
        ),
      6000
    );
    return () => clearInterval(id);
  }, [props.urls.length]);
  return (
    <div className={props.className + " relative "}>
      {props.urls.map((url, currIdx, arr) => (
        <img
          key={url}
          {...props}
          src={url}
          className={
            ` absolute  left-0 top-0 ` +
            (idx === currIdx
              ? " animate-fade-in z-10 "
              : idx === currIdx + 1 || (idx === 0 && currIdx === arr.length - 1)
              ? " animate-fade-out z-0 "
              : " opacity-0 ")
          }
        />
      ))}
    </div>
  );
};
export default function Blog({
  inventory,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout nav={nav}>
      <div className="">
        {inventory.map((item) => (
          <div key={item.title}>
            {" "}
            <a href={item.link}>
              <h1 className="text-center motion-safe:animate-pulse">
                {item.title}
              </h1>
              <ImageSlideShow
                urls={item.images}
                className="max-w-screen sm:max-w-[50vw] sm:max-h-[50vh] m-auto "
              />
            </a>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps({}: GetStaticPropsContext) {
  const inventory = [
    {
      title: "Penny in the woods",
      link: "https://pennybusproject.threadless.com/designs/penny-in-the-woods",
      images: [
        "mens-t-shirt-ringer-white_red_ringer-front-back-1.png",
        "mens-t-shirt-ringer-white_red_ringer-front-back-2.jpg",
        "mens-t-shirt-ringer-white_red_ringer-front-back-3.jpg",
        "mens-t-shirt-ringer-white_red_ringer-front.jpg",
        "mens-t-shirt-ringer-white_red_ringer-back.jpg",
        "mens-t-shirt-regular-scarlet_red-front-back-3.jpg",
        "mens-t-shirt-regular-scarlet_red-front-back-2.jpg",
        "mens-t-shirt-regular-scarlet_red-front-back-1.png",
        "mens-t-shirt-regular-scarlet_red-back.jpg",
        "mens-t-shirt-regular-scarlet_red-front.jpg",
        "mens-t-shirt-regular-kelly_green-front-back-3.jpg",
        "mens-t-shirt-regular-kelly_green-front-back-2.jpg",
        "mens-t-shirt-regular-kelly_green-front-back-1.png",
        "mens-t-shirt-regular-kelly_green-back.jpg",
        "mens-t-shirt-regular-kelly_green-front.jpg",
        "mens-t-shirt-regular-cyan-front-back-3.jpg",
        "mens-t-shirt-regular-cyan-front-back-2.jpg",
        "mens-t-shirt-regular-cyan-front-back-1.png",
        "mens-t-shirt-regular-cyan-back.jpg",
        "mens-t-shirt-regular-cyan-front.jpg",
        "mens-t-shirt-regular-white-front-back-3.jpg",
        "mens-t-shirt-regular-white-front-back-2.jpg",
        "mens-t-shirt-regular-white-front-back-1.png",
        "mens-t-shirt-regular-white-back.jpg",
        "mens-t-shirt-regular-white-front.jpg",
        "mens-t-shirt-regular-black-front-back-3.jpg",
        "mens-t-shirt-regular-black-front-back-2.jpg",
        "mens-t-shirt-regular-black-front-back-1.png",
        "mens-t-shirt-regular-black-back.jpg",
        "mens-t-shirt-regular-black-front.jpg",
        "womens-t-shirt-triblend-chili_red-back.jpg",
        "womens-t-shirt-triblend-chili_red-front.jpg",
        "womens-t-shirt-triblend-grey_triblend-back.jpg",
        "womens-t-shirt-triblend-grey_triblend-front.jpg",
        "womens-t-shirt-triblend-blue_triblend-back.jpg",
        "womens-t-shirt-triblend-blue_triblend-front.jpg",
        "womens-t-shirt-triblend-heather_onyx-back.jpg",
        "womens-t-shirt-triblend-heather_onyx-front.jpg",
      ].map((imageURL) => SITE_URL + IMAGE_PATH + imageURL),
    },
  ];
  return {
    props: {
      inventory,
    },
  };
}
