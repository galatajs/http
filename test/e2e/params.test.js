"use-strict";
const assert = require("node:assert");
const test = require("node:test");
const { afterAll, beforeAll } = require("./app.js");

test("HTTP e2e Params Testing", { only: true }, async (t) => {
  let request;
  await t.test("beforeAll", async () => {
    request = await beforeAll(3000);
  });

  await t.test("http e2e params testing", async () => {
    const { data, res } = await request.get("/e2e/params/test/123");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.param1, "test");
    assert.strictEqual(data.param2, "123");
  });

  await t.test("afterAll", async () => {
    await afterAll();
  });
});
