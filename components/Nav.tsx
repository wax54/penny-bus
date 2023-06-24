import { useRouter } from "next/router";
import { isCurrentPage } from "../utils";
import { useEffect, useState } from "react";

export const Nav = (props: {
  nav: readonly { href: string; text: string, isActive?: boolean }[];
  styles: { main: any; a: any };
}) => {
  const router = useRouter();
  const [nav, setNav] = useState(props.nav);
  useEffect(() => {
    if (router.isReady) {
      setNav((items) =>
        items.map((item) => ({ ...item, isActive: isCurrentPage(item.href) }))
      );
    }
  }, [router.isReady]);
  return (
    <div id="nav"
      // style={styles.main}
    >
      {nav.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={` text-textSecondary m-1 py-2 px-5 rounded-[10px] hover:bg-secondary ${
            item.isActive ? "!bg-primary !text-text" : ""
          }`}
        >
          {item.text}
        </a>
      ))}
    </div>
  );
};
