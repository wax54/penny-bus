import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Layout } from "../components/Layout";

export default function Home({}: InferGetStaticPropsType<GetStaticProps>) {

  return (
    <Layout >
      <div id="content">
        <div id="content" className="text-center text-white">
          <h3>Our Mission Statement</h3>
          <p>We call her Penelope now that she&apos;s all grown up.</p>
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
