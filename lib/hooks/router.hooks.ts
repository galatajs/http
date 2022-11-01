import { isMiddleware, Middleware } from "../middleware/middleware";
import {
  CreateRouterParams,
  isRouter,
  MainRouter,
  Router,
} from "../router/router";
import { createStack } from "./stack.hooks";
import {
  ErrorHandler,
  HttpMethods,
  Request,
  RequestHandler,
  RequestHandlerRegistererParams,
  RequestHandlerRegistererSingleParams,
  Response,
} from "../types/types";
import { isRoute, Route } from "../router/route";
import { createRoute } from "./route.hooks";
import { transformHttpRouteParams } from "../request/request.transformer";
import { checkAndParse } from "../errors/error.parser";

const routers: Set<Router> = new Set<Router>();
const middlewares: Set<Middleware> = new Set<Middleware>();

export const mainRouter: MainRouter = {
  handle: (
    req: Request,
    res: Response,
    notFound: RequestHandler,
    errorHandler?: ErrorHandler
  ) => {
    const done = (result) => {
      res.done(result);
    };
    const next = (err?: any): any => {
      if (err) return done(checkAndParse(err));
      const { value: middleware, done: finished } = stack.middlewares
        .values()
        .next();
      try {
        if (finished && !middleware)
          return stack.route!.controller(req, res, next);
        stack.middlewares.delete(middleware);
        middleware(req, res, next);
      } catch (e) {
        if (errorHandler) errorHandler(e, req, res, next);
        else next(e);
        return;
      }
    };
    if (typeof req.url === "undefined") return notFound(req, res, next);
    const stack = createStack(req, [...middlewares], ...routers);
    req.params = transformHttpRouteParams(stack.fullPath, req);
    if (!stack.route) return notFound(req, res, next);
    next();
  },
  use(..._middlewares: Middleware[]): void {
    _middlewares.forEach((middleware) => {
      if (!middlewares.has(middleware)) {
        middlewares.add(middleware);
      }
    });
  },
};

export const createRouter = (
  params: CreateRouterParams = { prefix: "" }
): Router => {
  const router: Router = {
    prefix: params.prefix,
    onlyVersion: params.onlyVersion || false,
    version: params.version,
    middlewares: params.middlewares || [],
    routes: params.routes || [],
    children: [],
    makePath(prefix: string = "/"): string {
      const suffix = `/v${this.version || 1}`;
      prefix = prefix === "/" ? `${this.prefix}` : `${prefix}/${this.prefix}`;
      return this.onlyVersion
        ? suffix
        : !!this.version
        ? `${prefix}${suffix}`
        : `${prefix}`;
    },
    use(middleware: Middleware | Router | Route): void {
      if (isMiddleware(middleware)) {
        this.middlewares.push(middleware);
      } else if (isRouter(middleware)) {
        this.children.push(middleware);
      } else if (isRoute(middleware)) {
        this.routes.push(middleware);
      }
    },
    get(
      ...args:
        | RequestHandlerRegistererSingleParams
        | RequestHandlerRegistererParams
    ): Router {
      createMethodRouter(this, [HttpMethods.GET], false, ...args);
      return this;
    },
    post(
      ...args:
        | RequestHandlerRegistererParams
        | RequestHandlerRegistererSingleParams
    ): Router {
      createMethodRouter(this, [HttpMethods.POST], false, ...args);
      return this;
    },
    delete(
      ...args:
        | RequestHandlerRegistererParams
        | RequestHandlerRegistererSingleParams
    ): Router {
      createMethodRouter(this, [HttpMethods.DELETE], false, ...args);
      return this;
    },
    head(
      ...args:
        | RequestHandlerRegistererParams
        | RequestHandlerRegistererSingleParams
    ): Router {
      createMethodRouter(this, [HttpMethods.HEAD], false, ...args);
      return this;
    },
    put(
      ...args:
        | RequestHandlerRegistererParams
        | RequestHandlerRegistererSingleParams
    ): Router {
      createMethodRouter(this, [HttpMethods.PUT], false, ...args);
      return this;
    },
    patch(
      ...args:
        | RequestHandlerRegistererParams
        | RequestHandlerRegistererSingleParams
    ): Router {
      createMethodRouter(this, [HttpMethods.PATCH], false, ...args);
      return this;
    },
    options(
      ...args:
        | RequestHandlerRegistererParams
        | RequestHandlerRegistererSingleParams
    ): Router {
      createMethodRouter(this, [HttpMethods.OPTIONS], false, ...args);
      return this;
    },
    all(
      ...args:
        | RequestHandlerRegistererParams
        | RequestHandlerRegistererSingleParams
    ): Router {
      createMethodRouter(this, [], true, ...args);
      return this;
    },
  };
  routers.add(router);
  return router;
};

const createMethodRouter = (
  router: Router,
  methods: HttpMethods[],
  isAll: boolean = false,
  ...args: RequestHandlerRegistererParams | RequestHandlerRegistererSingleParams
): void => {
  if (args.length == 2) {
    args = [args[0], [], args[1]];
  }
  const [path, middlewares, handler] = args;
  const [prefix, version] = path.split("/v");
  router.routes.push(
    createRoute({
      methods: methods,
      isAll: isAll,
      path: prefix,
      version: !!version ? +version : undefined,
      middlewares: middlewares,
      controller: handler,
    })
  );
};
