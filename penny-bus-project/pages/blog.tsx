import { GetStaticProps, InferGetStaticPropsType } from "next";

export default function Blog({
  page,
}: InferGetStaticPropsType<GetStaticProps>) {
  return (
      <div id="page">
        <h1 id="page-title">The Penny Bus</h1>
        <h2 id="page-subtitle">Our Trip around the town!</h2>
        <div id="nav">
          <a href="blog"> Blog </a>
        </div>
      </div>
  );
}

export function getStaticProps() {
  return { props: { page: { a: "hello" } } };
}
