import { NavItem } from "../constants/nav";
import { StylesType, styles } from "../constants/styles";
import { Header } from "./Header";

export const Layout = (props: {
  children: JSX.Element | JSX.Element[] | undefined;
  nav: NavItem[];
  style?: StylesType;
}) => {
  const page = props.style?.page ?? styles.page;
  return (
    <div id="page" style={page.main}>
      <div
        id="view"
        className="min-h-screen
      top-0
      bottom-0
      left-0
      right-0
      bg-offWhite"
      >
        <Header nav={props.nav} styles={page} />
        <div id="side-bar" style={page.sideBar} />
        {props.children}
      </div>
    </div>
  );
};
