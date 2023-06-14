export type Nav = readonly { href: string; text: string }[];
export const nav = [
  {
    text: "Home",
    href: "/",
  },
  {
    text: "Bus Tour",
    href: "tour",
  },
  {
    text: "Blog",
    href: "blog",
  },

  {
    text: "Videos",
    href: "videos",
  },

  {
    text: "FAQ",
    href: "faq",
  },

  {
    text: "Reviews",
    href: "reviews",
  },

  {
    text: "Tips + Tricks",
    href: "tips",
  },

  {
    text: "Photos",
    href: "photos",
  },
] as const;
