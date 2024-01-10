import { UserData } from "./auth";

export type UserLoginParams = {
  username: string;
  password: string;
};

export type UserCreateParams = {
  username: string;
  password: string;
  name: string;
};

export type userPermissions = {
  loggedIn?: boolean;
  user?: UserData;
};
