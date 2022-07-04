import { Http1App } from "../types/types";
import { createHttp1App } from "../http1/http1";

export const useHttp1App = (): Http1App => {
  return createHttp1App;
};
