"use-strict";
const assert = require("node:assert");
const test = require("node:test");
const { afterAll, beforeAll } = require("./app.js");

test("HTTP e2e Stack Testing", { only: true }, async (t) => {
  let request;
  await t.test("beforeAll", async () => {
    request = await beforeAll(3001);
  });

  await t.test("hello world route testing", async () => {
    const { data, res } = await request.get("/api/main");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.message, "Hello world");
    assert.strictEqual(data.success, true);
  });

  await t.test("not found route testing", async () => {
    const { data, res } = await request.post("/api/not-found");
    assert.strictEqual(res.status, 404);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.message, "Cannot POST /api/not-found");
    assert.strictEqual(data.success, false);
  });

  await t.test("middleware positive testing", async () => {
    const { data, res } = await request.post("/test/main", {
      name: "galatajs",
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.message, "Hello world");
    assert.strictEqual(data.success, true);
  });

  await t.test("middleware negative testing", async () => {
    const { data, res } = await request.post("/test/main", {
      name: "galatajs2",
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.message, "name is not galatajs");
    assert.strictEqual(data.success, false);
  });

  await t.test("star route testing", async () => {
    const { data, res } = await request.get("/e2e/main2");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.message, "Hello star");
    assert.strictEqual(data.success, true);
  });

  await t.test("star route with exist route testing", async () => {
    const { data, res } = await request.get("/api/main");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.message, "Hello world");
    assert.strictEqual(data.success, true);
  });

  await t.test("afterAll", async () => {
    await afterAll();
  });
});
