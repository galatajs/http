"use-strict";
const assert = require("node:assert");
const test = require("node:test");
const { afterAll, beforeAll } = require("./app.js");

test("HTTP e2e Query Testing", { only: true }, async (t) => {
  let request;
  await t.test("beforeAll", async () => {
    request = await beforeAll(3002);
  });

  await t.test("http e2e query testing", async () => {
    const { data, res } = await request.get("/e2e/query?test=123");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.test, "123");
  });

  await t.test("afterAll", async () => {
    await afterAll();
  });
});
