import { CorePlugin, CorePluginCreator } from "@galatajs/app";
import { MainRouter } from "../router/router";
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
  router: MainRouter;
  build(): CorePlugin;
  use(...middlewares: Middleware[]): void;
  start(): void;
  close(): void;
  onServerStarted(hook: ServerCreatedListener): void;
}
