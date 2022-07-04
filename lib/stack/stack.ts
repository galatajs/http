import { Middleware } from "../middleware/middleware";
import { Router } from "../router/router";
import { Route } from "../router/route";

export interface HttpStack {
  fullPath: string;
  middlewares: Set<Middleware>;
  route?: Route;
  setRoute(route: Route, prefix: string): this;
  setMiddleware(middleware: Middleware): this;
  setMiddlewares(...middlewares: Middleware[]): this;
  setRouters(parent: Router | null, ...routers: Router[]): this;
  setRouter(router: Router, parent: Router | null): this;
}
