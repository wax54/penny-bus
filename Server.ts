import NextServer from "next/dist/server/next-server";
import serverless from "serverless-http";
// @ts-ignore
import { config } from "./.next/required-server-files.json";

const nextServer = new NextServer({
  dev: true,
  dir: __dirname,
  conf: {
    ...(config as any),
    distDir: "./.next",
  },
});

const handleRequest = serverless(nextServer.getRequestHandler(), {
  binary: ["*/*"],
});

export const handler = async (event: any, ctx: any) => {
  const response: {
    statusCode: number;
    headers: Record<string, string>;
    isBase64Encoded: boolean;
    body: string;
  } = (await handleRequest(event, ctx)) as any;
  if (
    response.isBase64Encoded &&
    response.headers["content-type"] === "application/json"
  ) {
    response.body = Buffer.from(response.body, "base64").toString("utf-8");
    response.headers["content-length"] = response.body.length + "";
    response.isBase64Encoded = false;
  }
  return response;
};
