import { useRouter } from "next/router";
import { isCurrentPage } from "../utils";
import { useEffect, useState } from "react";
import { NavItem } from "../constants/nav";

export const Nav = (props: {
  nav: (NavItem & { isCurrPage?: boolean })[];
  styles: { main: any; a: any };
}) => {
  const router = useRouter();
  const [nav, setNav] = useState(props.nav);
  useEffect(() => {
    if (router.isReady) {
      setNav((items) =>
        items.map((item) => ({ ...item, isCurrPage: isCurrentPage(item.href) }))
      );
    }
  }, [router.isReady]);
  return (
    <div
      id="nav"
      // style={styles.main}
    >
      {nav.map((item) =>
        item.isActive ? (
          <a
            key={item.href}
            href={item.href}
            className={` text-textPrimary m-1 py-2 px-5 rounded-[10px] hover:bg-secondary hover:text-textSecondary ${
              item.isCurrPage ? "bg-primary" : ""
            }`}
          >
            {item.text}
          </a>
        ) : null
      )}
    </div>
  );
};
