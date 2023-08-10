import { GetServerSidePropsContext } from "next";
import * as publicBlogPage from "../../blog/index";
import { useState } from "react";
import { BlogApi } from "../../../api";
import { NEW_BLOG_SLUG } from "../../../constants/config";
export const getServerSideProps = async (
  params: GetServerSidePropsContext<{ slug: string }>
) => {
  const serverResponse = await publicBlogPage.getServerSideProps(params)
  return {...serverResponse, props: { ...serverResponse.props, admin: true } };
};

export default publicBlogPage.default