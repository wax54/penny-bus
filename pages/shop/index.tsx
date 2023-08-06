import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { IMAGE_PATH, SITE_URL } from "../../config";

export default function Blog({
  inventory,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return inventory.map((item) => (
    <div key={item.title}>
      {" "}
      <a href={item.link}>
        <span>{item.title}</span>
       
      </a>
      {item.images}
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
