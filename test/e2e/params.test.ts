import request from "supertest";
import { server } from "./app";

describe("http e2e params testing", () => {
  it("params testing", async () => {
    await request(server.instance)
      .get("/e2e/params/test/123")
      .expect(200)
      .expect({
        param1: "test",
        param2: "123",
      });
  });
});
