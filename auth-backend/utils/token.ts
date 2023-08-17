import JWT from "jsonwebtoken";
import { SECRET_JWT_HASH } from "../config";

type UserTokenProps = { id: string; tokenHash: string };
export const encodeUserToken = (data: UserTokenProps): string =>
  JWT.sign(data, SECRET_JWT_HASH, { expiresIn: "7 days" });
export const decodeUserToken = (token: string): UserTokenProps => {
  return JWT.verify(token, SECRET_JWT_HASH) as UserTokenProps;
};
