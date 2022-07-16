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
import { SecureServerOptions } from "http2";
import { useHttp1App } from "./http1.hooks";

const notFoundRoute: RequestHandler = (req, res, next) => {
  res.notFound(`Cannot ${req.method} ${req.url}`);
};

export const createHttpServer = (
  httpCreator: Http1App | Http2App | Http2SecureApp = useHttp1App(),
  options: SecureServerOptions = {}
): HttpApplication => {
  return {
    instance: undefined,
    config: {
      port: 3000,
      host: "127.0.0.1",
      globalPrefix: "/",
      notFoundRoute: notFoundRoute,
      errorHandler: undefined,
    },
    router: mainRouter,
    use(..._middlewares: Middleware[]): void {
      this.router.use(..._middlewares);
    },
    onServerStarted(hook: ServerCreatedListener) {
      onServerStarted.addListener(hook);
    },
    build() {
      return {
        name: "http",
        version: "1.0.0",
        install: () => {
          const handler = (req, res) => {
            this.router.handle(
              req,
              res,
              this.config.notFoundRoute,
              this.config.errorHandler
            );
          };
          this.instance = httpCreator(handler, options);
          this.start();
        },
      };
    },
    start() {
      if (this.instance) {
        this.instance.listen(this.config.port, this.config.host);
        onServerStarted.publish(this.instance);
      } else {
        throw new Error("Server is not built yet");
      }
    },
  };
};
