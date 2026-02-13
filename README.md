# MyYomuMoji API

視覚障害者向けの個人設定共有プラットフォーム

## MyYomuMojiとは

**MyYomuMoji**は、自分の見え方の設定（フォントサイズ、行間、好みの配色など）をMyYomuMoji Cardとして、保存・共有できるプラットフォームです。本人の見えやすい設定を支援者・家族・友人と共有することで、より良いコミュニケーションと合理的配慮を実現します。

### 2つのAPI

1. **Profile API**（本APIのメイン機能）
   - 対象: 見えづらさや読みづらさを感じている当事者（主な想定ユーザーは弱視者）と支援者
   - 機能: 個人の視覚設定を保存・共有（CRUD完全対応）
   - ユースケース: 設定の保存、共有URL発行、外部アプリへの統合

2. **Validation API**
   - 対象: Webデザイナー・開発者
   - 機能: 色のアクセシビリティ検証（WCAG、APCA、色覚特性）
   - ユースケース: デザインの事前検証、配色テスト

### プライバシーへの配慮

このAPIは**医療情報や身体的特性を示唆する情報を保存しません**。特定の病気や障害を示すラベル（例: "protanopia"、"low vision"など）は使用せず、あくまで「個人の見え方の好み」として扱います。

---

## ✨ 主な機能

### Profile API

- ✅ プロフィールの作成（POST）
- ✅ プロフィールの取得（GET）
- ✅ プロフィールの更新（PATCH）
- ✅ プロフィールの削除（DELETE）
- ✅ アクセシビリティ指標の自動計算（WCAG、APCA、色覚特性）
- ✅ 共有URL自動生成

### Validation API

- ✅ 色ペアの一括検証
- ✅ WCAGコントラスト比計算
- ✅ APCAコントラスト計算
- ✅ 色覚特性シミュレーション（3型対応）

---

## 🎯 ユースケース

### 1. 視覚障害者本人

1. Web UIで自分の好みを設定（フォントサイズ、行間、配色など）
2. 「設定を保存」→ 共有URL発行（例: `https://example.com/p/mym-abc12345`）
3. URLを支援者に共有

### 2. 支援者・家族

1. 共有URLを開く
2. 本人の視覚設定を確認
3. Webサイト制作時や配色テスト時に参考にする

### 3. 開発者（外部アプリ連携）

1. 自分のアプリにProfile APIを統合
2. `GET /api/profiles/:id` で設定取得
3. 取得した設定を自動適用（フォントサイズ調整、配色変更など）

---

## 🛠️ 技術スタック

- **Runtime**: Node.js >= 20.0.0
- **Framework**: Hono v4.6.0（軽量Webフレームワーク）
- **Database**: Firebase Firestore（Cloud Firestore）
- **Validation**: Zod v3.24.0（スキーマバリデーション）
- **Testing**: Vitest v4.0.0（112テスト全パス）
- **Code Quality**: ESLint v9 + Prettier v3（Linting & Formatting）
- **Accessibility**: apca-w3, @bjornlu/colorblind, colorparsley

---

## 🚀 セットアップ

### 必要な環境

- Node.js 20以上
- Firebaseプロジェクト（または Firebase Emulator）

### インストール手順

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd myyomumoji-api

# 2. 依存関係をインストール
npm install

# 3. 環境変数を設定
cp .env.example .env.development

# 4. .env.developmentを編集
# - FIREBASE_PROJECT_ID: Firebaseプロジェクト ID
# - GOOGLE_APPLICATION_CREDENTIALS: サービスアカウントキーのパス
# - PUBLIC_BASE_URL: 公開URL（開発時は http://localhost:3000）

# 5. Firestore Emulatorを起動（開発時推奨）
firebase emulators:start --only firestore

# 6. 開発サーバーを起動
npm run dev
```

### 環境変数

`.env.development`の例：

```bash
# Firebase設定
FIREBASE_PROJECT_ID=myyomumoji-api
GOOGLE_APPLICATION_CREDENTIALS=./config/serviceAccountKey.json

# Emulator設定（開発時）
FIRESTORE_EMULATOR_HOST=0.0.0.0:8080
USE_EMULATOR=false

# 環境
NODE_ENV=development

