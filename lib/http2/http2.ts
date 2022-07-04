import http2, { SecureServerOptions } from "http2";
import { Http2Request } from "../request/request";
import { Http2Response } from "../response/response";
import { transformHttp2Request } from "../request/request.transformer";
import { transformHttp2Response } from "../response/response.transformer";
import { Http2App, Http2SecureApp } from "../types/types";

const useApp = async (
  req: http2.Http2ServerRequest,
  res: http2.Http2ServerResponse,
  handle: (req: Http2Request, res: Http2Response) => any
) => {
  handle(await transformHttp2Request(req), transformHttp2Response(res));
};

export const createHttp2App: Http2App = (
  handle: (req: Http2Request, res: Http2Response) => any
): http2.Http2Server => {
  return http2.createServer((req, res) => {
    useApp(req, res, handle);
  });
};

export const createSecureHttp2App: Http2SecureApp = (
  handle: (req: Http2Request, res: Http2Response) => any,
  options: SecureServerOptions
): http2.Http2SecureServer => {
  return http2.createSecureServer(options, (req, res) => {
    useApp(req, res, handle);
  });
};
