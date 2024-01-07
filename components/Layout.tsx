import { StylesType, styles } from "../constants/styles";
import { Header } from "./Header";

export const Layout = (props: {
  children: JSX.Element | undefined | null | (JSX.Element | null | undefined)[];
  style?: StylesType;
}) => {
  const page = props.style?.page ?? styles.page;
  return (
    <div
      id="page"
      className="min-h-screen
      bg-offWhite
      "
    >
      <div id="view" className="">
        <Header />
        <div id="side-bar" style={page.sideBar} />
        {props.children}
      </div>
    </div>
  );
};