# Profile API公開URL
PUBLIC_BASE_URL=http://localhost:3000
```

---

## 📚 API仕様

### Base URL

```
http://localhost:3000/api
```

---

## Profile API

### エンドポイント一覧

| メソッド | エンドポイント      | 説明             |
| -------- | ------------------- | ---------------- |
| POST     | `/api/profiles`     | プロフィール作成 |
| GET      | `/api/profiles/:id` | プロフィール取得 |
| PATCH    | `/api/profiles/:id` | プロフィール更新 |
| DELETE   | `/api/profiles/:id` | プロフィール削除 |

---

### 1. プロフィール作成

**POST** `/api/profiles`

#### リクエスト

```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "いつもの設定（自宅用）",
    "preferences": {
      "typography": {
        "fontFamily": "sans-serif",
        "fontSize": 28,
        "fontWeight": 700,
        "lineHeight": 1.8
      },
      "colors": {
        "foreground": "#FFFFFF",
        "background": "#000000"
      }
    }
  }'
```

#### レスポンス（201 Created）

```json
{
  "success": true,
  "data": {
    "profileId": "mym-abc12345",
    "nickname": "いつもの設定（自宅用）",
    "preferences": {
      "typography": {
        "fontFamily": "sans-serif",
        "fontSize": 28,
        "fontWeight": 700,
        "lineHeight": 1.8
      },
      "colors": {
        "foreground": "#FFFFFF",
        "background": "#000000"
      }
    },
    "accessibility_thresholds": {
      "wcagRatio": 21.0,
      "wcagLevel": "AAA",
      "apcaLc": 106,
      "isColorblindSafe": true
    },
    "metadata": {
      "publicUrl": "http://localhost:3000/p/mym-abc12345",
      "createdAt": "2026-02-11T10:30:00Z",
      "updatedAt": "2026-02-11T10:30:00Z"
    }
  }
}
```

**注**: `profileId`は`mym-`プレフィックス + 8文字の英数字（小文字）で自動生成されます。

---

### 2. プロフィール取得

**GET** `/api/profiles/:id`

#### リクエスト

```bash
curl http://localhost:3000/api/profiles/mym-abc12345
```

#### レスポンス（200 OK）

```json
{
  "success": true,
  "data": {
    "profileId": "mym-abc12345",
    "nickname": "いつもの設定（自宅用）",
    "preferences": {
      "typography": {
        "fontFamily": "sans-serif",
        "fontSize": 28,
        "fontWeight": 700,
        "lineHeight": 1.8
      },
      "colors": {
        "foreground": "#FFFFFF",
        "background": "#000000"
      }
    },
    "accessibility_thresholds": {
      "wcagRatio": 21.0,
      "wcagLevel": "AAA",
      "apcaLc": 106,
      "isColorblindSafe": true
    },
    "metadata": {
      "publicUrl": "http://localhost:3000/p/mym-abc12345",
      "createdAt": "2026-02-11T10:30:00Z",
      "updatedAt": "2026-02-11T10:30:00Z"
    }
  }
}
```

**アクセシビリティ指標の自動計算**:

- `wcagRatio`: WCAGコントラスト比（1〜21）
- `wcagLevel`: WCAG適合レベル（"AAA" / "AA" / "FAIL"）
- `apcaLc`: APCA Lightness Contrast値
- `isColorblindSafe`: 3型色覚特性でも安全か（protanopia, deuteranopia, tritanopia）

---

### 3. プロフィール更新

**PATCH** `/api/profiles/:id`

部分更新に対応。`nickname`または`preferences`の少なくとも1つが必要です。

#### リクエスト

```bash
curl -X PATCH http://localhost:3000/api/profiles/mym-abc12345 \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "更新後の設定名"
  }'
```

#### レスポンス（200 OK）

```json
{
  "success": true,
  "data": {
    "profileId": "mym-abc12345",
    "nickname": "更新後の設定名",
    "preferences": {
      "typography": {
        "fontFamily": "sans-serif",
        "fontSize": 28,
        "fontWeight": 700,
        "lineHeight": 1.8
      },
      "colors": {
        "foreground": "#FFFFFF",
        "background": "#000000"
      }
    },
    "accessibility_thresholds": {
      "wcagRatio": 21.0,
      "wcagLevel": "AAA",
      "apcaLc": 106,
      "isColorblindSafe": true
    },
    "metadata": {
      "publicUrl": "http://localhost:3000/p/mym-abc12345",
      "createdAt": "2026-02-11T10:30:00Z",
      "updatedAt": "2026-02-11T10:35:00Z"
    }
  }
}
```

**注**: `preferences.colors`を更新した場合、`accessibility_thresholds`も自動的に再計算されます。

---

### 4. プロフィール削除

**DELETE** `/api/profiles/:id`

#### リクエスト

```bash
curl -X DELETE http://localhost:3000/api/profiles/mym-abc12345
```

#### レスポンス（200 OK）

```json
{
  "success": true,
  "data": null
}
```

---

## バリデーションルール

### nickname

- **型**: string
- **最小長**: 1文字
- **最大長**: 100文字

### typography.fontFamily

- **型**: string
- **最小長**: 1文字
- **最大長**: 100文字

### typography.fontSize

- **型**: number
- **最小値**: 8
- **最大値**: 128

### typography.fontWeight

- **型**: number
- **許可される値**: 100, 200, 300, 400, 500, 600, 700, 800, 900

### typography.lineHeight

- **型**: number
- **最小値**: 1.0
- **最大値**: 3.0

### colors.foreground / colors.background

- **型**: string
- **形式**: Hex色（`#RGB`, `#RRGGBB`, `#RRGGBBAA`）
- **例**: `#FFF`, `#FFFFFF`, `#FFFFFF00`
- **注**: 自動的に大文字に正規化されます

