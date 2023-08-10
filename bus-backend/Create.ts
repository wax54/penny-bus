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

export type CreateBlogInput = BusTableItem;

const getBody = (event: APIGatewayProxyEvent): CreateBlogInput => {
  if (!event.pathParameters) throw Error("No type or slug specified in path");
  if (!event.body) throw Error("No body");
  try {
    const body = JSON.parse(event.body) as Omit<BusTableItem, "type" | "slug"> &
      Partial<Pick<BusTableItem, "type" | "slug">>;
    const { type, slug } = event.pathParameters as BusTableKeyComponents;

    if (!type || !slug) {
      throw Error("Type or slug not defined!");
    }
    if (!Object.values(PARTITIONS).includes(type)) {
      throw Error("Invalid type " + type);
    }
    return { ...body, type, slug };
  } catch (e) {
    throw Error("malformed body");
  }
};

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log({ event });
    const body = getBody(event);
    if (body) {
      console.log({ body });
      const a = await busTable.create(body);
      console.log({ a });
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        body,
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
