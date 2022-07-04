import http from "http";
import http2 from "http2";
import { HeaderGetterResult } from "./header";

export const getHead = (
  req: http.IncomingMessage | http2.Http2ServerRequest,
  key: string
): HeaderGetterResult => {
  return req.headers[key];
};
