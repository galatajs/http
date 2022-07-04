// @ts-ignore
import request from "supertest";
import { server } from "./app";

describe("http e2e header testing", () => {
  it("get header before adding", async () => {
    const response = await request(server.instance)
      .get("/e2e/header")
      .expect(200);
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).toBe("header");
  });

  it("set header", async () => {
    const response = await request(server.instance)
      .post("/e2e/header")
      .expect(200);
    expect(response.body.message).toBe("header");
  });

  it("get header after adding", async () => {
    const response = await request(server.instance)
      .get("/e2e/header")
      .expect(200);
    expect(response.body.message).toBe("header");
  });
});
