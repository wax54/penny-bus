const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const generateHandlerResponse = (
  statusCode: number,
  body: any,
  extraHeaders?: { [key: string]: string }
) => {
  return {
    statusCode,
    headers: { ...headers, ...extraHeaders },
    body: JSON.stringify(body, null, 2),
  };
};
