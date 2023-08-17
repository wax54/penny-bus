import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { decodeUserToken } from "./utils/token";
export type AuthenticateUserInput = { token: string };

const getBody = (event: APIGatewayProxyEvent): AuthenticateUserInput => {
  if (!event.body) throw Error("No body");
  try {
    const body = JSON.parse(event.body) as AuthenticateUserInput;
    if (!body.token) {
      throw Error("Please send a token!");
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
    const { token } = getBody(event);
    const data = decodeUserToken(token);
    if (data.id && data.tokenHash) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          valid: true,
        }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          valid: false,
          message: "Token not valid, please try to refresh",
          loginURL: "/refresh",
        }),
      };
    }
  } catch (e: any) {
    console.log(e);
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        valid: false,
        e,
        error: e.message,
      }),
    };
  }
};
