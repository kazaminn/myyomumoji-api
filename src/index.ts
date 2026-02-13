import { errorHandler } from "@/middleware/error-handler";
import routes from "@/routes";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
  }),
);

app.use(
  "/api/*",
  bodyLimit({
    maxSize: 100 * 1024,
    onError: (c) =>
      c.json(
        {
          success: false,
          error: {
            code: "REQUEST_TOO_LARGE",
            message: "リクエストボディは100KBを超えることはできません",
          },
        },
        413,
      ),
  }),
);

app.route("/api", routes);

app.onError(errorHandler);

const port = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});

export default app;
