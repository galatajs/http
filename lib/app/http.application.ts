import { CorePlugin, CorePluginCreator } from "@galatajs/app";
import { MainRouter, Router } from "../router/router";
import { Middleware } from "../middleware/middleware";
import { ErrorHandler, RequestHandler, Server } from "../types/types";
import { ServerCreatedListener } from "../events/http.events";

export interface HttpConfig {
  globalPrefix: string;
  port: number;
  host: string;
  notFoundRoute: RequestHandler;
  errorHandler?: ErrorHandler;
}

export interface HttpApplication extends CorePluginCreator {
  instance?: Server;
  config: HttpConfig;
  mainRouter: MainRouter;
  router: Router;
  get prefix(): string;
  get port(): number;
  get host(): string;
  get url(): string;
  set prefix(prefix: string);
  set port(port: number);
  set host(host: string);
  set notFoundRoute(handler: RequestHandler);
  set errorHandler(handler: ErrorHandler);
  build(): CorePlugin;
  use(...middlewares: Middleware[]): void;
  start(): void;
  close(): void;
  onServerStarted(hook: ServerCreatedListener): void;
}
