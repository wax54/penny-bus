import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { User } from "./utils/user";
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
    const user = await User.get(token);

    return {
      statusCode: 400,
      body: JSON.stringify({
        success: true,
        user,
      }),
    };
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
