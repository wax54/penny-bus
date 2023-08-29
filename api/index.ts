import { logger } from "../logger";
import {
  BlogData,
  BusTableItem,
  BusTableKeyComponents,
  LocationData,
  PartitionName,
} from "../types";
import { UserCreateParams } from "../types/user";
type DataType = {
  blog: BlogData;
  location: LocationData;
};
export const Api = {
  // V2
  isViewable: <DataType extends { isHidden?: boolean; arrival?: boolean }>(
    data: DataType
  ): boolean => {
    if (data.isHidden === true) {
      return false;
    }
    if (!data?.arrival) {
      return false;
    }
    return true;
  },
  getAll: async <DataType extends BusTableItem>({
    type,
  }: {
    type: PartitionName;
  }): Promise<
    | {
        success: true;
        body: { items: DataType[]; total: number };
        error?: undefined;
      }
    | { success: false; error: string; body?: undefined }
  > => {
    const getURL = new URL(`/api/${type}`, process.env.NEXT_PUBLIC_SITE_URL);
    try {
      const res = await fetch(getURL, {
        method: "GET",
      });
      const body = await res.json();
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },
  get: async <DataType extends BusTableItem>({
    type,
    slug,
  }: BusTableKeyComponents): Promise<
    | { success: true; body: DataType; error?: undefined }
    | { success: false; error: string; body?: undefined }
  > => {
    const getURL = new URL(
      `/api/${type}/${slug}`,
      process.env.NEXT_PUBLIC_SITE_URL
    );
    try {
      const res = await fetch(getURL, {
        method: "GET",
      });
      const body = await res.json();
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },

  update: async <DataType extends BusTableItem>(
    data: Partial<DataType>
  ): Promise<{ success: boolean } & any> => {
    const updateUrl = new URL(
      `/api/${data.type}/${data.slug}`,
      process.env.NEXT_PUBLIC_SITE_URL
    );
    try {
      const res = await fetch(updateUrl, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const body = await res.json();
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },

  create: async <DataType extends BusTableItem>(
    data: DataType
  ): Promise<{ success: boolean } & any> => {
    const createUrl = new URL(
      `/api/${data.type}/${data.slug}/`,
      process.env.NEXT_PUBLIC_SITE_URL
    );
    try {
      const res = await fetch(createUrl, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const body = await res.json();
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },

  delete: async (
    data: BusTableKeyComponents
  ): Promise<{ success: boolean } & any> => {
    const createUrl = new URL(
      `/api/${data.type}/${data.slug}/`,
      process.env.NEXT_PUBLIC_SITE_URL
    );
    try {
      const res = await fetch(createUrl, {
        method: "DELETE",
      });
      const body = await res.json();
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },
};

export const AuthApi = {
  create: async (
    user: UserCreateParams
  ): Promise<{ success: boolean; token: string } & any> => {
    const createUrl = new URL(`/auth/create`, process.env.NEXT_PUBLIC_SITE_URL);
    try {
      const res = await fetch(createUrl, {
        method: "POST",
        body: JSON.stringify(user),
      });
      const body = await res.json();
      return body;
    } catch (e) {
      logger(e);
      console.log(e);
      return { success: false, error: "unknown" };
    }
  },
  login: () => {
    throw Error("NOT IMPLEMENTED");
  },
};
