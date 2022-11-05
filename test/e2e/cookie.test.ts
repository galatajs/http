import request from "supertest";
import { server } from "./app";

describe("http e2e cookie testing", () => {
  it("get cookie before adding", async () => {
    const response = await request(server.instance)
      .get("/e2e/cookie")
      .expect(200);
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).toBe("cookie");
  });

  it("set cookie", async () => {
    const response = await request(server.instance)
      .post("/e2e/cookie")
      .expect(200);
    expect(response.body.message).toBe("cookie");
  });

  it("get cookie after adding", async () => {
    const response = await request(server.instance)
      .get("/e2e/cookie")
      .expect(200);
    expect(response.body.message).toBe("cookie");
  });
});
