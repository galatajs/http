const { describe, it } = require("node:test");
const assert = require("node:assert");
const { createHttp1App } = require("../dist");

describe("HTTP/1 Testing", () => {
  it("createHttp1App should be a function", () => {
    assert.strictEqual(typeof createHttp1App, "function");
  });

  it("createHttp1App should return a http.Server", () => {
    const app = createHttp1App(() => {});
    assert.strictEqual(app instanceof require("node:http").Server, true);
    assert.notStrictEqual(app["listen"], undefined);
    assert.notStrictEqual(app["close"], undefined);
  });

  it("createHttp1App should return a http.Server that listens on port 8080", () => {
    const app = createHttp1App(() => {});
    app.listen(8080);
    const address = app.address();
    assert.strictEqual(address.port, 8080);
    app.close();
  });
});
