import { getRequestListener } from "@hono/node-server";
import { onRequest } from "firebase-functions/v2/https";

import app from "./index";

export const api = onRequest({ invoker: "public" }, getRequestListener(app.fetch));
