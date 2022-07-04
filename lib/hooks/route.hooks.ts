import { CreateRouteParams, Route } from "../router/route";

export const createRoute = (createRouteParams: CreateRouteParams): Route => {
  return {
    methods: createRouteParams.methods || [],
    isAll: createRouteParams.isAll || true,
    path: createRouteParams.path,
    version: createRouteParams.version,
    middlewares: createRouteParams.middlewares || [],
    controller: createRouteParams.controller,
    makePath(prefix?: string): string {
      return !!this.version
        ? `${prefix}/v${this.version}/${this.path}`
        : !!prefix
        ? `/${prefix}/${this.path}`
        : `/${this.path}`;
    },
  };
};
