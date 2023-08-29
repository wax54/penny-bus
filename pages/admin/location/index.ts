import { GetServerSidePropsContext } from "next";
import * as publicLocationPage from "../../location/index";
export const getServerSideProps = async (
  params: GetServerSidePropsContext<{ slug: string }>
) => {
  const serverResponse = await publicLocationPage.getServerSideProps(params);
  return { ...serverResponse, props: { ...serverResponse.props, admin: true } };
};

export default publicLocationPage.default;
