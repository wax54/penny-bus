import { GetStaticProps, InferGetStaticPropsType } from "next";
import { nav } from "../constants/nav";
import { Layout } from "../components/Layout";

export default function Home({}: InferGetStaticPropsType<GetStaticProps>) {

  return (
    <Layout nav={nav}>
      <div id="content">
        <div id="content" style={{ color: "white", textAlign: "center" }}>
          <h3>Our Mission Statement</h3>
          <p>YAdaYada</p>
          <h3>Who Are We</h3>
          <p>YAdaYada</p>
        </div>
      </div>
    </Layout>
  );
}

export function getStaticProps() {
  return { props: {} };
}
