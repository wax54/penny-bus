export const SECRET_JWT_HASH = process.env.SECRET_JWT_HASH as string
if (!SECRET_JWT_HASH) {
  throw Error('NO SECRET JWT HASH DEFINED!')
}
export const SALT_ROUNDS = 15;
export const TOO_OLD_TO_REFRESH_DAYS = 120;
