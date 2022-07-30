const { describe, it } = require("node:test");
const assert = require("node:assert");
const { createHttp2App, createSecureHttp2App } = require("../dist");

describe("HTTP/2 and HTTPS testing", () => {
  it("createHttp2App should create an http2 app", () => {
    assert.strictEqual(typeof createHttp2App, "function");
  });

  it("createHttp2App should return a http2.Http2Server", () => {
    const app = createHttp2App(() => {});
    assert.strictEqual("listen" in app, true);
    assert.strictEqual("close" in app, true);
  });

  it("createHttp2App should return a http2.Http2Server that listens on port 8080", () => {
    const app = createHttp2App(() => {});
    app.listen(8080);
    const address = app.address();
    assert.strictEqual(address.port, 8080);
    app.close();
  });

  it("createSecureHttp2App should create an http2 secure app", () => {
    assert.strictEqual(typeof createSecureHttp2App, "function");
  });

  it("createSecureHttp2App should return a http2.Http2SecureServer", () => {
    const app = createSecureHttp2App(() => {}, {});
    assert.strictEqual("listen" in app, true);
    assert.strictEqual("close" in app, true);
  });

  it("createSecureHttp2App should return a http2.Http2SecureServer that listens on port 8080", () => {
    const app = createSecureHttp2App(() => {}, {});
    app.listen(8080);
    const address = app.address();
    assert.strictEqual(address.port, 8080);
    app.close();
  });
});
