import url from "url";
import { IncomingMessage } from "http";
import { Http2ServerRequest } from "http2";

export interface RequestParser {
  parse: (body: string) => object;
}

export enum ParserEnum {
  JSON = "json",
  URLENCODED = "urlencoded",
}

export const ContentTypeEnum: Record<string, ParserEnum> = {
  "application/json": ParserEnum.JSON,
  "application/x-www-form-urlencoded": ParserEnum.URLENCODED,
};

export type Parsers = {
  [key in ParserEnum]: () => RequestParser;
};

export type ParseRequest = (
  req: IncomingMessage | Http2ServerRequest
) => Promise<object>;

export const parseRequest = (parser: RequestParser) => {
  return (req: IncomingMessage | Http2ServerRequest): Promise<object> => {
    return new Promise<object>((resolve, reject) => {
      let body = "";
      req
        .on("data", (chunk) => {
          body += chunk;
        })
        .on("end", () => {
          try {
            resolve(parser.parse(body));
          } catch (e) {
            resolve({});
          }
        });
    });
  };
};

const json = (): RequestParser => {
  return {
    parse: (body: string): object => {
      return JSON.parse(body);
    },
  };
};

const urlencoded = (): RequestParser => {
  return {
    parse: (body: string): object => {
      body = body.startsWith("?") ? body : `?${body}`;
      return { ...url.parse(body, true).query };
    },
  };
};

export const parsers: Parsers = {
  [ParserEnum.JSON]: json,
  [ParserEnum.URLENCODED]: urlencoded,
};
