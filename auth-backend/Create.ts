import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import bcrypt from "bcrypt";

import { PARTITIONS, authTable } from "./utils/authTable";
import { UserData } from "../types";
import { randomUUID } from "crypto";
import { encodeUserToken } from "./utils/token";
const SALT_ROUNDS = 15;

export type CreateUserInput = {
  username: string;
  password: string;
  name: string;
} & Partial<UserData>;

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
    console.log({ event });
    const { password, ...body } = getBody(event);
    console.log({ body });
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const id = randomUUID();
    const a = await authTable.user.create({
      ...body,
      hash,
      type: PARTITIONS.USER,
      id,
      createdAt: new Date().getTime(),
    });
    const tokenHash = randomUUID();
    const b = await authTable.token.create({
      type: PARTITIONS.TOKEN,
      tokenHash,
      id,
      valid: true,
      createdAt: new Date().getTime(),
    });

    console.log({ a, b });
    const token = encodeUserToken({ id, tokenHash });
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
