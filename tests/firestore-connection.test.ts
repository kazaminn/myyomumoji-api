import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "../src/config/firebase";
import { ENV } from "../src/config/switch-env";

describe("Firestore接続テスト", () => {
  const testCollection = "connection-test";
  const testDocId = `test-${Date.now()}`;

  beforeAll(() => {
    console.log("=== 接続情報 ===");
    console.log("NODE_ENV:", ENV.NODE_ENV);
    console.log("USE_EMULATOR:", ENV.USE_EMULATOR);
    console.log("PROJECT_ID:", ENV.FIREBASE_PROJECT_ID);
    console.log("EMULATOR_HOST:", ENV.FIRESTORE_EMULATOR_HOST);
    console.log("================\n");
  });

  it("Firestoreに書き込みできる", async () => {
    const testRef = db.collection(testCollection).doc(testDocId);

    const testData = {
      message: "Hello Firestore",
      timestamp: new Date(),
      env: ENV.NODE_ENV,
      useEmulator: ENV.USE_EMULATOR,
    };

    await testRef.set(testData);

    const doc = await testRef.get();

    expect(doc.exists).toBe(true);
    expect(doc.data()?.message).toBe("Hello Firestore");
    expect(doc.data()?.env).toBe(ENV.NODE_ENV);
  });

  it("Firestoreから読み込みできる", async () => {
    const testRef = db.collection(testCollection).doc(testDocId);
    const doc = await testRef.get();

    expect(doc.exists).toBe(true);
    expect(doc.data()?.message).toBe("Hello Firestore");
  });

  it("Firestoreを更新できる", async () => {
    const testRef = db.collection(testCollection).doc(testDocId);

    await testRef.update({
      message: "Updated message",
      updatedAt: new Date(),
    });

    const doc = await testRef.get();
    expect(doc.data()?.message).toBe("Updated message");
  });

  it("Firestoreから削除できる", async () => {
    const testRef = db.collection(testCollection).doc(testDocId);

    await testRef.delete();

    const doc = await testRef.get();
    expect(doc.exists).toBe(false);
  });

  afterAll(async () => {
    // クリーンアップ（念のため）
    try {
      await db.collection(testCollection).doc(testDocId).delete();
    } catch (error) {
      // 既に削除済みの場合は無視
    }
  });
});
