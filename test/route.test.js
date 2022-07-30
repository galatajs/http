const { describe, it } = require("node:test");
const assert = require("node:assert");
const { createRoute } = require("../dist");

describe("Route testing", () => {
  it("createRoute should return a route", () => {
    const route = createRoute({
      path: "test",
      controller: (req, res, next) => {},
    });
    assert.strictEqual(typeof route, "object");
    assert.strictEqual(route.path, "test");
    assert.strictEqual(typeof route.controller, "function");
  });

  it("createRoute with version and makePath", () => {
    const route = createRoute({
      path: "test",
      version: 1,
      controller: (req, res, next) => {},
    });
    assert.strictEqual(route.path, "test");
    assert.strictEqual(route.version, 1);
    assert.strictEqual(route.makePath(""), "/v1/test");
  });

  it("createRoute with not used version and makePath", () => {
    const route = createRoute({
      path: "test",
      controller: (req, res, next) => {},
    });
    assert.strictEqual(route.path, "test");
    assert.strictEqual(route.version, undefined);
    assert.strictEqual(route.makePath(""), "/test");
  });
});
