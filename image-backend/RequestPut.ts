import AWS from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { ERRORS, HandlerError } from "./Errors";
import config from "./config";
import { generateHandlerResponse } from "./utils";

const s3 = new AWS.S3({
  signatureVersion: "v4",
});

const CALLER_BASE_FOLDER = "pennybusproject.com";
const IMAGE_FOLDER = "images";

const getType = (fileSuffix: "jpg" | "jpeg" | "png" | string) => {
  switch (fileSuffix.toLowerCase()) {
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    default:
      throw new HandlerError(ERRORS.UNKNWON_FORMAT, { fileType: fileSuffix });
  }
};

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { body } = event;
    if (!body) {
      throw new HandlerError(ERRORS.NO_BODY);
    }
    const request = JSON.parse(body) as {
      name: string;
    };
    const parts = request.name.split(".");
    const name = parts.slice(0, -1).join(".");
    const fileSuffix = parts[parts.length - 1];
    const type = getType(fileSuffix);
    const storedName = [name, new Date().getTime(), fileSuffix].join(".");
    const url = s3.getSignedUrl("putObject", {
      Bucket: config.IMAGE_BUCKET,
      Key: [CALLER_BASE_FOLDER, IMAGE_FOLDER, storedName].join("/"),
      ContentType: type,
      Expires: 60 * 60, // 60s * 60m = 1h
    });
    return generateHandlerResponse(200, {
      success: true,
      url,
      storedName,
      type,
    });
  } catch (e: any) {
    if (e.generateHandlerResponse) {
      return e.generateHandlerResponse();
    }
    return new HandlerError(ERRORS.SERVER_ERROR, {
      message: e.message,
      fullError: e,
    }).generateHandlerResponse();
  }
};
