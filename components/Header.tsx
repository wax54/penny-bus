import Link from "next/link";
import { NavItem } from "../constants/nav";
import { Nav } from "./Nav";
import { authRedirects } from "../utils/auth";
import { useRouter } from "next/router";
import { userPermissions } from "../types/user";
import { usePermissions } from "../providers/authProvider";

export const Header = ({ nav }: { nav: NavItem[] }) => {
  const userPermissions = usePermissions();
  const router = useRouter();
  const loginOptions = userPermissions?.loading
    ? { text: "Loading", href: "" }
    : userPermissions?.data?.loggedIn
    ? {
        text: "Log out",
        href: authRedirects.getLogoutRedirect(),
      }
    : router.asPath === authRedirects.getLoginRedirect()
    ? {
        text: "Sign up",
        href: authRedirects.getCreateRedirect(),
      }
    : {
        text: "Log in",
        href: authRedirects.getLoginRedirect(),
      };
  return (
    <div className="p-4 md:p-10 pt-0 text-center md:text-left">
      <div className="flex justify-between">
        <Link href="/" className="flex-none">
          <div className="">Welcome to</div>
          <h1 id="page-title" className="m-auto  m-5">
            <em>The Penny Bus Project</em>
            {userPermissions?.data?.admin ? (
              <strong>ADMIN EDITION</strong>
            ) : null}
          </h1>
        </Link>
        <Link
          href={loginOptions.href}
          className="flex-none text-center  hover:bg-secondary hover:text-textSecondary text-textPrimary m-1 p-2 rounded-[10px] self-center"
        >
          {loginOptions.text}
        </Link>
      </div>
      <Nav nav={nav} />
    </div>
  );
};
