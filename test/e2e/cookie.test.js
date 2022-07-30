"use-strict";
const assert = require("node:assert");
const test = require("node:test");
const { afterAll, beforeAll } = require("./app.js");

test("HTTP e2e Cookie Testing", { only: true }, async (t) => {
  let request;
  await t.test("beforeAll", async () => {
    request = await beforeAll(3005);
  });

  await t.test("http e2e get cookie before adding", async () => {
    const { data, res } = await request.get("/e2e/cookie");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.message, "cookie");
    assert.strictEqual(res.headers.get("set-cookie"), null);
  });

  await t.test("http e2e set cookie", async () => {
    const { data, res } = await request.post("/e2e/cookie");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.message, "ok");
    assert.strictEqual(res.headers.get("set-cookie"), "test=test; HttpOnly");
  });

  await t.test("afterAll", async () => {
    await afterAll();
  });
});
