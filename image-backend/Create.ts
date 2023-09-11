import { APIGatewayEvent } from "aws-lambda";
import AWS from "aws-sdk";
import parseMultipart from "./parseMultipart";
import config from "./config";
import { ImageCreate200Response } from "./types";

const s3 = new AWS.S3();

export const handler = async (event: APIGatewayEvent) => {
  try {
    const slug = event.pathParameters?.slug;
    const callerBaseFolder = "pennybusproject.com";
    const imageFolder = "images";
    const { filename, data } = extractFile(event);
    const storedName =
      slug + "." + new Date().getTime() + "." + filename.split(".")[-1];
    await s3
      .putObject({
        Bucket: config.IMAGE_BUCKET,
        Key: [callerBaseFolder, imageFolder, storedName].join("/"),
        Body: data,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          link: `https://dev.pennybusproject.com/${[
            imageFolder,
            storedName,
          ].join("/")}`,
          path: `${[imageFolder, storedName].join("/")}`,
          s3: `https://${config.IMAGE_BUCKET}.s3.amazonaws.com/${imageFolder}/${storedName}`,
        },
      } as ImageCreate200Response),
    };
  } catch (err: any) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ statusCode: 500, message: err.stack }),
    };
  }
};

function extractFile(event: APIGatewayEvent) {
  if (!event.headers["Content-Type"] || !event.body) {
    throw Error("No content-type in header or no body!");
  }
  try {
    const boundary = parseMultipart.getBoundary(event.headers["Content-Type"]);
    if (event.isBase64Encoded) {
      event.body = Buffer.from(event.body, "base64").toString();
    }
    const parts = parseMultipart.Parse(Buffer.from(event.body), boundary) as {
      filename: string;
      type: string;
      data: Buffer;
    }[];
    const [{ filename, data, type }] = parts;
    return {
      filename,
      data,
      type,
    };
  } catch (e) {
    console.log("ERRORED", e);
    throw e;
  }
}
