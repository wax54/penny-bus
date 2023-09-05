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
    href: "/videos",
    isActive: true,
  },
  {
    text: "Lifestyle",
    href: "/lifestyle",
    isActive: true,
  },
  {
    text: "Shop",
    href: "/shop",
    isActive: true,
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
