const getFromEnv = (key: string) => {
  const param = process.env[key];
  if (!param) {
    throw Error("'" + key + "' doesn't exist");
  }
  return param;
};

const config = {
  get IMAGE_BUCKET() {
    return getFromEnv('IMAGE_BUCKET')
  },
};
export default config;
