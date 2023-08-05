import AWS from "aws-sdk";
var DynamoDB = new AWS.DynamoDB.DocumentClient();

export async function GetObjectFromDynamo(params: {
  TableName: string;
  Key: { [key: string]: any };
}) {
  return await new Promise((res, rej) => {
    DynamoDB.get(params, function (err: Error, data: any) {
      console.log({ err, stack: err?.stack, data });
      if (err) rej(err);
      else res(data);
    });
  });
}

export async function PutObjectToDynamo(params: {
  TableName: string;
  Item: { [key: string]: any };
}) {
  return await new Promise((res, rej) => {
    DynamoDB.put(params, function (err: Error, data: any) {
      console.log({ err, stack: err?.stack, data });
      if (err) rej(err);
      else res(data);
    });
  });
}

export async function UpdateObjectInDynamo(params: {
  TableName: string;
  Item: { [key: string]: any };
  Key: { [key: string]: any };
}) {
  return await new Promise((res, rej) => {
    DynamoDB.update(params, function (err: Error, data: any) {
      console.log({ err, stack: err?.stack, data });
      if (err) rej(err);
      else res(data);
    });
  });
}
