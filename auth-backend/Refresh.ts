import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { PARTITIONS, authTable } from "./utils/authTable";
import { decodeUserToken, encodeUserToken } from "./utils/token";
import { randomUUID } from "crypto";
export type RefreshUserInput = { token: string };
const TOO_OLD_TO_REFRESH_DAYS = 120;

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
    console.log({ event });
    const { token: oldToken } = getBody(event);
    const data = decodeUserToken(oldToken);
    const oldTokenKeyComponents = {
      type: PARTITIONS.TOKEN,
      tokenHash: data.tokenHash,
      id: data.id,
      valid: true,
    } as const;
    const tokenRecord = await authTable.token.get(oldTokenKeyComponents);
    if (tokenRecord) {
      if (
        tokenRecord.createdAt + TOO_OLD_TO_REFRESH_DAYS * 24 * 60 * 60 * 1000 > // days * 24 hours * 60 mins * 60 seconds * 1000 ms
        new Date().getTime()
        // not too old to renew
      ) {
        const tokenHash = randomUUID();

        await authTable.token.create({
          ...oldTokenKeyComponents,
          tokenHash,
          valid: true,
          createdAt: new Date().getTime(),
        });

        const newToken = encodeUserToken({ id: data.id, tokenHash });

        await authTable.token.invalidate(oldTokenKeyComponents);
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            token: newToken,
            invalidated: oldToken,
          }),
        };
      }
    }

    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        message: "Token not eligable for renwal, please log in again",
        loginURL: "/login",
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
