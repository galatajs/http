import { createApp } from "@galatajs/app";
import { createHttpServer, createRoute, createRouter } from "../../lib";

const app = createApp();

const server = createHttpServer();

app.register(server.build());

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
  if (req.body.name !== "galata")
    return res.status(400).error("name is not galata");
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
});

const middlewareRouter = createRouter({
  prefix: "middleware",
});
middlewareRouter.use((req, res, next) => {
  req.data = "global";
  next();
});

const guard = (req, res, next) => {
  if (req.data === "global") {
    next();
  } else {
    res.error("not global");
  }
};

const childRouter = createRouter({
  prefix: "child",
});
middlewareRouter.use(childRouter);
childRouter.use((req, res, next) => {
  res.success("Hello world");
});
childRouter.get("test", (req, res) => {
  res.success("Hello worlddddd");
});

middlewareRouter.get("main", [guard], (req, res) => {
  res.success("Hello world, from main");
});

server.use(m1, m2);

app.start();

export { app, server };
