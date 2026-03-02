import path from "node:path";
import { createRequire } from "node:module";
import { ENV } from "@/config/switch-env";
import admin from "firebase-admin";

if (!admin.apps.length) {
  if (ENV.USE_EMULATOR) {
    admin.initializeApp({
      projectId: ENV.FIREBASE_PROJECT_ID,
    });
    if (ENV.FIRESTORE_EMULATOR_HOST) {
      process.env.FIRESTORE_EMULATOR_HOST = ENV.FIRESTORE_EMULATOR_HOST;
    }
  } else if (ENV.GOOGLE_APPLICATION_CREDENTIALS) {
    // ローカル開発: サービスアカウントキーを使用
    const credentialsPath = path.resolve(
      process.cwd(),
      ENV.GOOGLE_APPLICATION_CREDENTIALS,
    );
    const require = createRequire(import.meta.url);
    const serviceAccount = require(credentialsPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Cloud Functions: Application Default Credentials (ADC) を使用
    admin.initializeApp();
  }
}

export const db = admin.firestore();
