import { BlogData } from "../../types";

export default {
  "fathers-home": {},
  "brother-home": {},
  "hughs-flower-farm-hipcamp": {},
  "honey-lake-rv-park": {},
  "the-boys-home": {},
  "joshua-tree-dispersed": {},
  "hot-springs-hotel": {},
  "anderson-walmart": {
    title: "Anderson - Walmart",
    date: {
      firstNight: "2023-06-10",
      lastNight: "2023-06-10",
      arrival: "2023-06-10T23:58:00.000-07:00",
      departure: "2023-06-11T07:30:00.000-07:00",
    },
    author: "Sam Crewe-Sullam",
  },
  "aikens-west-creek-campground": {},
  "beach-house-airbnb": {},
  "tish-tang-campground": {
    title: "Tish Tang - Campground",
    fee: 20,
    siteName: "25",
    date: {
      firstNight: "2023-06-18",
      lastNight: "2023-06-23",
      arrival: "2023-06-18T15:58:00.000-07:00",
      departure: "2023-06-24T09:30:00.000-07:00",
    },
    author: "Sam Crewe-Sullam",
    bodyLink: "/db/blog-articles/tish-tang-campground.md",
  },

  "lagoon-campground": {
    title: "Lagoon!",
    fee: 22,
    siteName: "36",
  },
  "tillamook-dispersed": {
    title: "The mountain",
  },
  "seaside-thousand-trails": {
    title: "Failed Disapointment",
  },
  "cooks-creek-dispersed": {
    title: "Giant campsite!",
    siteName: "5",
  },
  "sams-dad-home-2": {
    title: "A nice break",
  },
  "zoes-uncle-home": {
    title: "The Cabin!",
  },
  "sams-dad-home-3": {
    title: "Getting Road ready",
    isHidden: {
      reason: 'not visited',
      releaseDate: '2023-08-02T08:00:00.000Z'
    }
  },
  "olympic-penninsula-mystery": {
    title: "Getting Road ready",
    isHidden: true
  },
} as unknown as { [key: string]: BlogData };
