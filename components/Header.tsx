import { Nav as NavType } from "../constants/nav";
import { StylesType } from "../constants/styles";
import { Nav } from "./Nav";

export const Header = ({
  nav,
  styles,
}: {
  nav: NavType;
  styles: StylesType['page']
}) => {
  return (
    <div style={styles.header} className="p-10">
      <h1 id="page-title" style={styles.title} className="m-5">
        <em>The Penny Bus Project</em>
      </h1>
      <Nav nav={nav} styles={styles.nav} />
    </div>
  );
};