---

## Validation API

### POST /api/validate/batch

色ペアを一括検証します。

#### リクエスト

```bash
curl -X POST http://localhost:3000/api/validate/batch \
  -H "Content-Type: application/json" \
  -d '{
    "colors": [
      {
        "id": "pair1",
        "foreground": "#FFFFFF",
        "background": "#000000"
      },
      {
        "id": "pair2",
        "foreground": "#000000",
        "background": "#FFFF00"
      }
    ],
    "fontSize": 16,
    "fontWeight": 400
  }'
```

#### レスポンス（200 OK）

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "pair1",
        "foreground": "#FFFFFF",
        "background": "#000000",
        "wcag": {
          "ratio": 21.0,
          "level": "AAA"
        },
        "apca": {
          "Lc": 106
        },
        "colorblind": {
          "isSafe": true
        }
      },
      {
        "id": "pair2",
        "foreground": "#000000",
        "background": "#FFFF00",
        "wcag": {
          "ratio": 19.56,
          "level": "AAA"
        },
        "apca": {
          "Lc": 101
        },
        "colorblind": {
          "isSafe": true
        }
      }
    ]
  }
}
```

---

## ❌ エラーケース

### エラーレスポンス形式

全てのエラーは以下の形式で返されます：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": [
      {
        "field": "preferences.typography.fontSize",
        "message": "フォントサイズは8以上で指定してください"
      }
    ]
  }
}
```

---

### 主要なエラーコード

| エラーコード              | ステータス | 説明                          |
| ------------------------- | ---------- | ----------------------------- |
| `VALIDATION_ERROR`        | 400        | 入力値の検証に失敗            |
| `INVALID_PROFILE_ID`      | 400        | プロフィールIDの形式が不正    |
| `PROFILE_NOT_FOUND`       | 404        | プロフィールが見つからない    |
| `PROFILE_CREATION_FAILED` | 500        | プロフィールの作成に失敗      |
| `REQUEST_TOO_LARGE`       | 413        | リクエストボディが100KBを超過 |
| `INTERNAL_ERROR`          | 500        | 予期しないサーバーエラー      |

---

### エラーケース例

#### 1. 必須フィールドの欠落（400 VALIDATION_ERROR）

**リクエスト**:

```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "typography": { "fontFamily": "sans-serif", "fontSize": 16, "fontWeight": 400, "lineHeight": 1.5 },
      "colors": { "foreground": "#000", "background": "#FFF" }
    }
  }'
```

**レスポンス**:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値が不正です",
    "details": [
      {
        "field": "nickname",
        "message": "Required"
      }
    ]
  }
}
```

---

#### 2. 無効なProfile ID形式（400 INVALID_PROFILE_ID）

**リクエスト**:

```bash
curl http://localhost:3000/api/profiles/invalid-id
```

**レスポンス**:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PROFILE_ID",
    "message": "プロフィールIDの形式が不正です"
  }
}
```

**正しい形式**: `mym-[a-z0-9]{8}` （例: `mym-abc12345`）

---

#### 3. プロフィールが存在しない（404 PROFILE_NOT_FOUND）

**リクエスト**:

```bash
curl http://localhost:3000/api/profiles/mym-notfound
```

**レスポンス**:

```json
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "プロフィールが見つかりません"
  }
}
```

---

#### 4. バリデーションエラー詳細（400 VALIDATION_ERROR）

**リクエスト**:

```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "test",
    "preferences": {
      "typography": {
        "fontFamily": "sans-serif",
        "fontSize": 5,
        "fontWeight": 350,
        "lineHeight": 0.5
      },
      "colors": {
        "foreground": "invalid-color",
        "background": "#FFF"
      }
    }
  }'
```

