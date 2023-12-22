import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { CreateUserInput } from "../types";
import { createToken } from "./utils/token";
import { createUser } from "./utils/user";

const getBody = (event: APIGatewayProxyEvent): CreateUserInput => {
  if (!event.body) throw Error("No body");
  try {
    const body = JSON.parse(event.body) as CreateUserInput;
    if (!body.username || !body.password) {
      throw Error("Please enter username and password!");
    }
    return body;
  } catch (e) {
    throw Error("malformed body");
  }
};

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = getBody(event);
    const { id } = await createUser(body);
    const token = await createToken({
      id,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        token,
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
