import { GetStaticProps, InferGetStaticPropsType } from "next";
import { styles } from "../constants/styles";
import { nav } from "../constants/nav";
import { Header } from "../components/Header";

export default function Home({
  page,
}: InferGetStaticPropsType<GetStaticProps>) {
  const { content } = nav.find(({ href }) => href === '/') ?? {};

  return (
    <div id="page" style={styles.page.main}>
      <div id="view" style={styles.page.view}>
        <Header nav={nav} styles={styles.page} />
        <div id="content">
          {content}

        </div>
      </div>
    </div>
  );
}

export function getStaticProps() {
  return { props: { page: { a: "hello" } } };
}
