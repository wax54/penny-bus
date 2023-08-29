import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import {  PARTITIONS, PartitionName } from "../types";
import { busTable } from "./utils/busTable";

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * advisable to save your AWS credentials and configurations in an environmet file. Not inside the code
 * AWS lib will automatically load the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY if available in your environment
 */
// const s3Client = new S3Client({ region: 'us-east-1' });

export type GetBlogInput = { type: PartitionName; slug: string };

const getBody = (event: APIGatewayProxyEvent): GetBlogInput => {
  if (!event.pathParameters) throw Error("No slug or id in path");
  const { type, slug } = event.pathParameters as GetBlogInput;
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
    const response = await busTable.get(body);
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
