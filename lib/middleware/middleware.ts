import { IncomingMessage, ServerResponse } from "http";
import { NextFunction, RequestHandler } from "../types/types";

export type CoreMiddleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) => any;

export type Middleware = RequestHandler | CoreMiddleware;

export function isMiddleware(middleware: any): middleware is Middleware {
  return typeof middleware === "function";
}
