import http from "http";
import http2 from "http2";
import { CookieGetter } from "../cookie/cookie";
import { HeaderGetter } from "../header/header";

export interface BaseRequest {
  ip: string;
  body: Record<string, any>;
  params: Record<string, any>;
  query: Record<string, any>;
  cookie: CookieGetter;
  header: HeaderGetter;
}

export interface Http1Request extends http.IncomingMessage, BaseRequest {}
export interface Http2Request extends http2.Http2ServerRequest, BaseRequest {}
