import { APIGatewayEvent } from "aws-lambda";
import AWS from "aws-sdk";
import parseMultipart from "./parseMultipart";
import config from "./config";

const s3 = new AWS.S3();

export const handler = async (event: APIGatewayEvent) => {
  try {
    const callerBaseFolder = "pennybusproject.com";
    const imageFolder = "images";
    const { filename, data } = extractFile(event);
    console.log(filename, data, config.IMAGE_BUCKET);

    await s3
      .putObject({
        Bucket: config.IMAGE_BUCKET,
        Key: [callerBaseFolder, imageFolder, filename].join("/"),
        Body: data,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        link: `https://dev.pennybusproject.com/images/${[
          imageFolder,
          filename,
        ].join("/")}`,
        s3: `https://${config.IMAGE_BUCKET}.s3.amazonaws.com/${filename}`,
      }),
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
    const [{ filename, data }] = parts;

    return {
      filename,
      data,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}
