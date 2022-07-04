import { Middleware } from "../middleware/middleware";
import { Http1Request, Http2Request } from "../request/request";
import { Http1Response, Http2Response } from "../response/response";
import { Route } from "./route";
import { ErrorHandler, RequestHandler } from "../types/types";

export interface Router {
  prefix: string;
  onlyVersion: boolean;
  version?: number;
  middlewares: Middleware[];
  routes: Route[];
  children: Router[];
  get(path: string, handler: RequestHandler): this;
  get(path: string, middlewares: Middleware[], handler: RequestHandler): this;
  post(path: string, handler: RequestHandler): this;
  post(path: string, middlewares: Middleware[], handler: RequestHandler): this;
  put(path: string, handler: RequestHandler): this;
  put(path: string, middlewares: Middleware[], handler: RequestHandler): this;
  delete(path: string, handler: RequestHandler): this;
  delete(
    path: string,
    middlewares: Middleware[],
    handler: RequestHandler
  ): this;
  all(path: string, handler: RequestHandler): this;
  all(path: string, middlewares: Middleware[], handler: RequestHandler): this;
  head(path: string, handler: RequestHandler): this;
  head(path: string, middlewares: Middleware[], handler: RequestHandler): this;
  patch(path: string, handler: RequestHandler): this;
  patch(path: string, middlewares: Middleware[], handler: RequestHandler): this;
  options(path: string, handler: RequestHandler): this;
  options(
    path: string,
    middlewares: Middleware[],
    handler: RequestHandler
  ): this;
  makePath(prefix?: string): string;
  use(middleware: Middleware | Router | Route): void;
}

export interface MainRouter {
  handle(
    req: Http1Request | Http2Request,
    res: Http1Response | Http2Response,
    notFound: RequestHandler,
    errorHandler?: ErrorHandler
  ): void;
  use(...middlewares: Middleware[]): void;
}

export type CreateRouterParams = {
  prefix: string;
  onlyVersion?: boolean;
  version?: number;
  middlewares?: Middleware[];
  routes?: Route[];
};

export function isRouter(router: any): router is Router {
  return typeof router === "object" && router.prefix !== undefined;
}
