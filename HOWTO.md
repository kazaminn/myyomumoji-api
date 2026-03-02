# API 利用ガイド

## ベース URL

```
https://api-bt5zbwzelq-uc.a.run.app
```

---

## エンドポイント一覧

<!-- prettier-ignore-start -->

| メソッド | パス | 概要 |
|---|---|---|
| GET | `/api/health` | ヘルスチェック |
| POST | `/api/validate/batch` | カラーアクセシビリティ検証 |
| POST | `/api/profiles` | プロフィール作成 |
| GET | `/api/profiles/:id` | プロフィール取得 |
| PATCH | `/api/profiles/:id` | プロフィール更新 |
| DELETE | `/api/profiles/:id` | プロフィール削除 |

<!-- prettier-ignore-end -->

---

## GET /api/health

サーバーの稼働確認。

```bash
curl https://api-bt5zbwzelq-uc.a.run.app/api/health
```

**レスポンス**

```json
{ "status": "ok" }
```

---

## POST /api/validate/batch

複数のカラーペアに対して WCAG・APCA・色覚シミュレーションを一括検証する。

### リクエスト

<!-- prettier-ignore-start -->

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `colors` | array | ✓ | カラーペアの配列（1〜50件） |
| `colors[].foreground` | string | ✓ | 前景色（`#RGB` または `#RRGGBB`） |
| `colors[].background` | string | ✓ | 背景色（`#RGB` または `#RRGGBB`） |
| `colors[].id` | string | | 識別子（省略時は自動採番） |
| `fontSize` | number | | フォントサイズ px（デフォルト: `16`） |
| `fontWeight` | number | | フォントウェイト 100〜900（デフォルト: `400`） |

<!-- prettier-ignore-end -->

```bash
curl -X POST https://api-bt5zbwzelq-uc.a.run.app/api/validate/batch \
  -H "Content-Type: application/json" \
  -d '{
    "colors": [
      {
        "id": "body-text",
        "foreground": "#333333",
        "background": "#ffffff"
      },
      {
        "id": "caption",
        "foreground": "#999999",
        "background": "#ffffff"
      }
    ],
    "fontSize": 16,
    "fontWeight": 400
  }'
```

**レスポンス**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "body-text",
        "foreground": "#333333",
        "background": "#ffffff",
        "wcag": {
          "ratio": 12.63,
          "normalText": { "aa": true, "aaa": true },
          "largeText": { "aa": true, "aaa": true }
        },
        "apca": {
          "lc": 88.5,
          "rating": "excellent",
          "minimumFontSize": 12
        },
        "colorblind": {
          "protanopia": { "safe": true, "simulated": "#404040" },
          "deuteranopia": { "safe": true, "simulated": "#404040" },
          "tritanopia": { "safe": true, "simulated": "#333333" }
        }
      }
    ],
    "summary": {
      "total": 2,
      "wcagAA": { "passed": 1, "failed": 1 },
      "wcagAAA": { "passed": 1, "failed": 1 },
      "apcaGood": 1
    }
  }
}
```

---

## POST /api/profiles

ユーザープロフィールを新規作成する。

### リクエスト

<!-- prettier-ignore-start -->

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `nickname` | string | ✓ | ニックネーム（1〜100文字） |
| `preferences.typography.fontFamily` | string | ✓ | フォントファミリー |
| `preferences.typography.fontSize` | number | ✓ | フォントサイズ px（8〜128） |
| `preferences.typography.fontWeight` | number | ✓ | フォントウェイト 100〜900 |
| `preferences.typography.lineHeight` | number | ✓ | 行間（1.0〜3.0） |
| `preferences.colors.foreground` | string | ✓ | 前景色（`#RGB` または `#RRGGBB`） |
| `preferences.colors.background` | string | ✓ | 背景色（`#RGB` または `#RRGGBB`） |

<!-- prettier-ignore-end -->

```bash
curl -X POST https://api-bt5zbwzelq-uc.a.run.app/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "たろう",
    "preferences": {
      "typography": {
        "fontFamily": "Noto Sans JP",
        "fontSize": 16,
        "fontWeight": 400,
        "lineHeight": 1.75
      },
      "colors": {
        "foreground": "#333333",
        "background": "#ffffff"
      }
    }
  }'
```

**レスポンス** (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "mym-a1b2c3d4",
    "nickname": "たろう",
    "preferences": {
      "typography": {
        "fontFamily": "Noto Sans JP",
        "fontSize": 16,
        "fontWeight": 400,
        "lineHeight": 1.75
      },
      "colors": {
        "foreground": "#333333",
        "background": "#ffffff"
      }
    },
    "createdAt": "2026-03-02T12:00:00.000Z",
    "updatedAt": "2026-03-02T12:00:00.000Z"
  }
}
```

---

## GET /api/profiles/:id

プロフィールIDを指定して取得する。IDは `mym-` から始まる8桁の英数字。

```bash
curl https://api-bt5zbwzelq-uc.a.run.app/api/profiles/mym-a1b2c3d4
```

**レスポンス**

```json
{
  "success": true,
  "data": {
    "id": "mym-a1b2c3d4",
    "nickname": "たろう",
    "preferences": { ... },
    "createdAt": "2026-03-02T12:00:00.000Z",
    "updatedAt": "2026-03-02T12:00:00.000Z"
  }
}
```

---

## PATCH /api/profiles/:id

プロフィールを部分更新する。`nickname` と `preferences` の少なくとも一方が必要。

```bash
curl -X PATCH https://api-bt5zbwzelq-uc.a.run.app/api/profiles/mym-a1b2c3d4 \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "じろう"
  }'
```

```bash
# preferences のみ更新
curl -X PATCH https://api-bt5zbwzelq-uc.a.run.app/api/profiles/mym-a1b2c3d4 \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "typography": {
        "fontFamily": "Hiragino Sans",
        "fontSize": 18,
        "fontWeight": 500,
        "lineHeight": 2.0
      },
      "colors": {
        "foreground": "#000000",
        "background": "#fffef0"
      }
    }
  }'
```

**レスポンス**

```json
{
  "success": true,
  "data": {
    "id": "mym-a1b2c3d4",
    "nickname": "じろう",
    "preferences": { ... },
    "createdAt": "2026-03-02T12:00:00.000Z",
    "updatedAt": "2026-03-02T13:00:00.000Z"
  }
}
```

---

## DELETE /api/profiles/:id

プロフィールを削除する。

```bash
curl -X DELETE https://api-bt5zbwzelq-uc.a.run.app/api/profiles/mym-a1b2c3d4
```

**レスポンス**

```json
{ "success": true, "data": null }
```

---

## エラーレスポンス

全エンドポイント共通のエラー形式。

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値が不正です",
    "details": [
      {
        "field": "colors[0].foreground",
        "message": "有効なHEXカラー（#RGB または #RRGGBB）を指定してください"
      }
    ]
  }
}
```

<!-- prettier-ignore-start -->

| HTTP ステータス | code | 説明 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | リクエストボディの形式が不正 |
| 400 | `INVALID_PROFILE_ID` | プロフィールIDの形式が不正 |
| 404 | `NOT_FOUND` | リソースが存在しない |
| 413 | `REQUEST_TOO_LARGE` | リクエストボディが 100KB を超過 |
| 500 | `INTERNAL_ERROR` | サーバー内部エラー |

<!-- prettier-ignore-end -->

### 注意

プロフィールIDは mym-xxxxxxxx 形式なので、GET/PATCH/DELETE する際はまず POST で作成してから使ってください。
