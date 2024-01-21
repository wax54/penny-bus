import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { CreateUserInput } from "../types";
import { User } from "./utils/user";
import { Token } from "./utils/token";
import { HandlerError } from "../image-backend/Errors";
import { ORIGINS, OriginName } from "./utils/authTable";
import { getOrigin } from "./utils/common";

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
    const origin = getOrigin(event);
    const body = getBody(event);
    const { id, admin } = await User.create(body, origin);
    const token = await Token.create({
      id,
      admin,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        token,
      }),
    };
  } catch (e: any) {
    if (e instanceof HandlerError) {
      return e.generateHandlerResponse();
    } else {
      console.log(e);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, e, error: e.message }),
      };
    }
  }
};
