import { createHttp2App, createSecureHttp2App } from "../../lib";

describe("HTTP/2 and HTTPS testing", () => {
  it("createHttp2App should create an http2 app", () => {
    expect(createHttp2App).toBeInstanceOf(Function);
  });

  it("createHttp2App should return a http2.Http2Server", () => {
    const app = createHttp2App(() => {});
    expect(app).toHaveProperty("listen");
    expect(app).toHaveProperty("close");
  });

  it("createHttp2App should return a http2.Http2Server that listens on port 8080", () => {
    const app = createHttp2App(() => {});
    app.listen(8080);
    const address = app.address() as any;
    expect(address.port).toBe(8080);
    app.close();
  });

  it("createSecureHttp2App should create an http2 secure app", () => {
    expect(createSecureHttp2App).toBeInstanceOf(Function);
  });

  it("createSecureHttp2App should return a http2.Http2SecureServer", () => {
    const app = createSecureHttp2App(() => {}, {});
    expect(app).toHaveProperty("listen");
    expect(app).toHaveProperty("close");
  });

  it("createSecureHttp2App should return a http2.Http2SecureServer that listens on port 8080", () => {
    const app = createSecureHttp2App(() => {}, {});
    app.listen(8080);
    const address = app.address() as any;
    expect(address.port).toBe(8080);
    app.close();
  });
});
