import request from "supertest";
import { server } from "./app";

describe("http e2e middleware testing", () => {
  it("middleware/main route testing", async () => {
    request(server.instance)
      .get("/middleware/main")
      .expect(200)
      .expect("Hello world, from main");
  });

  it("middleware/child route testing", async () => {
    request(server.instance)
      .get("/middleware/child")
      .expect(200)
      .expect("Hello world");
  });

  it("middleware/test route should return not found", async () => {
    request(server.instance).get("/middleware/test").expect(404);
  });
});
