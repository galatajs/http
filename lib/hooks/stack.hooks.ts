import { HttpStack } from "../stack/stack";
import { Middleware } from "../middleware/middleware";
import { Router } from "../router/router";
import { Http1Request, Http2Request } from "../request/request";
import { HttpMethods } from "../types/types";
import { Route } from "../router/route";

export const createStack = (
  req: Http1Request | Http2Request,
  middlewares: Middleware[],
  ...routers: Router[]
): HttpStack => {
  const stack: HttpStack = {
    fullPath: "",
    middlewares: new Set<Middleware>(),
    route: undefined,
    setMiddleware(middleware: Middleware) {
      if (!this.middlewares.has(middleware)) {
        this.middlewares.add(middleware);
      }
      return this;
    },
    setMiddlewares(...middlewares: Middleware[]) {
      middlewares.forEach((middleware) => {
        this.setMiddleware(middleware);
      });
      return this;
    },
    setRoute(route: Route, prefix: string): HttpStack {
      const path = route.makePath(prefix);
      if (
        (route.isAll || route.methods.includes(req.method as HttpMethods)) &&
        (req.url === path || route.path.includes(":")) &&
        req.url!.includes(prefix) &&
        req.url!.split("/").length === path.split("/").length
      ) {
        route.middlewares.forEach((middleware) => {
          this.setMiddleware(middleware);
        });
        this.route = route;
        this.fullPath = path;
      }
      return this;
    },
    setRouter(router: Router, parent: Router | null): HttpStack {
      this.setMiddlewares(...router.middlewares);
      this.setRouters(router, ...router.children);
      if (!!this.route) return this;
      router.routes.forEach((route) => {
        if (!this.route) {
          let prefix = !!parent ? parent.makePath() : "/";
          this.setRoute(route, router.makePath(prefix));
        }
      });
      return this;
    },
    setRouters(parent: null | Router = null, ...routers: Router[]): HttpStack {
      routers.forEach((router) => {
        if (req.url!.includes(router.prefix)) {
          this.setRouter(router, parent);
        }
      });
      return this;
    },
  };
  stack.setMiddlewares(...middlewares);
  stack.setRouters(null, ...routers);
  return stack;
};
