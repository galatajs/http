import { createEvent } from "@istanbul/events";
import { Server } from "../types/types";

export type ServerCreatedListener = (server: Server) => void;

export const onServerStarted = createEvent<Server>("onServerStarted");
