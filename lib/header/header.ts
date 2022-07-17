import { Getter, Remover, Setter } from "../types/types";

export type HeaderSetterParams = string[] | string;
export type HeaderGetterResult = HeaderSetterParams | undefined;

export type HeaderGetter = Getter<HeaderGetterResult>;
export type HeaderSetter = Setter<number | string | ReadonlyArray<string>>;
export interface Header extends HeaderGetter, HeaderSetter, Remover {}
