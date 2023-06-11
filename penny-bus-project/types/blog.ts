export type Blog = {
  title: string;
  subtitle?: string;
  date: BlogDate;
  body: string;
};

export type BlogDate = {
  firstNight: string;
  lastNight: string;
  arrival: string;
  departure: string;
};
