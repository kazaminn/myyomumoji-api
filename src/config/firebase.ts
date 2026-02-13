import path from "node:path";
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
  } else {
    if (ENV.GOOGLE_APPLICATION_CREDENTIALS) {
      const credentialsPath = path.resolve(
        process.cwd(),
        ENV.GOOGLE_APPLICATION_CREDENTIALS,
      );
      const serviceAccount = require(credentialsPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }
}

export const db = admin.firestore();