**レスポンス**:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値が不正です",
    "details": [
      {
        "field": "preferences.typography.fontSize",
        "message": "Number must be greater than or equal to 8"
      },
      {
        "field": "preferences.typography.fontWeight",
        "message": "Invalid enum value. Expected 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, received 350"
      },
      {
        "field": "preferences.typography.lineHeight",
        "message": "Number must be greater than or equal to 1"
      },
      {
        "field": "preferences.colors.foreground",
        "message": "Invalid hex color format"
      }
    ]
  }
}
```

---

## 🧪 開発・テスト

### NPMスクリプト

```bash
# 開発サーバー起動（ホットリロード）
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# テスト実行
npm test

# テスト（watchモード）
npm run test:watch

# Lintチェック
npm run lint

# Lint自動修正
npm run lint:fix

# コードフォーマット
npm run format

# フォーマットチェック（CI用）
npm run format:check
```

---

### テストについて

- **テストファイル数**: 15ファイル
- **テストケース数**: 112件（全パス）
- **テスト対象**:
  - Unit tests: schemas, services, utils
  - Integration tests: API endpoints, Firestore連携
- **実行環境**: Firebase Emulator（本番環境でのテスト禁止）

```bash
# 全テスト実行
npm test

# 特定のテストファイルを実行
npx vitest tests/integration/api/profiles.test.ts

# カバレッジ付きで実行
npx vitest --coverage
```

---

## 🏗️ プロジェクト構造

```
myyomumoji-api/
├── src/
│   ├── index.ts              # エントリーポイント（Honoアプリ）
│   ├── config/              # 設定
│   │   ├── firebase.ts      # Firebase Admin SDK初期化
│   │   └── switch-env.ts    # 環境切り替え
│   ├── routes/              # APIルーティング
│   │   ├── index.ts         # ルート集約
│   │   ├── health.ts        # ヘルスチェック
│   │   ├── profiles.ts      # Profile CRUD
│   │   └── validate.ts      # Validation API
│   ├── services/            # ビジネスロジック
│   │   ├── profile.ts       # Profileサービス
│   │   ├── accessibility.ts # アクセシビリティ計算
│   │   ├── wcag.ts          # WCAG計算
│   │   ├── apca.ts          # APCA計算
│   │   ├── colorblind.ts    # 色覚特性チェック
│   │   └── validator.ts     # 一括検証
│   ├── schemas/             # Zodバリデーション
│   │   ├── common.ts        # 共通スキーマ
│   │   ├── profile.ts       # Profileスキーマ
│   │   └── validate.ts      # Validationスキーマ
│   ├── types/               # TypeScript型定義
│   │   ├── index.ts         # 共通型
│   │   ├── profile.ts       # Profile型
│   │   └── apca-w3.d.ts     # APCA型定義
│   ├── middleware/          # ミドルウェア
│   │   └── error-handler.ts # グローバルエラーハンドラー
│   └── utils/               # ユーティリティ
│       ├── errors.ts        # カスタムエラークラス
│       ├── id.ts            # Profile ID生成
│       └── color.ts         # 色ユーティリティ
├── tests/                   # テストコード
│   ├── integration/
│   │   ├── api/
│   │   └── services/
│   └── unit/
│       ├── schemas/
│       ├── services/
│       └── utils/
├── .env.example             # 環境変数テンプレート
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## 🔒 セキュリティとプライバシー

### センシティブ情報の扱い

このAPIは以下の情報を**保存しません**：

- ❌ 医療情報
- ❌ 障害名や病名のラベル（"protanopia"、"low vision"など）
- ❌ 身体的特性を示唆する情報

**目的**: 個人の「見え方の好み」を共有し、周りの人（支援者、家族、友人、同僚など）と合理的配慮を行うツールとして設計されています。

---

### Firestore Security

- **Admin SDK使用**: サーバーサイドのみでFirestoreにアクセス
- **クライアント側アクセス無効**: Security Rulesで`read/write: false`
- **全操作がAPI経由**: バリデーション、認証、権限チェックをサーバーで実施

**firestore.rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

### Database構造

```
(default) /
  public (collection)
    / profiles (document)
      / data (collection)
        / {profileId} (document)
          - profileId: string
          - nickname: string
          - preferences: object
          - accessibilityThresholds: object
          - metadata: { createdAt: Timestamp, updatedAt: Timestamp }
```

---

## 📝 ライセンス

MIT
