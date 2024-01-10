import { useMemo } from "react";
import { usePermissions } from "../providers/authProvider";
import { isCurrentPage } from "../utils";
import { useRouter } from "next/router";

export type NavItem = { href: string; text: string; isActive?: boolean };
export const nav = [
  {
    text: "Home",
    href: "/home",
    isActive: true,
  },
  {
    text: "Travel",
    href: "/blog",
    isActive: true,
  },
  {
    text: "Gallery",
    href: "/gallery",
    isActive: false,
  },
  {
    text: "Lifestyle",
    href: "/lifestyle",
    isActive: true,
  },
  {
    text: "Shop",
    href: "/shop",
    isActive: false,
  },
  {
    text: "Snapshots",
    href: "/photos",
    isActive: false,
  },
  {
    text: "Reviews",
    href: "/reviews",
  },
  {
    text: "",
    href: "/tips",
  },
] as NavItem[];

export const useNav = () => {
  const userPermissions = usePermissions();
  const router = useRouter();
  const navItems = useMemo(() => {
    return [
      ...nav,
      ...(userPermissions?.data?.user?.admin
        ? [
            { href: "/admin/blog", text: "Blog management", isActive: true },
            {
              href: "/admin/location",
              text: "Location management",
              isActive: true,
            },
          ]
        : []),
    ];
  }, [
    userPermissions?.data?.user?.admin,
    router,
    router.isReady,
    router.pathname,
  ]);
  return navItems;
};
