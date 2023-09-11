import { PARTITIONS } from "./busTable";
import { Image } from "./image";

export type LocationKey = {
  PK: typeof PARTITIONS.LOCATION;
  SK: string;
};

export type LocationKeyComponents = {
  slug: string;
  type: typeof PARTITIONS.LOCATION;
};

export type CountryCode = "US" | "";
export type LocationData = LocationKeyComponents & {
  countryCode: CountryCode;
  name: string;
  fee: number;
  rate: "nightly";
  pin: {
    lat: number;
    lng: number;
  };
  locationType: "dispersed" | "campsite" | "friend" | "";
  state: string;
  zip: string;
  streetLine1?: string;
  streetLine2?: string;
  formattedAddress?: string;
  city?: string;
  images?: Image[];
  isHidden?: boolean;
};

export type LocationDBData = LocationKey & LocationData;
