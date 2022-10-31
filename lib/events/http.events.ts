import { createEvent } from "@galatajs/events";
import { Server } from "../types/types";

export type ServerCreatedListener = (server: Server) => void;

export const onServerStarted = createEvent<Server>("onServerStarted");
