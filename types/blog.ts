export type BlogData = {
  title: string;
  subtitle?: string;
  date: BlogDate;
  body?: string[];
  author: string;
  bodyLink?: string;
} & ({body: string[]} | {bodyLink: string});

export type BlogDate = {
  firstNight: string;
  lastNight: string;
  arrival: string;
  departure: string;
};
