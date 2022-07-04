import { createRoute } from "../lib";

describe("Route testing", () => {
  it("createRoute should return a route", () => {
    const route = createRoute({
      path: "test",
      controller: (req, res, next) => {},
    });
    expect(route).toBeDefined();
    expect(route.path).toBe("test");
    expect(route.controller).toBeDefined();
  });

  it("createRoute with version and makePath", () => {
    const route = createRoute({
      path: "test",
      version: 1,
      controller: (req, res, next) => {},
    });
    expect(route).toBeDefined();
    expect(route.path).toBe("test");
    expect(route.version).toBe(1);
    expect(route.makePath("")).toBe("/v1/test");
  });

  it("createRoute with not used version and makePath", () => {
    const route = createRoute({
      path: "test",
      controller: (req, res, next) => {},
    });
    expect(route).toBeDefined();
    expect(route.path).toBe("test");
    expect(route.version).toBe(undefined);
    expect(route.makePath("")).toBe("/test");
  });
});
