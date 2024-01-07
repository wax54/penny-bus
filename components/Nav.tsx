import { useRouter } from "next/router";
import { isCurrentPage } from "../utils";
import { useEffect, useState } from "react";
import { usePermissions } from "../providers/authProvider";
import { NavItem, useNav } from "../hooks/useNav";

export const Nav = () => {
  const userPermissions = usePermissions();
  const nav = useNav();
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
              href={userPermissions?.data?.admin ? "/admin" : "" + item.href}
              className={`flex-1 text-center duration-500 text-textPrimary m-1 py-2 px-5 rounded-[10px] hover:bg-secondary hover:text-textSecondary ${
                item.isCurrPage ? "bg-primary" : ""
              } ${
                isHidden
                  ? "-translate-y-[200px] duration-500 hidden md:block sm:translate-y-0"
                  : "block translate-y-0"
              }`}
            >
              {item.text}
            </a>
          ) : null
        )}
      </div>
    </div>
  );
};
