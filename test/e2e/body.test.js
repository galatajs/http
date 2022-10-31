"use-strict";
const assert = require("node:assert");
const test = require("node:test");
const { afterAll, beforeAll } = require("./app.js");

test("HTTP e2e Body Testing", { only: true }, async (t) => {
  let request;
  await t.test("beforeAll", async () => {
    request = await beforeAll(3003);
  });

  await t.test("http e2e body application/json testing", async () => {
    const { data, res } = await request.post("/e2e/body", { name: "galatajs" });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof data, "object");
    assert.strictEqual(data.name, "galatajs");
  });

  await t.test(
    "http e2e body application/x-www-form-urlencoded testing",
    async () => {
      const { data, res } = await request.post("/e2e/body", "name=galatajs", {
        contentType: "application/x-www-form-urlencoded",
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(typeof data, "object");
      assert.strictEqual(data.name, "galatajs");
    }
  );

  await t.test("afterAll", async () => {
    await afterAll();
  });
});
