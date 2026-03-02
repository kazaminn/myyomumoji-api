import path from "node:path";

// NODE_ENVが未設定の場合のデフォルト値
const getEnv = (): "test" | "development" | "production" => {
  if (process.env.NODE_ENV === "test") return "test";
  if (process.env.NODE_ENV === "production") return "production";
  return "development";
};

const env = getEnv();

// 本番(Cloud Functions)は環境変数がランタイムから提供されるため不要
// FUNCTION_TARGET は Firebase CLI のコード分析時に設定される
const isFirebaseContext = process.env.K_SERVICE || process.env.FUNCTION_TARGET;
if (env !== "production" && !isFirebaseContext) {
  const envFile = env === "test" ? ".env.test" : ".env.development";
  const { config } = await import("dotenv");
  config({ path: path.resolve(process.cwd(), envFile) });
}

export const ENV = {
  NODE_ENV: env,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || undefined,
  USE_EMULATOR: process.env.USE_EMULATOR === "true",
  FIRESTORE_EMULATOR_HOST: process.env.FIRESTORE_EMULATOR_HOST,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || "http://localhost:3000",
};
