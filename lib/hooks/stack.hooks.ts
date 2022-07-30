import { HttpStack } from "../stack/stack";
import { Middleware } from "../middleware/middleware";
import { Router } from "../router/router";
import { Http1Request, Http2Request } from "../request/request";
import { Route } from "../router/route";
import { checkRoute } from "../rules/stack.rules";

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
      if (checkRoute({ route, prefix, req, path })) {
        route.middlewares.forEach((middleware) => {
          this.setMiddleware(middleware);
        });
        this.route = route;
        this.fullPath = path;
      }
      return this;
    },
    setRouter(router: Router, parent: Router | null): HttpStack {
      if (!!this.route) return this;
      router.routes.forEach((route) => {
        if (!this.route) {
          let prefix = !!parent ? parent.makePath() : "/";
          this.setRoute(route, router.makePath(prefix));
        }
      });
      if (!!this.route) {
        this.setMiddlewares(...router.middlewares);
        this.setRouters(router, ...router.children);
      }
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
