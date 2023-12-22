import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import bcrypt from "bcrypt";

import { PARTITIONS, authTable } from "./utils/authTable";
import { UserData } from "../types";
import { createToken} from "./utils/token";

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
    const { password, username } = getBody(event);
    const user = await authTable.user.getByUsername({
      type: PARTITIONS.USER,
      username,
    });
    if (!user) {
      throw Error("User not found");
    }

    const verified = await bcrypt.compare(password, user.hash);
    if (verified) {
      const token = await createToken(user);

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          token,
        }),
      };
    } else {
      throw Error("Invalid password");
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
