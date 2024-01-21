import Link from "next/link";
import { Nav } from "./Nav";
import { authRedirects } from "../utils/auth";
import { useRouter } from "next/router";
import { useAuthTools, usePermissions } from "../providers/authProvider";
import { IMAGE_PATH, SITE_URL } from "../config";
import { useFeatureGate } from "../hooks";
import { useMemo } from "react";
import { useColorMode } from "../hooks/useColorMode";
import { Button } from "./Button";

export const Header = () => {
  const [colorMode, setColorMode] = useColorMode();
  const featureFlag = useFeatureGate();
  const { logout } = useAuthTools();
  const userPermissions = usePermissions();
  const router = useRouter();
  const loginOptions = useMemo(() => {
    const welcomBackUser = {
      text: `Hi ${userPermissions?.data?.user?.name}!`,
    };

    const loading = { text: "Loading" };
    const loginBtn = {
      text: "Log in",
      href: authRedirects.getLoginRedirect(),
    };
    const logoutBtn = {
      text: "Log out",
      onClick: () => {
        logout?.();
        router.push("/");
      },
    };
    const signUpBtn = {
      text: "Sign up",
      href: authRedirects.getCreateRedirect(),
    };
    return (
      userPermissions?.loading
        ? [loading]
        : userPermissions?.data?.loggedIn
        ? [
            ...(userPermissions.data?.user?.name ? [welcomBackUser] : []),
            logoutBtn,
          ]
        : router.asPath === authRedirects.getLoginRedirect()
        ? [signUpBtn]
        : router.asPath === authRedirects.getCreateRedirect()
        ? [loginBtn]
        : [loginBtn, signUpBtn]
    ) as {
      text: string;
      href?: string;
      onClick?: () => void;
      className?: string;
    }[];
  }, [logout, router.asPath, router, userPermissions?.data]);

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
    <div className="p-4 md:p-5 pt-2 md:pb-10 text-center md:text-left">
      <div className="flex justify-start md:h-[0px] m-3 items-center">
        <Button
          btnType="nav"
          onClick={() => {
            setColorMode((mode) => (mode === "light" ? "dark" : "light"));
          }}
        >
          {colorMode === "light" ? "Dark mode" : "Light mode"}
        </Button>
      </div>
      <div className="flex justify-end md:h-[0px] m-3 items-center">
        {loginOptions.map((loginOption) => {
          const className = `${
            loginOption.onClick || loginOption.href
              ? "hover:bg-primary hover:text-textPrimary"
              : " cursor-default"
          } ${loginOption.className ?? ""} 
          text-textPrimary m-1 p-4 rounded-[10px] flex-none text-center min-w-6`;
          return (
            <button
              key={loginOption.text}
              onClick={loginOption.onClick ? loginOption.onClick : () => {}}
            >
              {loginOption.href ? (
                <Link href={loginOption.href} className={className}>
                  {loginOption.text}
                </Link>
              ) : (
                <div className={className}>{loginOption.text}</div>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex justify-center">
        <Link href="/" className="flex-none">
          <img src={logo.src} className="h-[250px] dark:invert" />
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
