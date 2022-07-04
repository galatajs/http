import { createRouter, HttpMethods } from "../lib";

describe("Router testing", () => {
  it("createRouter should create a router", () => {
    const router = createRouter({
      prefix: "api",
    });
    expect(router).toBeDefined();
    expect(router.prefix).toBe("api");
    expect(router.onlyVersion).toBe(false);
    expect(router.version).toBe(undefined);
    expect(router.middlewares).toEqual([]);
    expect(router.routes).toEqual([]);
    expect(router.children).toEqual([]);
    expect(router.makePath()).toBe("api");
  });

  it("createRouter should create a router with version", () => {
    const router = createRouter({
      prefix: "api",
      version: 1,
    });
    expect(router).toBeDefined();
    expect(router.prefix).toBe("api");
    expect(router.onlyVersion).toBe(false);
    expect(router.version).toBe(1);
    expect(router.middlewares).toEqual([]);
    expect(router.routes).toEqual([]);
    expect(router.children).toEqual([]);
    expect(router.makePath()).toBe("api/v1");
  });

  it("createRouter should create a router with onlyVersion", () => {
    const router = createRouter({
      prefix: "api",
      version: 1,
      onlyVersion: true,
    });
    expect(router).toBeDefined();
    expect(router.prefix).toBe("api");
    expect(router.onlyVersion).toBe(true);
    expect(router.version).toBe(1);
    expect(router.middlewares).toEqual([]);
    expect(router.routes).toEqual([]);
    expect(router.children).toEqual([]);
    expect(router.makePath()).toBe("/v1");
  });

  it("createRouter should create a router with onlyVersion and version", () => {
    const router = createRouter({
      prefix: "api",
      onlyVersion: true,
    });
    expect(router).toBeDefined();
    expect(router.prefix).toBe("api");
    expect(router.onlyVersion).toBe(true);
    expect(router.version).toBe(undefined);
    expect(router.middlewares).toEqual([]);
    expect(router.routes).toEqual([]);
    expect(router.children).toEqual([]);
    expect(router.makePath()).toBe("/v1");
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
    expect(router).toBeDefined();
    expect(router.prefix).toBe("api");
    expect(router.onlyVersion).toBe(true);
    expect(router.version).toBe(1);
    expect(router.middlewares).toBeDefined();
    expect(router.middlewares.length).toBe(1);
    expect(router.routes).toEqual([]);
    expect(router.children).toEqual([]);
    expect(router.makePath()).toBe("/v1");
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
          makePath(prefix: string): string {
            return prefix;
          },
        },
      ],
    });
    expect(router).toBeDefined();
    expect(router.prefix).toBe("api");
    expect(router.onlyVersion).toBe(true);
    expect(router.version).toBe(1);
    expect(router.middlewares).toEqual([]);
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBe(1);
    expect(router.children).toEqual([]);
    expect(router.makePath()).toBe("/v1");
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
    expect(router).toBeDefined();
    expect(router.prefix).toBe("test");
    expect(router.onlyVersion).toBe(true);
    expect(router.version).toBe(1);
    expect(router.middlewares).toEqual([]);
    expect(router.routes).toEqual([]);
    expect(router.children).toBeDefined();
    expect(router.children.length).toBe(1);
    expect(router.makePath()).toBe("/v1");
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
            makePath(prefix: string): string {
              return prefix;
            },
          },
        ],
      })
    );
    expect(router).toBeDefined();
    expect(router.prefix).toBe("test");
    expect(router.onlyVersion).toBe(true);
    expect(router.version).toBe(1);
    expect(router.middlewares).toEqual([]);
    expect(router.routes).toEqual([]);
    expect(router.children).toBeDefined();
    expect(router.children.length).toBe(1);
    expect(router.makePath()).toBe("/v1");
  });

  it("createRouter and add route to this router with get method", () => {
    const router = createRouter({
      prefix: "test",
      version: 1,
    });
    router.get("/", (req, res, next) => {
      res.done("asdsad");
    });
    router.get("/api", [], (req, res) => {});
    expect(router).toBeDefined();
    expect(router.prefix).toBe("test");
    expect(router.version).toBe(1);
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBe(2);
    expect(router.children.length).toEqual(0);
    expect(router.makePath()).toBe("test/v1");
  });

  it("createRouter and add route to this router with post method", () => {
    const router = createRouter({
      prefix: "test",
      version: 1,
    });
    router.post("/", (req, res, next) => {
      res.done("asdsad");
    });
    router.post("/api", [], (req, res) => {});
    expect(router).toBeDefined();
    expect(router.prefix).toBe("test");
    expect(router.version).toBe(1);
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBe(2);
    expect(router.children.length).toEqual(0);
    expect(router.makePath()).toBe("test/v1");
  });

  it("createRouter and add route to this router with put method", () => {
    const router = createRouter({
      prefix: "test",
      version: 1,
    });
    router.put("/", (req, res, next) => {
      res.done("asdsad");
    });
    router.put("/api", [], (req, res) => {});
    expect(router).toBeDefined();
    expect(router.prefix).toBe("test");
    expect(router.version).toBe(1);
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBe(2);
    expect(router.children.length).toEqual(0);
    expect(router.makePath()).toBe("test/v1");
  });

  it("createRouter and add route to this router with delete method", () => {
    const router = createRouter({
      prefix: "test",
      version: 1,
    });
    router.delete("/", (req, res, next) => {
      res.done("asdsad");
    });
    router.delete("/api", [], (req, res) => {});
    expect(router).toBeDefined();
    expect(router.prefix).toBe("test");
    expect(router.version).toBe(1);
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBe(2);
    expect(router.children.length).toEqual(0);
    expect(router.makePath()).toBe("test/v1");
  });

  it("createRouter and add route to this router with patch method", () => {
    const router = createRouter({
      prefix: "test",
      version: 1,
    });
    router.patch("/", (req, res, next) => {
      res.done("asdsad");
    });
    router.patch("/api", [], (req, res) => {});
    expect(router).toBeDefined();
    expect(router.prefix).toBe("test");
    expect(router.version).toBe(1);
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBe(2);
    expect(router.children.length).toEqual(0);
    expect(router.makePath()).toBe("test/v1");
  });

  it("createRouter and add route to this router with all method", () => {
    const router = createRouter({
      prefix: "test",
      version: 1,
    });
    router.all("/", (req, res, next) => {
      res.done("asdsad");
    });
    router.all("/api", [], (req, res) => {});
    expect(router).toBeDefined();
    expect(router.prefix).toBe("test");
    expect(router.version).toBe(1);
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBe(2);
    expect(router.children.length).toEqual(0);
    expect(router.makePath()).toBe("test/v1");
  });

  it("createRouter and add route to this router with head method", () => {
    const router = createRouter({
      prefix: "test",
      version: 1,
    });
    router.head("/", (req, res, next) => {
      res.done("asdsad");
    });
    router.head("/api", [], (req, res) => {});
    expect(router).toBeDefined();
    expect(router.prefix).toBe("test");
    expect(router.version).toBe(1);
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBe(2);
    expect(router.children.length).toEqual(0);
    expect(router.makePath()).toBe("test/v1");
  });

  it("createRouter and add route to this router with options method", () => {
    const router = createRouter({
      prefix: "test",
      version: 1,
    });
    router.options("/", (req, res, next) => {
      res.done("asdsad");
    });
    router.options("/api", [], (req, res) => {});
    expect(router).toBeDefined();
    expect(router.prefix).toBe("test");
    expect(router.version).toBe(1);
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBe(2);
    expect(router.children.length).toEqual(0);
    expect(router.makePath()).toBe("test/v1");
  });
});
