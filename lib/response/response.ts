import http from "http";
import http2 from "http2";
import { CookieSetter } from "../cookie/cookie";
import { HeaderSetter } from "../header/header";
import { Remover } from "../types/types";

export interface BaseResponse {
  status(status: number): void;
  success(message: string): void;
  error(message: string, code?: number): void;
  successData<T>(message: string, data: T): void;
  errorData<T>(message: string, data: T, code?: number): void;
  notFound(message: string): void;
  badRequest(message: string): void;
  serverError(message: string): void;
  send<T>(data?: T): void;
  done<T>(data?: T): void;
  cookie: CookieSetter;
  header: HeaderSetter & Remover;
}

export interface Http1Response extends http.ServerResponse, BaseResponse {}

export interface Http2Response
  extends http2.Http2ServerResponse,
    BaseResponse {}
