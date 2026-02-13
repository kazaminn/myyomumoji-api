import { db } from "@/config/firebase";
import { ENV } from "@/config/switch-env";
import { computeAccessibilityThresholds } from "@/services/accessibility";
import type {
  CreateProfileInput,
  ProfileDocument,
  ProfileResponse,
  UpdateProfileInput,
} from "@/types/profile";
import { normalizeHex } from "@/utils/color";
import { AppError } from "@/utils/errors";
import { generateProfileId } from "@/utils/id";
import { FieldValue } from "firebase-admin/firestore";

const COLLECTION_PATH = "public/profiles/data";

function getCollection() {
  return db.collection(COLLECTION_PATH);
}

function toResponse(doc: ProfileDocument): ProfileResponse {
  return {
    profileId: doc.profileId,
    nickname: doc.nickname,
    preferences: doc.preferences,
    accessibility_thresholds: doc.accessibilityThresholds,
    metadata: {
      publicUrl: `${ENV.PUBLIC_BASE_URL}/p/${doc.profileId}`,
      createdAt: doc.metadata.createdAt.toDate().toISOString(),
      updatedAt: doc.metadata.updatedAt.toDate().toISOString(),
    },
  };
}

function normalizeColors(input: CreateProfileInput | UpdateProfileInput): void {
  if (input.preferences) {
    input.preferences.colors.foreground = normalizeHex(
      input.preferences.colors.foreground,
    );
    input.preferences.colors.background = normalizeHex(
      input.preferences.colors.background,
    );
  }
}

export async function createProfile(
  input: CreateProfileInput,
): Promise<ProfileResponse> {
  normalizeColors(input);

  const profileId = generateProfileId();
  const thresholds = computeAccessibilityThresholds(input.preferences);

  const docData = {
    profileId,
    nickname: input.nickname,
    preferences: input.preferences,
    accessibilityThresholds: thresholds,
    metadata: {
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
  };

  const docRef = getCollection().doc(profileId);
  await docRef.set(docData);

  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    throw new AppError(
      "PROFILE_CREATION_FAILED",
      "プロフィールの作成に失敗しました",
      500,
    );
  }

  return toResponse(snapshot.data() as ProfileDocument);
}

export async function getProfile(profileId: string): Promise<ProfileResponse> {
  const docRef = getCollection().doc(profileId);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    throw new AppError(
      "PROFILE_NOT_FOUND",
      "プロフィールが見つかりません",
      404,
    );
  }

  return toResponse(snapshot.data() as ProfileDocument);
}

export async function updateProfile(
  profileId: string,
  input: UpdateProfileInput,
): Promise<ProfileResponse> {
  const docRef = getCollection().doc(profileId);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    throw new AppError(
      "PROFILE_NOT_FOUND",
      "プロフィールが見つかりません",
      404,
    );
  }

  const updateData: Record<string, unknown> = {
    "metadata.updatedAt": FieldValue.serverTimestamp(),
  };

  if (input.nickname !== undefined) {
    updateData.nickname = input.nickname;
  }

  if (input.preferences !== undefined) {
    normalizeColors(input);
    updateData.preferences = input.preferences;

    const mergedPreferences = input.preferences;
    updateData.accessibilityThresholds =
      computeAccessibilityThresholds(mergedPreferences);
  }

  await docRef.update(updateData);

  const updated = await docRef.get();
  return toResponse(updated.data() as ProfileDocument);
}

export async function deleteProfile(profileId: string): Promise<void> {
  const docRef = getCollection().doc(profileId);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    throw new AppError(
      "PROFILE_NOT_FOUND",
      "プロフィールが見つかりません",
      404,
    );
  }

  await docRef.delete();
}
