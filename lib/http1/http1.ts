import http from "http";
import { Http1Request } from "../request/request";
import { Http1Response } from "../response/response";
import { transformHttp1Request } from "../request/request.transformer";
import { transformHttp1Response } from "../response/response.transformer";
import { Http1App } from "../types/types";

export const createHttp1App: Http1App = (
  handle: (req: Http1Request, res: Http1Response) => any
): http.Server => {
  return http.createServer(async (req, res) => {
    handle(await transformHttp1Request(req), transformHttp1Response(res));
  });
};
