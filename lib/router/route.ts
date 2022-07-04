import { Middleware } from "../middleware/middleware";
import { HttpMethods, RequestHandler } from "../types/types";

export interface Route {
  methods: HttpMethods[];
  isAll: boolean;
  path: string;
  version?: number;
  makePath(prefix: string): string;
  middlewares: Middleware[];
  controller: RequestHandler;
}

export type CreateRouteParams = {
  methods?: HttpMethods[];
  isAll?: boolean;
  path: string;
  version?: number;
  middlewares?: Middleware[];
  controller: RequestHandler;
};

export function isRoute(route: any): route is Route {
  return typeof route === "object" && route.path !== undefined;
}
