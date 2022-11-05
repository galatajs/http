import { createHttpServer } from "../../lib";

describe("HTTP instance testing", () => {
  it("createHttpServer should be a function", () => {
    expect(createHttpServer).toBeInstanceOf(Function);
  });

  it("createHttpServer should return a http.Server", () => {
    const app = createHttpServer();
    expect(app).toHaveProperty("instance");
    expect(app).toHaveProperty("config");
    expect(app).toHaveProperty("router");
    expect(app).toHaveProperty("use");
    expect(app).toHaveProperty("onServerStarted");
    expect(app).toHaveProperty("build");
    expect(app).toHaveProperty("start");
    expect(app).toHaveProperty("close");
  });

  it("createHttpServer set port function should set port", () => {
    const server = createHttpServer();
    server.port = 8080;
    expect(server.port).toBe(8080);
  });

  it("createHttpServer set host function should set host", () => {
    const server = createHttpServer();
    server.host = "localhost";
    expect(server.host).toBe("localhost");
  });

  it("createHttpServer set prefix function should set prefix", () => {
    const server = createHttpServer();
    server.prefix = "/api";
    expect(server.prefix).toBe("/api");
  });

  it("createHttpServer set notFoundRoute function should set notFoundRoute", () => {
    const server = createHttpServer();
    server.notFoundRoute = () => {};
    expect(server.config.notFoundRoute).toBeInstanceOf(Function);
  });

  it("createHttpServer set errorHandler function should set errorHandler", () => {
    const server = createHttpServer();
    server.errorHandler = () => {};
    expect(server.config.errorHandler).toBeInstanceOf(Function);
  });
});
