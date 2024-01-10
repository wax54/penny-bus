import { StylesType, styles } from "../constants/styles";
import { Header } from "./Header";

export const Layout = (props: {
  children: JSX.Element | undefined | null | (JSX.Element | null | undefined)[];
  style?: StylesType;
}) => {
  return (
    <div
      id="page"
      className="min-h-screen
      bg-white
      "
    >
      <div id="view" className="">
        <Header />
        {props.children}
      </div>
    </div>
  );
};
