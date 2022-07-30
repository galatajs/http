import url from "node:url";
import { createRule, RuleResult } from "@istanbul/rules";
import { Http1Request, Http2Request } from "../request/request";
import { Route } from "../router/route";

type CheckRouteParams = {
  route: Route;
  prefix: string;
  req: Http1Request | Http2Request;
  path: string;
};

const checkRouteMethods = ({
  route,
  req,
}: CheckRouteParams): RuleResult<undefined> => {
  return {
    success: route.isAll || route.methods.every((m) => m === req.method!),
  };
};

const checkRouteParams = ({
  route,
  path,
  req,
}: CheckRouteParams): RuleResult<undefined> => {
  const pathname = url.parse(req.url || "").pathname;
  if (route.path.includes(":")) {
    const index = path.indexOf(":");
    return {
      success: pathname!.slice(0, index - 1) === path.slice(0, index - 1),
    };
  }
  return { success: route.path === "*" || req.url === path };
};

const checkRoutePrefix = ({
  prefix,
  req,
}: CheckRouteParams): RuleResult<undefined> => {
  return {
    success: req.url!.includes(prefix),
  };
};

const checkRouteUrlAndIsAll = ({
  path,
  route,
  req,
}: CheckRouteParams): RuleResult<undefined> => {
  return {
    success:
      req.url!.split("/").length === path.split("/").length ||
      route.path === "*",
  };
};

export const checkRoute = (params: CheckRouteParams): boolean => {
  const routeRule = createRule<undefined>({ singleParameter: true })
    .start(checkRouteMethods)
    .and(checkRouteParams)
    .and(checkRoutePrefix)
    .and(checkRouteUrlAndIsAll)
    .end(params);
  return routeRule.success;
};
