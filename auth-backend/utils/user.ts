import bcrypt from "bcryptjs";
import { CreateUserInput, LoginUserInput } from "../../types";
import { SALT_ROUNDS } from "../config";
import { randomUUID } from "crypto";
import { PARTITIONS, authTable } from "./authTable";
import { Token } from "./token";

export const User = {
  create: async ({ password, ...body }: CreateUserInput) => {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const id = randomUUID();
    const user = {
      ...body,
      hash,
      type: PARTITIONS.USER,
      id,
      createdAt: new Date().getTime(),
      admin: false
    };
    await authTable.user.create(user);
    return user;
  },
  login: async ({ username, password }: LoginUserInput) => {
    const user = await authTable.user.getByUsername({
      type: PARTITIONS.USER,
      username,
    });
    const verified = await bcrypt.compare(
      password ?? "Random string meant to fail",
      user?.hash ?? "Random hash meant to fail"
    );

    if (!user) {
      throw Error("User not found");
    }
    if (!verified) {
      throw Error("Invalid password");
    } else {
      return user;
    }
  },

  authenticate: async (token: string) => {
    const data = await Token.validate(token);
    if (data.id && data.tokenHash) {
      return {
        data: data,
        valid: true,
      };
    } else {
      return { valid: false };
    }
  },
  get: async (token: string) => {
    const data = await Token.validate(token);
    if (data.id && data.tokenHash) {
      const user = await authTable.user.get({
        type: PARTITIONS.USER,
        id: data.id,
      });

      if (!user) {
        throw Error("User not found");
      }
      return { user, hash: undefined };
    }
  },
};
