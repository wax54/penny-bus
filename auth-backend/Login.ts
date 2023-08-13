import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import bcrypt from "bcrypt";

import AWS from "aws-sdk";
import { PARTITIONS, authTable } from "./utils/authTable";
import { UserData } from "../types";
import { randomUUID } from "crypto";
import { encodeUserToken } from "./utils/token";

export type LoginUserInput = {
  username: string;
  password: string;
  name: string;
} & Partial<UserData>;

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
    console.log({ event });
    const { password, username } = getBody(event);
    const user = (await authTable.user.getByUsername({
      type: PARTITIONS.USER,
      username,
    })) as UserData;

    const verified = await bcrypt.compare(password, user.hash);
    if (verified) {
      const tokenHash = randomUUID();

      const b = await authTable.token.create({
        type: PARTITIONS.TOKEN,
        tokenHash,
        id: user.id,
        valid: true,
        createdAt: new Date().getTime(),
      });
      const token = encodeUserToken({ id: user.id, tokenHash });

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          token,
        }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: "username or password not found",
        }),
      };
    }
  } catch (e: any) {
    console.log(e);

    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        message: "username or password not found",
      }),
    };
    // return {
    //   statusCode: 400,
    //   body: JSON.stringify({ success: false, e, error: e.message }),
    // };
  }
};
