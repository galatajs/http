import { SecureServerOptions } from "node:http2";
import { App, OnStartedListener, warn } from "@galatajs/app";
import { HttpApplication } from "../app/http.application";
import { Middleware } from "../middleware/middleware";
import { createRouter, mainRouter } from "./router.hooks";
import {
  ErrorHandler,
  Http1App,
  Http2App,
  Http2SecureApp,
  RequestHandler,
} from "../types/types";
import { onServerStarted, ServerCreatedListener } from "../events/http.events";
import { useHttp1App } from "./http1.hooks";

const notFoundRoute: RequestHandler = (req, res, next) => {
  res.notFound(`Cannot ${req.method} ${req.url}`);
};

export const createHttpServer = (
  httpCreator: Http1App | Http2App | Http2SecureApp = useHttp1App(),
  options: SecureServerOptions = {}
): HttpApplication => {
  const showNotBuiltWarn = () => {
    warn("HTTP - Server is not built yet");
  };

  const router = createRouter({ prefix: "" });

  return {
    instance: undefined,
    config: {
      port: 3000,
      host: "127.0.0.1",
      globalPrefix: "/",
      notFoundRoute: notFoundRoute,
      errorHandler: undefined,
    },
    router: router,
    mainRouter: mainRouter,
    use(..._middlewares: Middleware[]): void {
      this.mainRouter.use(..._middlewares);
    },
    onServerStarted(hook: ServerCreatedListener) {
      onServerStarted.addListener(hook);
    },
    build() {
      const self = this;
      return {
        name: "http",
        version: "1.0.0",
        install(app: App): void {
          const middleware = app.store.inject(
            "galatajs:cors-http-middleware",
            true
          );
          if (middleware) {
            self.use(middleware);
          }
          const handler = (req, res) => {
            self.mainRouter.handle(
              req,
              res,
              self.config.notFoundRoute,
              self.config.errorHandler
            );
          };
          self.instance = httpCreator(handler, options);
          self.start();
        },
        onStarted(listener: OnStartedListener): void {
          const providers = new Map<string, any>();
          self.onServerStarted((server) => {
            providers.set("instance", server);
            listener(this, providers);
          });
        },
      };
    },
    start() {
      if (this.instance) {
        this.instance.listen(this.config.port, this.config.host, () => {
          onServerStarted.publish(this.instance!);
        });
      } else {
        showNotBuiltWarn();
      }
    },
    close() {
      if (this.instance && this.instance.listening) {
        this.instance.close();
      } else {
        showNotBuiltWarn();
      }
    },
    get prefix(): string {
      return this.config.globalPrefix;
    },
    get port(): number {
      return this.config.port;
    },
    get host(): string {
      return this.config.host;
    },
    get url(): string {
      return `http://${this.config.host}:${this.config.port}`;
    },
    set prefix(prefix: string) {
      this.config.globalPrefix = prefix;
    },
    set port(port: number) {
      this.config.port = port;
    },
    set host(host: string) {
      this.config.host = host;
    },
    set notFoundRoute(handler: RequestHandler) {
      this.config.notFoundRoute = handler;
    },
    set errorHandler(handler: ErrorHandler) {
      this.config.errorHandler = handler;
    },
  };
};
