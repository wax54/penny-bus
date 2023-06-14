export type Nav = readonly { href: string; text: string }[];
export const nav = [
  {
    text: "Home",
    href: "/",
    content: (
      <div id='content' style={{color: 'white', textAlign:'center'}}>
        <h3>Our Mission Statement</h3>
        <p>YAdaYada</p>
        <h3>Who Are We</h3>
        <p>YAdaYada</p>

      </div>
    ),
  },
  {
    text: "Bus Tour",
    href: "tour",
    content: <div>Unfinished</div>,
  },
  {
    text: "Blog",
    href: "blog",
  },

  {
    text: "Videos",
    href: "videos",
    content: <div>Unfinished</div>,
  },

  {
    text: "FAQ",
    href: "faq",
    content: <div>Unfinished</div>,
  },

  {
    text: "Reviews",
    href: "reviews",
    content: <div>Unfinished</div>,
  },

  {
    text: "Tips + Tricks",
    href: "tips",
    content: <div>Unfinished</div>,
  },

  {
    text: "Photos",
    href: "photos",
    content: <div>Unfinished</div>,
  },
] as const;
