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

export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  REQUEST_ENTITY_TOO_LARGE = 413,
  REQUEST_URI_TOO_LONG = 414,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}

export type Getter<T> = {
  get(key: string): T;
};

export type Setter<T, O = any> = {
  set(key: string, value: T, options?: O): void;
};

export type Modify<T, R> = Omit<T, keyof R> & R;
