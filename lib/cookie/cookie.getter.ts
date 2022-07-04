import http from "http";
import http2 from "http2";

export const getCookie = (
  req: http.IncomingMessage | http2.Http2ServerRequest,
  key: string
): string | undefined => {
  return req.headers["cookie"]
    ?.split(";")
    .find((cookie) => cookie.includes(`${key}=`))
    ?.split("=")[1];
};
