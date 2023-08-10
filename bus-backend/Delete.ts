import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import AWS from "aws-sdk";
import { BlogData, BusTableItem, BusTableKeyComponents } from "../types";
import { PARTITIONS, PartitionName, busTable } from "./utils/busTable";

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * advisable to save your AWS credentials and configurations in an environmet file. Not inside the code
 * AWS lib will automatically load the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY if available in your environment
 */
// const s3Client = new S3Client({ region: 'us-east-1' });

export type DeleteInput = BusTableKeyComponents;

const getBody = (event: APIGatewayProxyEvent): DeleteInput => {
  if (!event.pathParameters) throw Error("No slug or type in path");
  const { type, slug } = event.pathParameters as DeleteInput;
  if (!type || !slug) {
    throw Error("Type or slug not defined!");
  }
  if (!Object.values(PARTITIONS).includes(type)) {
    throw Error("Invalid type " + type);
  }
  return { type, slug };
};

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = getBody(event);
    const response = await busTable.delete(body);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        body: response,
      }),
    };
  } catch (e: any) {
    console.log(e);
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, e, error: e.message }),
    };
  }
};
