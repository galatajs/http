import http from "http";
import http2 from "http2";
import { CookieOptions } from "./cookie";

export const setCookie = <T = string>(
  res: http.ServerResponse | http2.Http2ServerResponse,
  key: string,
  value: T,
  options: CookieOptions = { httpOnly: true }
): void => {
  let val = typeof value !== "string" ? JSON.stringify(value) : value;
  let result = `${key}=${val}`;
  if (options.maxAge) {
    result += `; Max-Age=${options.maxAge}`;
  }
  if (options.domain) {
    result += `; Domain=${options.domain}`;
  }
  if (options.path) {
    result += `; Path=${options.path}`;
  }
  if (options.sameSite) {
    result += `; SameSite=${options.sameSite}`;
  }
  if (options.httpOnly) {
    result += `; HttpOnly`;
  }
  if (options.secure) {
    result += `; Secure`;
  }
  res.setHeader("Set-Cookie", result);
};
