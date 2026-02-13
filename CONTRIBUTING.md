## 基本方針

- 変更は「小さく」「目的は明確に」
- Issue → PR → Review → Merge の流れを崩さない

## ブランチ運用

- `main`：常にリリース可能（保護ブランチ）
- 作業ブランチ命名：`<type>/<issue番号>-<短い説明>`
  - 例：`feat/123-add-card-share`
  - 例：`fix/88-null-pointer-on-preview`
- 原則：ブランチは短命（48〜72h目安）。長期化する場合は分割する。

## コミットメッセージ規約

フォーマット：
`<emoji> <type>(<scope>): <subject>`

type（絵文字付き）:

- 🎉 init - 初期セットアップ
- ✨ feat - 新機能追加
- 🛠️ fix - バグ修正
- 📝 docs - ドキュメント更新
- ♻️ refactor - リファクタリング
- 🧪 test - テスト追加・修正
- 🧹 chore - その他（設定変更、CI、依存更新など）

例：

- `✨ feat(ui): add font preset selector`
- `🛠️ fix(api): handle empty prompt safely`
- `🧹 chore(ci): bump node to 20`

コミット粒度：

- 「意味のある中間状態」だけコミット（壊れた途中経過はコミットしない）
- フォーマットだけの差分は単独コミットに分離する

## Issue運用（原則：IssueなしPR禁止）

- `docs` / `chore` の軽微な変更のみ例外可
- Issueには Acceptance Criteria（受け入れ条件）を必須で書く

## PR運用（マージ条件）

- CIがすべてGreen
- Review 1件以上
- 差分が大きい場合（目安 ±300行以上）は分割
