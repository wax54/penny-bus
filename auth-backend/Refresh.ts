import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { authTable } from "./utils/authTable";
import { Token } from "./utils/token";
export type RefreshUserInput = { token: string };

const getBody = (event: APIGatewayProxyEvent): RefreshUserInput => {
  if (!event.body) throw Error("No body");
  try {
    const body = JSON.parse(event.body) as RefreshUserInput;
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
    const { token: oldToken } = getBody(event);
    const oldTokenDetails = await Token.validate(oldToken);
    const newToken = await Token.create(oldTokenDetails);
    await authTable.token.invalidate(oldTokenDetails);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        token: newToken,
        invalidated: oldToken,
      }),
    };
  } catch (e: any) {
    console.log(e);

    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        message: "Token not eligable for renwal, please log in again",
        loginURL: "/login",
      }),
    };
  }
};
