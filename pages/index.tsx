import { GetStaticProps, InferGetStaticPropsType } from "next";
import { nav } from "../constants/nav";
import { Layout } from "../components/Layout";

export default function Home({
}: InferGetStaticPropsType<GetStaticProps>) {
  const { content } = nav.find(({ href }) => href === "/") ?? {};

  return (
    <Layout nav={nav}>
      <div id="content">{content}</div>
    </Layout>
  );
}

export function getStaticProps() {
  return { props: {  } };
}
