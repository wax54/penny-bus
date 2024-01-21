import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { LoginUserInput } from "../types";
import { User } from "./utils/user";
import { Token } from "./utils/token";
import { HandlerError } from "../image-backend/Errors";
import { getOrigin } from "./utils/common";

const getBody = (event: APIGatewayProxyEvent): LoginUserInput => {
  if (!event.body) throw Error("No body");
  try {
    const body = JSON.parse(event.body) as LoginUserInput;
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
    const origin = getOrigin(event);
    const loginBody = getBody(event);

    const user = await User.login(loginBody, origin);
    const token = await Token.create(user);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        token,
      }),
    };
  } catch (e: any) {
    console.log(e);
    if (e instanceof HandlerError) {
      return e.generateHandlerResponse();
    }

    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        message: "username or password not found",
      }),
    };
  }
};
function passCompare(password: string, hash: string) {
  throw new Error("Function not implemented.");
}
