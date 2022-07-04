import { Getter, Setter } from "../types/types";

export type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "strict" | "lax";
  domain?: string;
};

export type CookieGetter = Getter<string>;
export type CookieSetter = Setter<string, CookieOptions>;
export type Cookie = CookieGetter & CookieSetter;
