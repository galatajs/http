import http from "http";
import {
  ErrorDataResult,
  ErrorResult,
  Status,
  SuccessDataResult,
  SuccessResult,
} from "@istanbul/core";
import http2 from "http2";
import { Http1Response, Http2Response, BaseResponse } from "./response";
import { setCookie } from "../cookie/cookie.setter";
import { setHead } from "../header/header.setter";
import { HeaderSetterParams } from "../header/header";

const useBaseResponse = (
  res: http.ServerResponse | http2.Http2ServerResponse
): BaseResponse => {
  return {
    status(status: number) {
      res.statusCode = status;
      return this;
    },
    success(message: string): void {
      this.done<SuccessResult>(new SuccessResult(message));
    },
    error(message: string, code: number = Status.BAD_REQUEST): void {
      this.done<ErrorResult>(new ErrorResult(message, code));
    },
    successData<T>(message: string, data: T): void {
      this.done<SuccessDataResult<T>>(new SuccessDataResult<T>(message, data));
    },
    errorData<T>(
      message: string,
      data: T,
      code: number = Status.BAD_REQUEST
    ): void {
      this.done<ErrorDataResult<T>>(
        new ErrorDataResult<T>(message, data, code)
      );
    },
    done<T>(data: T & { code?: number; status?: number }): void {
      if (!res.writableEnded) {
        if (data.code || data.status) {
          res.statusCode = data.status || data.code || Status.OK;
        }
        res.setHeader("Content-Type", "application/json");
        res.end(typeof data === "string" ? data : JSON.stringify(data));
      }
    },
    badRequest(message: string) {
      this.error(message, Status.BAD_REQUEST);
    },
    notFound(message: string) {
      this.error(message, Status.NOT_FOUND);
    },
    serverError(message: string) {
      this.error(message, Status.INTERNAL_SERVER_ERROR);
    },
    send<T>(data?: T) {
      this.done<T>(data);
    },
    cookies: {
      set(key: string, value: string): void {
        setCookie(res, key, value);
      },
    },
    headers: {
      set(key: string, value: HeaderSetterParams): void {
        setHead(res, key, value);
      },
    },
  };
};

export const transformHttp1Response = (
  res: http.ServerResponse
): Http1Response => {
  return {
    ...res,
    ...useBaseResponse(res),
  } as Http1Response;
};

export const transformHttp2Response = (
  res: http2.Http2ServerResponse
): Http2Response => {
  return {
    ...res,
    ...useBaseResponse(res),
  } as Http2Response;
};
