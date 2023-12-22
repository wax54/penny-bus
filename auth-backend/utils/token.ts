import JWT from "jsonwebtoken";
import { SECRET_JWT_HASH, TOO_OLD_TO_REFRESH_DAYS } from "../config";
import { PARTITIONS, authTable } from "./authTable";
import { randomUUID } from "crypto";
import { RefreshUserInput } from "../Refresh";
import { TokenData } from "../../types";

type UserTokenProps = { id: string; tokenHash: string };
export const encodeUserToken = (data: UserTokenProps): string =>
  JWT.sign(data, SECRET_JWT_HASH, { expiresIn: "7 days" });
export const decodeUserToken = (token: string): UserTokenProps => {
  return JWT.verify(token, SECRET_JWT_HASH) as UserTokenProps;
};

export const createToken = async ({ id }: { id: string }) => {
  const tokenHash = randomUUID();
  await authTable.token.create({
    type: PARTITIONS.TOKEN,
    tokenHash,
    id,
    valid: true,
    createdAt: new Date().getTime(),
  });
  const token = encodeUserToken({ id, tokenHash });
  return token;
};

export const validateToken = async (oldToken: RefreshUserInput["token"]) => {
  const data = decodeUserToken(oldToken);
  const oldTokenKeyComponents = {
    type: PARTITIONS.TOKEN,
    tokenHash: data.tokenHash,
    id: data.id,
    valid: true,
  } as const;
  const tokenRecord = await authTable.token.get(oldTokenKeyComponents);

  if (tokenRecord && tokenRecord.valid === true) {
    if (
      tokenRecord.createdAt + TOO_OLD_TO_REFRESH_DAYS * 24 * 60 * 60 * 1000 > // days * 24 hours * 60 mins * 60 seconds * 1000 ms
      new Date().getTime()
      // not too old to renew
    ) {
      return tokenRecord as TokenData & { valid: true };
    } else {
      throw Error("token too old to renew");
    }
  } else {
    throw Error("token not found");
  }
};
