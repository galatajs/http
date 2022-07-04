import { RequestHandler } from "../types/types";

export type Middleware = RequestHandler;

export function isMiddleware(middleware: any): middleware is Middleware {
  return typeof middleware === "function";
}
