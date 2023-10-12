import { useRouter } from "next/router";
import { isCurrentPage } from "../utils";
import { useEffect, useState } from "react";
import { NavItem } from "../constants/nav";

export const Nav = (props: { nav: (NavItem & { isCurrPage?: boolean })[] }) => {
  const router = useRouter();
  const [nav, setNav] = useState(props.nav);
  useEffect(() => {
    if (router.isReady) {
      setNav((items) =>
        items.map((item) => ({ ...item, isCurrPage: isCurrentPage(item.href) }))
      );
    }
  }, [router.isReady]);
  const [isHidden, setIsHidden] = useState(false);
  return (
    <div id="nav" className="max-w-screen pt-10">
      <div
        className={`md:hidden px-5 m-1 bg-primary/50 py-2`}
        onClick={() => setIsHidden((isHidden) => !isHidden)}
      >
        Menu
      </div>
      <div className="flex flex-wrap flex-col md:flex-row ">
        {nav.map((item) =>
          item.isActive ? (
            <a
              key={item.href}
              href={item.href}
              className={`flex-1 text-center duration-500 text-textPrimary m-1 py-2 px-5 rounded-[10px] hover:bg-secondary hover:text-textSecondary ${
                item.isCurrPage ? "bg-primary" : ""
              } ${isHidden ? "-translate-y-[200px] duration-500 hidden md:block sm:translate-y-0" : "block translate-y-0"}`}
            >
              {item.text}
            </a>
          ) : null
        )}
      </div>
    </div>
  );
};
