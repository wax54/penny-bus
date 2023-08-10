import { NavItem } from "../constants/nav";
import { StylesType } from "../constants/styles";
import { Nav } from "./Nav";

export const Header = ({
  nav,
  styles,
  admin,
}: {
  nav: NavItem[];
  styles: StylesType["page"];
  admin?: boolean;
}) => {
  return (
    <div style={styles.header} className="p-10">
      <a href="/">
        <h1 id="page-title" style={styles.title} className="m-5">
          <em>The Penny Bus Project</em>
          {admin ? <strong>ADMIN EDITION</strong> : null}
        </h1>
      </a>
      <Nav nav={nav} styles={styles.nav} />
    </div>
  );
};
