const { createApp } = require("@istanbul/app");
const { createHttpServer, createRoute, createRouter } = require("../../dist");
const Request = require("./request");

const app = createApp();
const server = createHttpServer();
server.config.host = "127.0.0.1";
app.register(server);

const mainRoute = createRoute({
  path: "main",
  controller: (req, res, next) => {
    res.success("Hello world");
  },
});

createRouter({
  prefix: "api",
  routes: [mainRoute],
});

const m1 = (req, res, next) => {
  next();
};

const m2 = (req, res, next) => {
  next();
};

const m3 = (req, res, next) => {
  if (req.body.name !== "istanbul")
    return res.status(400).error("name is not istanbul");
  next();
};

const router = createRouter({
  prefix: "e2e",
});

router.get("query", (req, res) => {
  res.done(req.query);
});

router.get("params/:param1/:param2", (req, res) => {
  res.done(req.params);
});

router.post("body", (req, res) => {
  res.done(req.body);
});

router.get("cookie", (req, res) => {
  const cookie = req.cookie.get("test");
  res.successData("cookie", cookie);
});

router.post("cookie", (req, res) => {
  res.cookie.set("test", "test");
  res.success("ok");
});

router.get("header", (req, res) => {
  res.successData("header", req.header.get("test"));
});

router.post("header", (req, res) => {
  res.header.set("test", "test");
  res.success("ok");
});

router.all("*", (req, res) => {
  res.success("Hello star");
});

createRouter({
  prefix: "test",
  routes: [mainRoute],
  middlewares: [m3],
});

const routerUnique = createRouter({
  prefix: "unique",
});
routerUnique.get("single", (req, res) => {
  res.success("Single Listener");
});

server.use(m1, m2);

let request;

const tryConnection = async () => {
  try {
    await app.start();
  } catch (e) {
    if (e.code === "EADDRINUSE") {
      tryConnection();
    }
  }
};

beforeAll = async (port) => {
  if (server.instance && server.instance.listening) return request;
  server.config.port = port;
  return new Promise((resolve, reject) => {
    server.onServerStarted(() => {
      const port = server.instance.address().port;
      const baseUrl = `http://127.0.0.1:${port}`;
      request = new Request(baseUrl);
      resolve(request);
    });
    tryConnection();
  });
};

afterAll = async () => {
  server.instance.close();
};

module.exports = {
  beforeAll,
  afterAll,
};
