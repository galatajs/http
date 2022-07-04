import http from "http";
import http2 from "http2";
import { CookieGetter } from "../cookie/cookie";
import { HeaderGetter } from "../header/header";
import { Modify } from "../types/types";

export interface BaseRequest {
  ip: string;
  body: Record<string, any>;
  params: Record<string, any>;
  query: Record<string, any>;
  cookies: CookieGetter;
  headers: HeaderGetter;
}

type Http1BaseRequest = Modify<http.IncomingMessage, BaseRequest>;
type Http2BaseRequest = Modify<http2.Http2ServerRequest, BaseRequest>;

export interface Http1Request extends Http1BaseRequest {}
export interface Http2Request extends Http2BaseRequest {}
