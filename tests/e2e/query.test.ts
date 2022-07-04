// @ts-ignore
import request from "supertest";
import { server } from "./app";

describe("http e2e query testing", () => {
  it("query testing", async () => {
    await request(server.instance)
      .get("/e2e/query?test=123")
      .expect(200)
      .expect({
        test: "123",
      });
  });
});
