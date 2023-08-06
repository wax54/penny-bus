import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { IMAGE_PATH, SITE_URL } from "../../config";
import { useEffect, useState } from "react";

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
            props.className +
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
  return inventory.map((item) => (
    <div key={item.title}>
      {" "}
      <a href={item.link}>
        <h1 className="text-center motion-safe:animate-pulse">{item.title}</h1>
        <ImageSlideShow
          urls={item.images}
          className="max-w-screen sm:max-w-[50vw] sm:max-h-[50vh] m-auto "
        />
      </a>
    </div>
  ));
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
      ].map((imageURL) => SITE_URL + IMAGE_PATH + imageURL),
    },
  ];
  return {
    props: {
      inventory,
    },
  };
}
