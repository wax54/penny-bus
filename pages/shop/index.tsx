import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { Layout } from "../../components/Layout";
import { nav } from "../../constants/nav";
import { useState } from "react";

export default function Blog({
  inventory,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return inventory.map((item) => (
    <div  key={item.title}>
      {" "}
      <a href={item.link}>
        <span>{item.title}</span>
      </a>
    </div>
  ));
  // return (
  //   <Layout nav={nav}>
  //     <h2
  //       style={{
  //         color: "white",
  //         textAlign: "center",
  //         padding: 10,
  //         margin: 10,
  //         fontSize: "2rem",
  //       }}
  //     >
  //       Our BlogApi!
  //     </h2>
  //     <div className="flex justify-end">
  //       <button
  //         className="rounded bg-primary/50 px-4 py-2 mr-2 hover:bg-secondary/50 hover:text-textSecondary"
  //         onClick={progressSort}
  //       >
  //         Sort: {sort.label}
  //       </button>
  //     </div>
  //     <ol style={{ margin: 20 }}>
  //       {blogs
  //         .sort((a, b) => sort.sortFunc(a.blog, b.blog))
  //         .map(({ key, blog }) => (
  //           <li key={key} style={{ margin: "auto" }}>
  //             <a
  //               href={`/blog/${key}`}
  //               className="rounded-xl decoration-none bg-primary text-text-primary border-b-[2px] border-transparent hover:border-white hover:bg-secondary   hover:text-textSecondary cursor-pointer flex justify-between"
  //               style={{
  //                 textTransform: "capitalize",
  //                 padding: 10,
  //                 margin: 10,
  //                 fontSize: "2rem",
  //               }}
  //             >
  //               <span style={{ flex: "0 0 auto" }}>{blog.title}</span>
  //               <span style={{ flex: "0 0 auto" }}>
  //                 {new Date(blog.date.arrival).toDateString()}
  //               </span>
  //             </a>
  //           </li>
  //         ))}
  //     </ol>
  //   </Layout>
  // );
}

export async function getStaticProps({}: GetStaticPropsContext) {
  const inventory = [
    {
      title: "Penny in the woods",
      link: "https://pennybusproject.threadless.com/designs/penny-in-the-woods",
    },
  ];
  return {
    props: {
      inventory,
    },
  };
}
