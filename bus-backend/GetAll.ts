import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import AWS from "aws-sdk";
import { BlogData, BusTableItem, PARTITIONS, PartitionName } from "../types";
import { busTable } from "./utils/busTable";

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * advisable to save your AWS credentials and configurations in an environmet file. Not inside the code
 * AWS lib will automatically load the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY if available in your environment
 */
// const s3Client = new S3Client({ region: 'us-east-1' });

export type GetAllBlogInput = { type: PartitionName };

const getBody = (event: APIGatewayProxyEvent): GetAllBlogInput => {
  if (!event.pathParameters) throw Error("No slug or id in path");
  const { type } = event.pathParameters as GetAllBlogInput;
  if (!type) {
    throw Error("Type not defined!");
  }
  if (!Object.values(PARTITIONS).includes(type)) {
    throw Error("Invalid type " + type);
  }
  return { type };
};

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = getBody(event);
    const response = await busTable.getAll(body);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        body: {
          items: response,
          total: response?.length ?? 0,
        },
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
