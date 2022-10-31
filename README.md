<p align="center">
<br>
<img src="https://avatars.githubusercontent.com/u/108695351?s=200&v=4" width="128" height="128">
</p>
<h3 align="center">@galatajs/http</h3>
<p align="center">
  HTTP package of <code>galatajs</code> framework. 
</p>

### What Is It?

This package is the main http package of the ``galatajs`` framework.

Features:
- ``HTTP/1.1``, ``HTTP/1.2`` and ``HTTPS`` (all versions NodeJS supports nowadays) are supported by this package.
- It has its own router and middleware structure.
- It contains many built-in supported functions (``res.success``, ``res.notFound``, ``req.ip`` etc.)
- Extends NodeJS's ``http`` types, so they are overwritable.
- It has its own (overwritable) ``notFound`` and ``errorHandler`` mechanism.
- It uses the latest JavaScript syntax and compiles them with TypeScript, you can write in any language (TypeScript, Module JavaScript or Common JavaScript) without worrying about version compatibility. 
- It's writable the way you're used to from Fastify and Express.
- Fully tested, reliable.

### Installation

Note: This package is 1st degree dependent on ``galatajs`` to work. Please take a look at [`@galatajs/app`](https://www.npmjs.com/package/@galatajs/app) first if you haven't. 

```sh
npm install @galatajs/http
```

> or with yarn
>
> ```sh
> yarn add @galatajs/http
> ```

### Basic Usage

```typescript
import {createApp, App} from '@galatajs/app';
import {createHttpServer, createRouter, createRoute, Request, Response, NextFunction} from "@galatajs/http";

const app = createApp<App>();
const server = createHttpServer();

const router = createRouter({prefix: 'api'});
router.get('somePath', (req: Request, res: Response, next: NextFunction) => {
  res.success('Hello World!');
});

app.register(server.build());
app.start();
```

### Usage With Middleware

Middlewares can be used in 3 different ways.

#### In the ``route`` scope.

```typescript
import {createApp} from "@galatajs/app";
import {createHttpServer, createRouter, createRoute, Request, Response, NextFunction} from "@galatajs/http";

const app = createApp<App>();
const server = createHttpServer();
app.register(server.build());

const router = createRouter({prefix: 'product'});

const checkProductId = (req: Request, res: Response, next: NextFunction) => {
  if (!!req.params.productId) return next();
  res.notFound("Product ID is required");
}

router.get(":productId", checkProductId, (req: Request, res: Response, next: NextFunction) => {
  res.success("Product found");
});

app.start();

```

#### In the ``router`` scope.


```typescript
import {createApp} from "@galatajs/app";
import {createHttpServer, createRouter, createRoute, Request, Response, NextFunction} from "@galatajs/http";

const app = createApp<App>();
const server = createHttpServer();
app.register(server.build());

const router = createRouter({prefix: 'product'});

const checkProductId = (req: Request, res: Response, next: NextFunction) => {
  if (!!req.params.productId) return next();
  res.notFound("Product ID is required");
}

router.get(":productId", (req: Request, res: Response, next: NextFunction) => {
  res.success("Product found");
});

router.use(checkProductId);

app.start();

```

#### In the ``global`` scope.

```typescript
import {createApp} from "@galatajs/app";
import {createHttpServer, createRouter, createRoute, Request, Response, NextFunction} from "@galatajs/http";

const app = createApp<App>();
const server = createHttpServer();
app.register(server.build());

const router = createRouter({ prefix: 'product' });

const checkProductId = (req: Request, res: Response, next: NextFunction) => {
  if (!!req.params.productId) return next();
  res.notFound("Product ID is required");
}

// http://localhost:3000/product/123
router.get(":productId", (req: Request, res: Response, next: NextFunction) => {
  res.success("Product found");
});

server.use(checkProductId);

app.start();
```

### Use Versioned Routes

```typescript
import {createApp} from "@galatajs/app";
import {createHttpServer, createRouter, createRoute, Request, Response, NextFunction} from "@galatajs/http";

const app = createApp<App>();
const server = createHttpServer();
app.register(server.build());

const router = createRouter({ prefix: 'product', version: 2 });

const checkProductId = (req: Request, res: Response, next: NextFunction) => {
  if (!!req.params.productId) return next();
  res.notFound("Product ID is required");
}

// http://localhost:3000/product/v2/123
router.get(":productId", (req: Request, res: Response, next: NextFunction) => {
  res.success("Product found");
});

server.use(checkProductId);

app.start();
```

### Handle Request Ip Address

This package adds the request's ip address to the request object by default.

```typescript
const handler = (req, res, next) => {
    res.success('Your ip: ' + req.ip);
}
```

### Handle Request Body

This package parses JSON and Url-Encoded the request body by default.

```typescript
const handler = (req, res, next) => {
    res.success(req.body);
}
```

### Handle Request Query

This package parse the request query by default.

```typescript
const handler = (req, res, next) => {
    res.success(req.query);
}
```

### Handle Request Params

This package parse the request params by default.

```typescript
router.post(":id", (req, res, next) => {
    res.success(req.params); // { id: '123' }
})
```

### Handle Request Headers

You can select request headers in a friendly way through this package.

```typescript
router.get("header", (req, res, next) => {
    const token = req.headers.get("token");
    // do something with token
})

router.post("header", (req, res, next) => {
    const token = "" // some encrypt process
    req.headers.set("token", token);
})
```

### Handle Request Cookies

You can select request cookies in a friendly way through this package. 
All cookie options are available. And by default ``httpOnly`` is ``true``. Everything is for your safety!

Options

```typescript
export type CookieOptions = {
    httpOnly?: boolean; // default true
    secure?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: "strict" | "lax";
    domain?: string;
};
```

Examples

```typescript
router.get("cookie", (req, res, next) => {
    const token = req.cookies.get("token");
    // do something with token
})

// not optioned
router.post("cookies", (req, res, next) => {
    const token = "" // some encrypt process
    req.cookies.set("token", token);
})

// with options
router.post("cookies", (req, res, next) => {
    const token = "" // some encrypt process
    req.cookies.set("token", token, {
        httpOnly: false,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        domain: "localhost",
        path: "/",
        sameSite: "strict"
    });
})
```


## Options

This package has some crushable settings

### Change Port

This package uses port ``3000`` by default. You can crush it.

```typescript
server.config.port = 8080;
app.start();
```

### Change Host

This package uses host ``127.0.0.1`` by default. You can crush it.

```typescript
server.config.host = "localhost";
app.start();
```

### Change Global Prefix

This package has its own ``main router``. And this router uses the ``/`` prefix by default. All routes in your app depend on this prefix and you can override it if you want.

```typescript
server.config.globalPrefix = "/api";
app.start();
```

### Change Not Found Handler

This package has a ``notFoundHandler`` that returns results as follows by default. You can change this.

result:

```json
{
    "success": false,
    "message": "Cannot GET /api/v2/products",
    "code": 404
}
```

change it:

```typescript
server.config.notFoundRoute = (req, res, next) => {
    res.notFound("Not Found");
}
app.start();
```

### Change Error Handler

This package handles errors by default and returns a result like the one below. You can change this.

result:

```json
{
    "success": false,
    "message": "productId required",
    "code": 400
}
```

change it:

```typescript
server.config.errorHandler = (err, req, res, next) => {
    res.error('Error: ' + err.message);
}
app.start();
```
