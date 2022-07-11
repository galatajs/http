import { Http1Request, Http2Request } from "../request/request";
import { Http1Response, Http2Response } from "../response/response";
import http from "http";
import http2, { SecureServerOptions } from "http2";
import { Middleware } from "../middleware/middleware";

export type NextFunction = (err?: any) => any;
export type Server = http.Server | http2.Http2Server;
export type Request = Http1Request | Http2Request;
export type Response = Http1Response | Http2Response;
export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;
export type ErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
}
export type Http2App = (
  handle: (req: Http2Request, res: Http2Response) => any
) => http2.Http2Server;
export type Http2SecureApp = (
  handle: (req: Http2Request, res: Http2Response) => any,
  options: SecureServerOptions
) => http2.Http2SecureServer;
export type Http1App = (
  handle: (req: Http1Request, res: Http1Response) => any
) => http.Server;
export type RequestHandlerRegistererParams = [
  string,
  Middleware[],
  RequestHandler
];
export type RequestHandlerRegistererSingleParams = [string, RequestHandler];

export type Getter<T> = {
  get(key: string): T;
};

export type Setter<T, O = any> = {
  set(key: string, value: T, options?: O): void;
};

export type Modify<T, R> = Omit<T, keyof R> & R;
