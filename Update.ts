import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import AWS from "aws-sdk";

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));
  const body = event.body
    ? JSON.parse(event.body)
    : { data: "", slug: "failed" };

  //get slug
  //put object to s3
  //
  //return confirm
  const bucket = "prod-bus-website";
  const path = "/db/blog-articles/" + body.slug + ".md";
  putObjectToS3(bucket, path, body.data);
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, input: event }),
  };
};

function putObjectToS3(bucket: string, key: string, data: string) {
  var s3 = new AWS.S3();
  var params = {
    Bucket: bucket,
    Key: key,
    Body: data,
  };
  s3.putObject(params, function (err: Error, data: any) {
    console.log(err, data);
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
}
