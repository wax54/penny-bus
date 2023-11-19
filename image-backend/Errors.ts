import { generateHandlerResponse } from "./utils";

export const ERRORS = {
  NO_BODY: { message: "no body", code: 400 },
  UNKNWON_FORMAT: { message: "unknown format", code: 400 },
  SERVER_ERROR: { message: "server error", code: 500 },
};
export class HandlerError extends Error {
  code: number;
  info?: { [key: string]: any };

  constructor(
    params: { message: string; code: number },
    info?: { [key: string]: any }
  ) {
    super(params.message);
    this.code = params.code;
    this.info = info;
  }

  private generateErrorResponseBody() {
    return {
      success: false,
      code: this.code,
      error: this.message,
      info: this.info
    };
  }

  generateHandlerResponse() {
    return generateHandlerResponse(this.code, this.generateErrorResponseBody());
  }
}
