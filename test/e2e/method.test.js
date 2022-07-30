"use-strict";
const assert = require("node:assert");
const test = require("node:test");
const { afterAll, beforeAll } = require("./app.js");

test("HTTP e2e Header Testing", { only: true }, async (t) => {
  let request;
  await t.test("beforeAll", async () => {
    request = await beforeAll(3006);
  });

  await t.test("http e2e method single testing", async () => {
    // 'single' route only has get listener in app
    const { data, res } = await request.get("/unique/single");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.message, "Single Listener");

    const { data: data2, res: res2 } = await request.post("/unique/single");
    assert.strictEqual(res2.status, 404);
    assert.strictEqual(typeof data2, "object");
    assert.strictEqual(data2.message, "Cannot POST /unique/single");
  });

  await t.test("afterAll", async () => {
    await afterAll();
  });
});
