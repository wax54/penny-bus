import {
  OriginName,
  PARTITIONS,
  PartitionName,
} from "../auth-backend/utils/authTable";

export type MinAuthDBData = {
  PK: PartitionName;
  SK: string;
};

export type TokenKey = {
  PK: typeof PARTITIONS.TOKEN;
  SK: string;
};

export type UserKeys = UserKey & UserGSI1Key;

export type UserKey = {
  PK: typeof PARTITIONS.USER;
  SK: string;
};

export type UserGSI1Key = {
  GSI1PK: typeof PARTITIONS.USER;
  GSI1SK: string;
};

export type TokenKeyComponents = {
  type: typeof PARTITIONS.TOKEN;
  tokenHash: string;
  id: string;
  valid: boolean;
};

export type UserKeyComponents = {
  type: typeof PARTITIONS.USER;
  id: string;
};

export type UserGSI1KeyComponents = {
  type: typeof PARTITIONS.USER;
  username: string;
};
export type TokenData = TokenKeyComponents & {
  createdAt: number;
  valid: boolean;
  admin: boolean;
  deleteDate: number;
};

export type OriginData = Partial<Record<OriginName, number>>;

export type UserData = UserKeyComponents &
  UserGSI1KeyComponents & {
    username: string;
    name: string;
    hash: string;
    email?: string;
    phone?: string;
    address?: string;
    tz?: string;
    createdAt: number;
    admin: boolean;
  } & OriginData;

export type UserDBData = UserKeys & UserData;
export type TokenDBData = TokenKey & TokenData;

export type AuthTableItem = UserData | TokenData;
export type AuthTableKeyComponents = UserKeyComponents | TokenKeyComponents;
export type AuthTableGSI1KeyComponents = UserGSI1KeyComponents;
export type AuthTableDBItem = MinAuthDBData & (UserDBData | TokenDBData);

//API inputs
export type CreateUserInput = {
  username: string;
  password: string;
  name: string;
} & Partial<UserData>;

export type LoginUserInput = Pick<CreateUserInput, "username" | "password"> &
  OriginData;
