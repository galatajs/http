import http from "http";
import url from "url";
import http2 from "http2";
import { BaseRequest, Http1Request, Http2Request } from "./request";
import {
  ContentTypeEnum,
  ParserEnum,
  parseRequest,
  parsers,
} from "./request.parser";
import { Request } from "../types/types";
import { getCookie } from "../cookie/cookie.getter";
import { getHead } from "../header/header.getter";
import { HeaderGetterResult } from "../header/header";

const getBody = async (
  req: http.IncomingMessage | http2.Http2ServerRequest
) => {
  const contentType = req.headers["content-type"] || "application/json";
  let body;
  if (!!ContentTypeEnum[contentType]) {
    const parser = parsers[ContentTypeEnum[contentType] as ParserEnum]();
    body = await parseRequest(parser)(req);
  } else {
    body = {};
  }
  return body;
};

const createBaseRequest = async (
  req: http.IncomingMessage | http2.Http2ServerRequest
): Promise<BaseRequest> => {
  const query = { ...url.parse(req.url || "", true).query };
  req.url = req.url?.split("?")[0];
  return {
    ip: req.socket.remoteAddress || "0.0.0.0",
    body: await getBody(req),
    params: {},
    query: query,
    cookie: {
      get(key: string): string | undefined {
        return getCookie(req, key);
      },
    },
    header: {
      get(key: string): HeaderGetterResult {
        return getHead(req, key);
      },
    },
  };
};

const baseTransformRequest = async (
  req: http.IncomingMessage | http2.Http2ServerRequest
) => {
  return Object.assign(req, await createBaseRequest(req));
};

export const transformHttp1Request = async (
  req: http.IncomingMessage
): Promise<Http1Request> => {
  return baseTransformRequest(req) as Promise<Http1Request>;
};

export const transformHttp2Request = async (
  req: http2.Http2ServerRequest
): Promise<Http2Request> => {
  return baseTransformRequest(req) as Promise<Http2Request>;
};

export const transformHttpRouteParams = (
  url: string,
  req: Request
): Record<string, string> => {
  let result = {};
  if (!req.url || !url.includes(":")) return result;
  const keys: string[] = url.split("/").filter((item) => item.includes(":"));
  req.url.split("/").forEach((part) => {
    if (!url.includes(part)) {
      let key = keys.shift();
      if (key) {
        key = key.replace(/:/g, "");
        result[key] = part;
      }
    }
  });
  return result;
};
