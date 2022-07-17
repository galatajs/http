import http from "http";
import http2 from "http2";

export const removeHead = (
  res: http.ServerResponse | http2.Http2ServerResponse,
  key: string
): void => {
  res.removeHeader(key);
};
