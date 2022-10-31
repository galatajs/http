import { BadRequestError, IError } from "@galatajs/core";

export const checkAndParse = (data: any): any => {
  if (data instanceof IError) return data.serialize();
  if (data instanceof Error)
    return new BadRequestError(data.message).serialize();
  return data;
};
