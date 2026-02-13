import { Hono } from "hono";
import health from "@/routes/health";
import validate from "@/routes/validate";

const routes = new Hono();

routes.route("/health", health);
routes.route("/validate", validate);

export default routes;
