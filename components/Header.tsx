import Link from "next/link";
import { NavItem } from "../constants/nav";
import { Nav } from "./Nav";
import { authRedirects } from "../utils/auth";
import { useRouter } from "next/router";

export const Header = ({ nav, admin }: { nav: NavItem[]; admin?: boolean }) => {
  const router = useRouter();
  return (
    <div className="p-4 md:p-10 pt-0 text-center md:text-left">
      <div className="flex justify-between">
        <Link href="/" className="flex-none">
          <div className="">Welcome to</div>
          <h1 id="page-title" className="m-auto  m-5">
            <em>The Penny Bus Project</em>
            {admin ? <strong>ADMIN EDITION</strong> : null}
          </h1>
        </Link>
        <Link
          href={
            router.asPath === authRedirects.getLoginRedirect()
              ? authRedirects.getCreateRedirect()
              : authRedirects.getLoginRedirect()
          }
          className="flex-none text-center  hover:bg-secondary hover:text-textSecondary text-textPrimary m-1 p-2 rounded-[10px] self-center"
        >
          {router.asPath === authRedirects.getLoginRedirect()
            ? "Sign up"
            : "Log in"}
        </Link>
      </div>
      <Nav nav={nav} />
    </div>
  );
};
