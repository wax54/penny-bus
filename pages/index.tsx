import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Layout } from "../components/Layout";
import { IMAGE_PATH, SITE_URL } from "../config";

export default function Home({}: InferGetStaticPropsType<GetStaticProps>) {
  return (
    <Layout>
      <div id="content" className="grid grid-cols-12 gap-4 px-6 pb-6">
        <div
          id="sidebar"
          className=" text-textPrimary col-span-12 md:col-span-4"
        >
          <h3>Our Mission Statement</h3>
          <p>We call her Penelope now that she&apos;s all grown up.</p>
          <h3>Who Are We</h3>
          <p>YAdaYada</p>
        </div>
        <div
          id="main-image"
          className="text-center text-textPrimary col-span-12 md:col-span-8 lg:px-[10px] xl:px-[60px] 2xl:px-[155px]"
        >
          <div className=" lg:pr-14">
            <img
              src={SITE_URL + "/" + IMAGE_PATH + "/penny-bus.jpg"}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function getStaticProps() {
  return { props: {} };
}
