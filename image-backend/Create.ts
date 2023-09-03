import { APIGatewayEvent } from "aws-lambda";
import AWS from "aws-sdk";
import parseMultipart from "parse-multipart";
import config from "./config";

const s3 = new AWS.S3();

export const handler = async (event: APIGatewayEvent) => {
  try {
    console.log(JSON.stringify({ event }, null, 2));
    const callerBaseFolder = "pennybosproject.com";
    const imageFolder = "images";
    const { filename, data } = extractFile(event);
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
        link: `https://${config.IMAGE_BUCKET}.s3.amazonaws.com/${filename}`,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.stack }),
    };
  }
};

function extractFile(event: APIGatewayEvent) {
  if (!event.headers["content-type"] || !event.body)
    throw Error("No content-type in header or no body!");
  const boundary = parseMultipart.getBoundary(event.headers["content-type"]);
  const parts = parseMultipart.Parse(
    Buffer.from(event.body, "base64"),
    boundary
  );
  const [{ filename, data }] = parts;

  return {
    filename,
    data,
  };
}
