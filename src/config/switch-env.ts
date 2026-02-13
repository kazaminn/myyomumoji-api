import path from "node:path";
import { config } from "dotenv";

// NODE_ENVが未設定の場合のデフォルト値
const getEnv = (): "test" | "development" | "production" => {
  if (process.env.NODE_ENV === "test") return "test";
  if (process.env.NODE_ENV === "production") return "production";
  return "development";
};

const env = getEnv();

// 環境に応じたファイルを読み込み
const envFile = {
  test: ".env.test",
  development: ".env.development",
  production: ".env.production",
}[env];

config({ path: path.resolve(process.cwd(), envFile) });

export const ENV = {
  NODE_ENV: env,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || undefined,
  USE_EMULATOR: process.env.USE_EMULATOR === "true",
  FIRESTORE_EMULATOR_HOST: process.env.FIRESTORE_EMULATOR_HOST,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || "http://localhost:3000",
};
