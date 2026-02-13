import health from "@/routes/health";
import profiles from "@/routes/profiles";
import validate from "@/routes/validate";
import { Hono } from "hono";

const routes = new Hono();

routes.route("/health", health);
routes.route("/validate", validate);
routes.route("/profiles", profiles);

export default routes;
