import bcrypt from "bcrypt";
import { CreateUserInput } from "../../types";
import { SALT_ROUNDS } from "../config";
import { randomUUID } from "crypto";
import { PARTITIONS, authTable } from "./authTable";

export const createUser = async ({ password, ...body }: CreateUserInput) => {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const id = randomUUID();
  const user = {
    ...body,
    hash,
    type: PARTITIONS.USER,
    id,
    createdAt: new Date().getTime(),
  };
  await authTable.user.create(user);
  return user;
};
