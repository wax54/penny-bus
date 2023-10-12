import Link from "next/link";
import { NavItem } from "../constants/nav";
import { Nav } from "./Nav";
import { authRedirects } from "../utils/auth";

export const Header = ({ nav, admin }: { nav: NavItem[]; admin?: boolean }) => {
  return (
    <div className="p-4 md:p-10 pt-0 text-center md:text-left">
      <Link href="/">
        <a
          href={authRedirects.getLoginRedirect()}
          className=" hover:bg-secondary hover:text-textSecondary text-textPrimary m-1 py-2 px-5 rounded-[10px] max-w-screen"
        >
          Welcome to
        </a>
        <h1 id="page-title" className="m-auto  m-5">
          <em>The Penny Bus Project</em>
          {admin ? <strong>ADMIN EDITION</strong> : null}
        </h1>
      </Link>
      <Nav nav={nav} />
    </div>
  );
};
