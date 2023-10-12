import AWS from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { ERRORS } from "./Errors";
import config from "./config";

const s3 = new AWS.S3();

const CALLER_BASE_FOLDER = "pennybusproject.com";
const IMAGE_FOLDER = "images";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};
export const makeResponse = (
  statusCode: number,
  body: any,
  extraHeaders?: { [key: string]: string }
) => {
  return {
    statusCode,
    headers: { ...headers, ...extraHeaders },
    body: JSON.stringify(body, null, 2),
  };
};

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { body } = event;
    if (!body) {
      return makeResponse(400, {
        success: false,
        error: ERRORS.NO_BODY,
      });
    }
    const request = JSON.parse(body) as {
      name: string;
      type: "image/png" | "image/jpeg";
    };
    const { type, name } = request;

    const storedName =
      name + "." + new Date().getTime() + "." + name.split(".")[-1];
    const url = s3.getSignedUrl("putObject", {
      Bucket: config.IMAGE_BUCKET,
      Key: [CALLER_BASE_FOLDER, IMAGE_FOLDER, storedName].join("/"),
      ContentType: type,
      Expires: 60 * 60, // 60s * 60m = 1h
    });
    return makeResponse(200, { url });
  } catch (e: any) {
    return makeResponse(500, { error: e.message, fullError: e });
  }
};
