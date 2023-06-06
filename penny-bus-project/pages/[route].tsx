import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { nav } from "../constants/nav";
import { styles } from "../constants/styles";
import { Header } from "../components/Header";

export default function Page({
  route,
}: InferGetStaticPropsType<GetStaticProps>) {
  if (!route) return <div>Loading Page...</div>;
  const { content } = nav.find(({ href }) => href === route) ?? {};
  if (!content) return;
  return (
    <div id="page" style={styles.page.main}>
      <div id="view" style={styles.page.view}>
        <Header nav={nav} styles={styles.page} />
          {content}
      </div>
    </div>
  );
}
export function getStaticPaths(): GetStaticPathsResult {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export function getStaticProps({ params }: GetStaticPropsContext) {
  return { props: { route: params?.route } };
}
