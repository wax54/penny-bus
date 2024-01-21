import bcrypt from "bcryptjs";
import { CreateUserInput, LoginUserInput } from "../../types";
import { SALT_ROUNDS } from "../config";
import { randomUUID } from "crypto";
import { OriginName, PARTITIONS, authTable } from "./authTable";
import { Token } from "./token";
import { HandlerError } from "../../image-backend/Errors";

export const User = {
  create: async (
    { password, ...body }: CreateUserInput,
    origin: OriginName
  ) => {
    if (!password || !body.username || !body.name) {
      throw new HandlerError(
        {
          message: "username, password and name required for user creation",
          code: 400,
        },
        { body }
      );
    }
    const existingUser = await authTable.user.getByUsername({
      type: PARTITIONS.USER,
      username: body.username,
    });
    if (existingUser) {
      throw new HandlerError(
        { message: "Username already exists!", code: 409 },
        { username: body.username }
      );
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const id = randomUUID();
    const createdAt = new Date().getTime();
    const user = {
      ...body,
      hash,
      type: PARTITIONS.USER,
      id,
      createdAt,
      admin: false,
      ["origin -" + origin]: createdAt,
    };
    await authTable.user.create(user);
    return user;
  },
  login: async ({ username, password }: LoginUserInput, origin: OriginName) => {
    if (!password || !username) {
      throw new HandlerError(
        {
          message: "username and password required for user login",
          code: 400,
        },
        { username }
      );
    }
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
      await authTable.user.update({
        type: PARTITIONS.USER,
        id: user.id,
        ["origin" + origin]: new Date().getTime(),
      });
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
      return { ...user, hash: undefined };
    }
  },
};
