import { GetServerSidePropsContext } from "next";
import * as publicBlogPage from "../../blog/index";
import { useState } from "react";
import { BlogApi } from "../../../api";
import { NEW_BLOG_SLUG } from "../../../constants/config";
export const getServerSideProps = (
  params: GetServerSidePropsContext<{ slug: string }>
) => {
  return { props: { ...publicBlogPage.getServerSideProps(params), admin: true } };
};

export default publicBlogPage.default