import { NavItem } from "../constants/nav";
import { StylesType, styles } from "../constants/styles";
import { userPermissions } from "../types/user";
import { Header } from "./Header";

export const Layout = (props: {
  children: JSX.Element | undefined | null | (JSX.Element | null | undefined)[];
  nav: NavItem[];
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
        <Header nav={props.nav} />
        <div id="side-bar" style={page.sideBar} />
        {props.children}
      </div>
    </div>
  );
};
