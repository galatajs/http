import request from "supertest";
import { server } from "./app";

describe("http e2e stack testing", () => {
  it("hello world route testing", async () => {
    request(server.instance).get("/api/main").expect(200).expect("Hello world");
  });

  it("not found route testing", async () => {
    request(server.instance).get("/api/not-found").expect(404);
  });

  it("middleware testing positive", async () => {
    request(server.instance)
      .post("/test/main")
      .send({ name: "galata" })
      .expect(200)
      .expect("Hello world");
  });

  it("middleware testing negative", async () => {
    request(server.instance)
      .post("/test/main")
      .send({ name: "galata2" })
      .expect(400)
      .expect("name is not galata");
  });

  it("star route testing", () => {
    request(server.instance)
      .get("/api/main/test")
      .expect(200)
      .expect("Hello star");
  });

  it("star route with exist route testing", () => {
    request(server.instance).get("/api/main").expect(200).expect("Hello world");
  });
});
