import AWS from "aws-sdk";
import type DynamoDBType from "aws-sdk/clients/dynamodb";
var DynamoDB = new AWS.DynamoDB.DocumentClient();

export async function GetObjectFromDynamo(params: {
  TableName: string;
  Key: { [key: string]: any };
}): Promise<DynamoDBType.DocumentClient.GetItemOutput> {
  return await new Promise((res, rej) => {
    DynamoDB.get(params, function (err: Error, data: any) {
      console.log({ err, stack: err?.stack, data });
      if (err) rej(err);
      else res(data);
    });
  });
}

export async function GetObjectsFromDynamoIndex(
  params: DynamoDBType.DocumentClient.QueryInput
): Promise<DynamoDBType.DocumentClient.QueryOutput> {
  return await new Promise((res, rej) => {
    DynamoDB.query(params, function (err: Error, data: any) {
      console.log({ err, stack: err?.stack, data });
      if (err) rej(err);
      else res(data);
    });
  });
}
export async function GetAllInPartitionFromDynamo(params: {
  TableName: string;
  Partition: string;
}): Promise<DynamoDBType.DocumentClient.QueryOutput> {
  return await new Promise((res, rej) => {
    DynamoDB.query(
      {
        ...params,
        KeyConditionExpression: "#PK = :PK",
        ExpressionAttributeNames: {
          "#PK": "PK",
        },
        ExpressionAttributeValues: {
          ":PK": params.Partition,
        },
      },
      function (err: Error, data: any) {
        console.log({ err, stack: err?.stack, data });
        if (err) rej(err);
        else res(data);
      }
    );
  });
}
export async function PutObjectToDynamo(
  params: DynamoDBType.DocumentClient.PutItemInput
): Promise<DynamoDBType.DocumentClient.PutItemOutput> {
  return await new Promise((res, rej) => {
    DynamoDB.put(params, function (err: Error, data: any) {
      console.log({ err, stack: err?.stack, data });
      if (err) rej(err);
      else res(data);
    });
  });
}

export async function UpdateObjectInDynamo(
  params: DynamoDBType.DocumentClient.UpdateItemInput
): Promise<DynamoDBType.DocumentClient.UpdateItemOutput> {
  return await new Promise((res, rej) => {
    DynamoDB.update(params, function (err: Error, data: any) {
      console.log({ err, stack: err?.stack, data });
      if (err) rej(err);
      else res(data);
    });
  });
}

export async function DeleteObjectFromDynamo(
  params: DynamoDBType.DocumentClient.DeleteItemInput
): Promise<DynamoDBType.DocumentClient.DeleteItemOutput> {
  return await new Promise((res, rej) => {
    DynamoDB.delete(params, function (err: Error, data: any) {
      console.log({ err, stack: err?.stack, data });
      if (err) rej(err);
      else res(data);
    });
  });
}
