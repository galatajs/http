"use-strict";
const assert = require("node:assert");
const test = require("node:test");
const { afterAll, beforeAll } = require("./app.js");

test("HTTP e2e Header Testing", { only: true }, async (t) => {
  let request;
  await t.test("beforeAll", async () => {
    request = await beforeAll(3004);
  });

  await t.test("http e2e get header before adding", async () => {
    const { data, res } = await request.get("/e2e/header");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.message, "header");
    assert.strictEqual(res.headers.get("test"), null);
  });

  await t.test("http e2e set header", async () => {
    const { data, res } = await request.post("/e2e/header");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.message, "ok");
    assert.strictEqual(res.headers.get("test"), "test");
  });

  await t.test("afterAll", async () => {
    await afterAll();
  });
});
