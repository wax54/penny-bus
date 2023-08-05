export type BlogData = {
  title: string;
  subtitle?: string;
  date: BlogDate;
  body?: string;
  author: string;
  fee?: number
  bodyLink?: string;
  isHidden?: boolean | { reason?: string; releaseDate?: string };
} & ({ body: string } | { bodyLink: string });

export type BlogDate = {
  arrival: string;
  departure: string;
};
