import { createHttp1App } from "../lib";
import * as http from "node:http";

describe("HTTP/1 testing", () => {
  it("createHttp1App should be a function", () => {
    expect(createHttp1App).toBeInstanceOf(Function);
  });

  it("createHttp1App should return a http.Server", () => {
    const app = createHttp1App(() => {});
    expect(app).toBeInstanceOf(http.Server);
    expect(app).toHaveProperty("listen");
    expect(app).toHaveProperty("close");
  });

  it("createHttp1App should return a http.Server that listens on port 8080", () => {
    const app = createHttp1App(() => {});
    app.listen(8080);
    const address = app.address() as any;
    expect(address.port).toBe(8080);
    app.close();
  });
});
