const { describe, it } = require("node:test");
const assert = require("node:assert");
const { createRouter, HttpMethods } = require("../dist");

describe("Router testing", () => {
  it("createRouter should create a router", () => {
    const router = createRouter({
      prefix: "api",
    });
    assert.strictEqual(typeof router, "object");
    assert.strictEqual(router.prefix, "api");
    assert.strictEqual(router.onlyVersion, false);
    assert.strictEqual(router.version, undefined);
    assert.strictEqual(router.middlewares.length, 0);
    assert.strictEqual(router.middlewares.constructor.name, "Array");
    assert.strictEqual(router.routes.length, 0);
    assert.strictEqual(router.routes.constructor.name, "Array");
    assert.strictEqual(router.children.length, 0);
    assert.strictEqual(router.children.constructor.name, "Array");
    assert.strictEqual(router.makePath(), "api");
  });

  it("createRouter should create a router with version", () => {
    const router = createRouter({
      prefix: "api",
      version: 1,
    });
    assert.strictEqual(router.prefix, "api");
    assert.strictEqual(router.version, 1);
    assert.strictEqual(router.makePath(), "api/v1");
  });

  it("createRouter should create a router with onlyVersion", () => {
    const router = createRouter({
      prefix: "api",
      version: 1,
      onlyVersion: true,
    });
    assert.strictEqual(router.onlyVersion, true);
    assert.strictEqual(router.version, 1);
    assert.strictEqual(router.makePath(), "/v1");
  });

  it("createRouter should create a router with onlyVersion and version", () => {
    const router = createRouter({
      prefix: "api",
      onlyVersion: true,
    });
    assert.strictEqual(router.onlyVersion, true);
    assert.strictEqual(router.version, undefined);
    assert.strictEqual(router.makePath(), "/v1");
  });

  it("createRouter should create a router with middlewares", () => {
    const router = createRouter({
      prefix: "api",
      version: 1,
      onlyVersion: true,
      middlewares: [
        (req, res, next) => {
          next();
        },
      ],
    });
    assert.strictEqual(router.middlewares.length, 1);
  });

  it("createRouter should create a router with routes", () => {
    const router = createRouter({
      prefix: "api",
      version: 1,
      onlyVersion: true,
      routes: [
        {
          path: "/",
          methods: [HttpMethods.GET],
          isAll: false,
          middlewares: [],
          controller: (req, res) => {
            res.done();
          },
          makePath(prefix) {
            return prefix;
          },
        },
      ],
    });
    assert.strictEqual(router.routes.length, 1);
  });

  it("createRouter should create a router with children", () => {
    const router = createRouter({
      prefix: "test",
      version: 1,
      onlyVersion: true,
    });
    router.children.push(
      createRouter({
        prefix: "v2",
        version: 2,
        onlyVersion: true,
      })
    );
    assert.strictEqual(router.children.length, 1);
  });

  it("createRouter should create a router with children and routes", () => {
    const router = createRouter({
      prefix: "test",
      version: 1,
      onlyVersion: true,
    });
    router.children.push(
      createRouter({
        prefix: "v2",
        version: 2,
        onlyVersion: true,
        routes: [
          {
            path: "/",
            methods: [HttpMethods.GET],
            isAll: false,
            middlewares: [],
            controller: (req, res) => {
              res.done();
            },
            makePath(prefix) {
              return prefix;
            },
          },
        ],
      })
    );
    assert.strictEqual(router.routes.length, 0);
    assert.strictEqual(router.children.length, 1);
  });
});
