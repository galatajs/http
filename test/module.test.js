const assert = require("node:assert");
const test = require("node:test");
const http = require("node:http");
const { createApp } = require("@istanbul/app");
const { createHttpServer } = require("../dist");

test("Http Module Testing", async (t) => {
  await t.test(
    "use createHttpServer func and register onServerStarted hook",
    () => {
      const app = createApp();
      const server = createHttpServer();
      server.config.port = 8001;
      server.onServerStarted(() => {
        server.close();
      });
      app.register(server);
      app.start();
    }
  );

  await t.test(
    "use createHttpServer and register onStarted hook in external core module",
    () => {
      const coreModule = {
        name: "module2",
        version: "0.0.1",
        install(app, coreModules) {
          const httpModule = coreModules.get("http");
          httpModule.onStarted((httpModule, providers) => {
            const instance = providers.get("instance");
            assert.strictEqual(instance instanceof http.Server, true);
            instance.close();
          });
        },
      };
      const app = createApp();
      const server = createHttpServer();
      server.config.port = 8002;
      app.register(coreModule);
      app.register(server);
      app.start();
    }
  );
});
