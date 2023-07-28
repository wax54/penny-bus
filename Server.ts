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
  console.log(JSON.stringify(event));
  return await handleRequest(event, ctx);
};
