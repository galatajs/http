import { Http2App, Http2SecureApp } from "../types/types";
import { createHttp2App, createSecureHttp2App } from "../http2/http2";

export const useHttp2App = (): Http2App => {
  return createHttp2App;
};

export const useHttp2SecureApp = (): Http2SecureApp => {
  return createSecureHttp2App;
};
