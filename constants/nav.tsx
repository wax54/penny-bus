export type NavItem = { href: string; text: string, isActive?: boolean };
export const nav = [
  {
    text: "Home",
    href: "/home",
    isActive: true
  },
  {
    text: "Bus Tour",
    href: "/tour",
    isActive: false
  },
  {
    text: "Blog",
    href: "/blog",
    isActive: true
  },

  {
    text: "Videos",
    href: "/videos",
  },

  {
    text: "FAQ",
    href: "/faq",
  },

  {
    text: "Reviews",
    href: "/reviews",
  },

  {
    text: "Tips + Tricks",
    href: "/tips",
  },

  {
    text: "Photos",
    href: "/photos",
  },
] as NavItem[];
