export interface ProfileTypography {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
}

export interface ProfileColors {
  foreground: string;
  background: string;
}

export interface ProfilePreferences {
  typography: ProfileTypography;
  colors: ProfileColors;
}

export interface AccessibilityThresholds {
  wcagRatio: number;
  wcagLevel: "AAA" | "AA" | "FAIL";
  apcaLc: number;
  isColorblindSafe: boolean;
}

export interface ProfileMetadata {
  createdAt: string;
  updatedAt: string;
}

/** API レスポンス用 Profile（publicUrl含む） */
export interface ProfileResponse {
  profileId: string;
  nickname: string;
  preferences: ProfilePreferences;
  accessibility_thresholds: AccessibilityThresholds;
  metadata: ProfileMetadata & { publicUrl: string };
}

/** Firestore ドキュメント構造 */
export interface ProfileDocument {
  profileId: string;
  nickname: string;
  preferences: ProfilePreferences;
  accessibilityThresholds: AccessibilityThresholds;
  metadata: {
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  };
}

/** POST リクエスト */
export interface CreateProfileInput {
  nickname: string;
  preferences: ProfilePreferences;
}

/** PATCH リクエスト */
export interface UpdateProfileInput {
  nickname?: string;
  preferences?: ProfilePreferences;
}
