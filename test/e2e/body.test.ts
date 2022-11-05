import request from "supertest";
import { server } from "./app";

describe("http e2e body testing", () => {
  it("application/json testing", async () => {
    await request(server.instance)
      .post("/e2e/body")
      .set("Content-Type", "application/json")
      .send({
        name: "galata",
      })
      .expect(200)
      .expect({
        name: "galata",
      });
  });

  it("application/x-www-form-urlencoded testing", async () => {
    await request(server.instance)
      .post("/e2e/body")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("name=galata")
      .expect(200)
      .expect({
        name: "galata",
      });
  });
});
