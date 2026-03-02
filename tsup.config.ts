import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/functions.ts"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  external: ["firebase-admin", "firebase-functions", "dotenv"],
});
