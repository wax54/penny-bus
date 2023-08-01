import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import AWS from "aws-sdk";

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * advisable to save your AWS credentials and configurations in an environmet file. Not inside the code
 * AWS lib will automatically load the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY if available in your environment
 */
// const s3Client = new S3Client({ region: 'us-east-1' });

export type UpdateBlogInput = {
  blog: {
    slug: string;
    body?: string;
  };
};

const getBody = (event: APIGatewayProxyEvent): UpdateBlogInput => {
  if (!event.body) throw Error("No body");
  try {
    const body = JSON.parse(event.body);
    return body;
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
    // console.log(body);

    const blogUpdates = body.blog;
    const bucket = "prod-bus-website";
    console.log(JSON.stringify({ blogUpdates, bucket }, null, 2));
    const path = "db/blog-articles/" + blogUpdates.slug + ".md";
    console.log(JSON.stringify({ path }, null, 2));

    if (blogUpdates.body) {
      const a = await putObjectToS3(bucket, path, blogUpdates.body);
      console.log(a);
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        input: event,
        path,
        blogUpdates,
        bucket,
        body,
      }),
    };
  } catch (e: any) {
    console.log(e);
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, e, error: e.messages }),
    };
  }
};

async function putObjectToS3(bucket: string, key: string, data: string) {
  var s3 = new AWS.S3();
  var params = {
    Bucket: bucket,
    Key: key,
    Body: data,
  };
  // const a = await s3.putObject(params);
  return await new Promise((res, rej) => {
    s3.putObject(params, function (err: Error, data: any) {
      console.log({ err, stack: err?.stack, data });
      if (err) rej(err);
      else res(data);
    });
  });
}
