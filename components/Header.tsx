import Link from "next/link";
import { Nav } from "./Nav";
import { authRedirects } from "../utils/auth";
import { useRouter } from "next/router";
import { useAuthTools, usePermissions } from "../providers/authProvider";
import { IMAGE_PATH, SITE_URL } from "../config";
import { useFeatureGate } from "../hooks";

export const Header = () => {
  const featureFlag = useFeatureGate();
  const { logout } = useAuthTools();
  const userPermissions = usePermissions();
  const router = useRouter();
  const loginOptions = userPermissions?.loading
    ? { text: "Loading", href: "" }
    : userPermissions?.data?.loggedIn
    ? {
        text: "Log out",
        onClick: () => {
          logout?.();
          router.push("/");
        },
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
  const logoFile =
    featureFlag === "dark-blue"
      ? "pbp-big-logo-dark-blue.png"
      : featureFlag === "light-blue"
      ? "pbp-big-logo-light-blue.png"
      : featureFlag === "orange"
      ? "pbp-big-logo-orange.svg"
      : "pbp-big-logo-orange.svg";
  const logo = {
    src: `${SITE_URL}/${IMAGE_PATH}/${logoFile}`,
  };
  return (
    <div className="p-4 md:p-5 pt-2 text-center md:text-left">
      <div className="flex justify-end md:h-[0px]">
        {loginOptions.href ? (
          <Link
            href={loginOptions.href}
            className="flex-none text-center  hover:bg-primary hover:text-textPrimary text-textPrimary m-1 p-2 rounded-[10px] self-center"
          >
            {loginOptions.text}
          </Link>
        ) : (
          <button
            onClick={loginOptions.onClick ? loginOptions.onClick : () => {}}
          >
            <div className="flex-none text-center hover:bg-primary hover:text-textPrimary text-textPrimary m-1 p-2 rounded-[10px] self-center">
              {loginOptions.text}
            </div>
          </button>
        )}
      </div>
      <div className="flex justify-center">
        <Link href="/" className="flex-none">
          <img src={logo.src} className="h-[250px]"></img>
          {/* <div className="">Welcome to</div>
          <h1 id="page-title" className="m-auto  m-5">
            <em>The Penny Bus Project</em>
            {userPermissions?.data?.user?.admin ? (
              <strong>ADMIN EDITION</strong>
            ) : null}
          </h1> */}
        </Link>
      </div>
      <Nav />
    </div>
  );
};
