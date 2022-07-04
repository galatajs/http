import { Getter, Setter } from "../types/types";

export type HeaderSetterParams = string[] | string;
export type HeaderGetterResult = HeaderSetterParams | undefined;

export type HeaderGetter = Getter<string>;
export type HeaderSetter = Setter<string>;
export type Header = HeaderGetter & HeaderSetter;
