import { APIGatewayEvent } from "aws-lambda";
import { OriginName } from "./authTable";

export const pruneObject = (obj: Record<string, any>) => {
  try {
    return Object.entries(obj).reduce((pruned, [key, val]) => {
      if (val === undefined) {
        return pruned;
      } else {
        pruned[key] = val;
        return pruned;
      }
    }, {} as Record<string, any>);
  } catch (e) {
    return {};
  }
};

export const getOrigin = (event: APIGatewayEvent) => {
  const origin = (event.headers.origin || event.headers.Origin) as OriginName;
  return origin;
};
