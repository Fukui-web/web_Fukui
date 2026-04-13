# 管理者認証セットアップ（Google OAuth + GAS）

このドキュメントは、管理者認証の設定と GitHub Pages デプロイ時の環境変数設定を最短で確認できる手順書です。

## 1. 仕組み

管理者判定は次の2段階です。

1. Google OAuth でログイン
2. GAS 側で管理者メールアドレスを照合（サーバー側判定）

フロントエンドだけの判定ではなく、GAS 側で最終判定するため、改ざん耐性があります。

## 2. ローカル開発の設定

プロジェクトルートの [.env](.env) に次を設定します。

```dotenv
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GAS_API_URL=https://script.google.com/macros/s/xxxx/exec
REACT_APP_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

注意点:

1. `REACT_APP_ADMIN_EMAILS` はカンマ区切り、空白なし
2. URL の末尾に空白を入れない
3. `.env` を変更したら `npm start` を再起動

## 3. GAS 側の設定

1. [gas/adminFunctions.gs](gas/adminFunctions.gs) の `ADMIN_EMAILS` を更新
2. [gas/searchExperiences.gs](gas/searchExperiences.gs) に `verifyAdmin` の処理があることを確認
3. Apps Script で再デプロイ

再デプロイ手順:

1. デプロイ → デプロイを管理
2. 既存デプロイを編集
3. バージョンを「新バージョン」にしてデプロイ

## 4. GitHub Pages デプロイ設定

このリポジトリは [.github/workflows/deploy.yml](.github/workflows/deploy.yml) で `master` への push 時にビルドされます。

`Build` ステップで以下を参照するため、GitHub Secrets の登録が必須です。

1. `REACT_APP_GAS_API_URL`
2. `REACT_APP_GOOGLE_CLIENT_ID`
3. `REACT_APP_ADMIN_EMAILS`

設定場所:

1. GitHub リポジトリ → Settings
2. Secrets and variables → Actions
3. Repository secrets に上記3つを追加

補足:

1. Secrets を更新しただけでは反映されません
2. `master` に新しい commit を push して再ビルドが必要です

## 5. 動作確認

1. 管理者アカウントでログイン
2. `/admin` にアクセスできることを確認
3. 管理者以外のアカウントで `/admin` が拒否されることを確認

## 6. よくあるトラブル

1. `Failed to fetch` / CORS エラー
原因: GAS URL 誤り、GAS 未再デプロイ、URL末尾空白
対応: URL修正、再デプロイ、ブラウザ再読み込み

2. 管理者なのに入れない
原因: GAS 側 `ADMIN_EMAILS` 未更新 or メール不一致
対応: GAS のメール一覧を修正し再デプロイ

3. GitHub 上で更新されない
原因: `master` に commit が無い、または Actions 失敗
対応: Actions タブで失敗ログを確認し再 push

## 7. チェックリスト

1. [.env](.env) に3項目を設定
2. [gas/adminFunctions.gs](gas/adminFunctions.gs) の管理者メールを更新
3. GAS を再デプロイ
4. GitHub Repository secrets に3項目を設定
5. `master` に push して Actions 成功を確認
