import { SecureServerOptions } from "node:http2";
import { App, OnStartedListener, warn } from "@istanbul/app";
import { HttpApplication } from "../app/http.application";
import { Middleware } from "../middleware/middleware";
import { mainRouter } from "./router.hooks";
import {
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

  return {
    instance: undefined,
    config: {
      port: 3000,
      host: "127.0.0.1",
      globalPrefix: "/",
      notFoundRoute: notFoundRoute,
      errorHandler: undefined,
      serve: true,
    },
    router: mainRouter,
    use(..._middlewares: Middleware[]): void {
      this.router.use(..._middlewares);
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
            "istanbuljs:cors-http-middleware",
            true
          );
          if (middleware) {
            self.use(middleware);
          }
          const handler = (req, res) => {
            self.router.handle(
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
        if (this.config.serve) {
          this.instance.listen(this.config.port, this.config.host, () => {
            onServerStarted.publish(this.instance!);
          });
        } else {
          onServerStarted.publish(this.instance);
        }
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
  };
};
