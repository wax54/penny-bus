export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL as string;
export const IMAGE_PATH = process.env.NEXT_PUBLIC_IMAGE_PATH as string;
if (!SITE_URL) throw Error("NO SITE_URL in env");
if (!IMAGE_PATH) throw Error("NO IMAGE_PATH in env");
