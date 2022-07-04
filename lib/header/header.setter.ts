import http from "http";
import http2 from "http2";
import { HeaderSetterParams } from "./header";

export const setHead = (
  res: http.ServerResponse | http2.Http2ServerResponse,
  key: string,
  value: HeaderSetterParams
): void => {
  res.setHeader(key, value);
};
