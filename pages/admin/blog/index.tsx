import { GetServerSidePropsContext } from "next";
import * as publicBlogPage from "../../blog/index";
export const getServerSideProps = async (
  params: GetServerSidePropsContext<{ slug: string }>
) => {
  const serverResponse = await publicBlogPage.getServerSideProps(params);
  return { ...serverResponse, props: { ...serverResponse.props, admin: true } };
};

export default publicBlogPage.default;
