import { useState } from "react";
import { useNav } from "../hooks/useNav";
import { isCurrentPage } from "../utils";
import { useCurrentPage } from "../hooks/useCurrentPage";

export const Nav = () => {
  const nav = useNav();
  const currentPage = useCurrentPage();
  const [isHidden, setIsHidden] = useState(false);
  return (
    <div id="nav" className="max-w-screen ">
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
              className={`flex-1 text-center duration-300 text-textPrimary m-1 py-2 px-5 rounded-[10px] hover:bg-primary hover:text-textPrimary ${
                isCurrentPage(item.href, currentPage) ? "bg-secondary" : ""
              } ${
                isHidden
                  ? "-translate-y-[200px] duration-300 hidden md:block sm:translate-y-0"
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
