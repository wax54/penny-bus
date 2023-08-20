import Link from "next/link";
import { NavItem } from "../constants/nav";
import { StylesType } from "../constants/styles";
import { Nav } from "./Nav";
import { authRedirects } from "../utils/auth";

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
    <div style={styles.header} className="p-10 pt-0">
      <a
        href={authRedirects.getLoginRedirect()}
        className=" hover:bg-secondary hover:text-textSecondary  text-textPrimary m-1 py-2 px-5 rounded-[10px]"
      >
        Welcome
      </a>
      <Link href="/">
        <h1 id="page-title" style={styles.title} className="m-5">
          <em>The Penny Bus Project</em>
          {admin ? <strong>ADMIN EDITION</strong> : null}
        </h1>
      </Link>
      <Nav nav={nav} styles={styles.nav} />
    </div>
  );
};
