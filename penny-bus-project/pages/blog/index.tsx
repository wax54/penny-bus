import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { Layout } from "../../components/Layout";
import { nav } from "../../constants/nav";

export default function Blog({ }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { content } = nav.find(({ href }) => href = 'blog') ?? {};
  return (
    <Layout nav={nav}>
      {content}
    </Layout>
  );
}

export function getStaticProps({}: GetStaticPropsContext) {
  return { props: {} };
}
