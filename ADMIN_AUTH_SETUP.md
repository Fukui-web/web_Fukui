# 管理者認証システム セットアップガイド

## 概要

このガイドでは、Google OAuth認証を使用した管理者画面のアクセス制限機能のセットアップ手順を説明します。

## セキュリティの仕組み

このシステムは**二段階認証**を実装しています：

1. **Google OAuth認証**: ユーザーがGoogleアカウントで本人確認
2. **GASバックエンド検証**: サーバー側で管理者権限を検証（フロントエンドでは回避不可能）

### なぜ安全なのか？

- ❌ **フロントエンドのみの制御**: ブラウザの開発者ツールで改ざん可能
- ✅ **GAS側での検証**: サーバー側で権限チェックするため改ざん不可能

---

## 前提条件

- Google Cloud Platformでプロジェクトを作成済み
- Google OAuth 2.0の設定が完了していること（[OAUTH_SETUP.md](OAUTH_SETUP.md)を参照）
- Google Apps Scriptのセットアップが完了していること（[GAS_SETUP.md](GAS_SETUP.md)を参照）
- `@react-oauth/google`パッケージがインストール済み

---

## 1. 環境変数の設定

### 1-1. .envファイルの編集

プロジェクトルートの`.env`ファイルを開き、管理者のメールアドレスを設定します：

```bash
# Google OAuth 2.0 設定
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

# Google Apps Script API URL
REACT_APP_GAS_API_URL=your-gas-api-url

# 管理者のメールアドレス（カンマ区切りで複数指定可能）
REACT_APP_ADMIN_EMAILS=admin@example.com,manager@example.com
```

**重要**: 
- 実際の管理者のGoogleアカウントのメールアドレスに変更してください
- 複数の管理者を設定する場合は、カンマで区切って指定します
- スペースは入れないでください

### 1-2. .envファイルの例

```bash
REACT_APP_GOOGLE_CLIENT_ID=523999293717-xxxxxxxxxx.apps.googleusercontent.com
REACT_APP_GAS_API_URL=https://script.google.com/macros/s/AKfycbxxxxxx/exec
REACT_APP_ADMIN_EMAILS=fukui.admin@gmail.com,manager@example.com
```

---

## 2. Google Apps Script (GAS) の設定

### 2-1. adminFunctions.gsの編集

`gas/adminFunctions.gs`ファイルを開き、`ADMIN_EMAILS`配列を編集します：

```javascript
// 管理者メールアドレスのリスト（実際のメールアドレスに変更してください）
const ADMIN_EMAILS = [
  'admin@example.com',
  'manager@example.com'
  // 必要に応じて追加
];
```

**変更例**:

```javascript
const ADMIN_EMAILS = [
  'fukui.admin@gmail.com',
  'manager@example.com',
  'sub.admin@gmail.com'
];
```

### 2-2. GASファイルの更新

以下のファイルをGoogle Apps Scriptエディタにコピーして更新してください：

1. **adminFunctions.gs**
   - `verifyAdmin()` 関数が追加されています
   - `decodeJwt()` 関数が追加されています
   - `ADMIN_EMAILS` リストを必ず更新してください

2. **searchExperiences.gs**
   - `doPost()` 関数に `verifyAdmin` ケースが追加されています

### 2-3. GASの再デプロイ

1. Google Apps Scriptエディタで「デプロイ」→「デプロイを管理」をクリック
2. 既存のデプロイの右にある「編集」アイコン（鉛筆マーク）をクリック
3. 「バージョン」を「新バージョン」に変更
4. 「デプロイ」をクリック

**重要**: コードを変更したら必ず再デプロイしてください。

---

## 3. 動作確認

### 3-1. 開発サーバーの起動

環境変数を変更した場合は、開発サーバーを再起動してください：

```bash
# 既存のサーバーを停止（Ctrl + C）
# 再起動
npm start
```

### 3-2. ログイン機能のテスト

1. ブラウザで `http://localhost:3000/web_Fukui/login` にアクセス
2. 「Googleでログイン」ボタンをクリック
3. 管理者として設定したGoogleアカウントでログイン
4. 自動的にホーム画面またはリダイレクト先にリダイレクトされることを確認

### 3-3. 管理画面へのアクセステスト

#### ✅ 管理者アカウントでログインした場合

1. `http://localhost:3000/web_Fukui/admin` にアクセス
2. 管理画面が表示される
3. 体験談の承認・却下ができる

#### ❌ 管理者以外のアカウントでログインした場合

1. `http://localhost:3000/web_Fukui/admin` にアクセス
2. 「アクセス権限がありません」というメッセージが表示される
3. 管理画面にはアクセスできない

#### 未ログインの場合

1. `http://localhost:3000/web_Fukui/admin` にアクセス
2. 自動的に `/login` ページにリダイレクトされる
3. ログイン後、元の管理画面に戻される

---

## 4. セキュリティ確認

### 4-1. フロントエンドの回避不可能性を確認

試しに、ブラウザのコンソールで以下を実行してみてください：

```javascript
// ローカルストレージに偽の管理者情報を保存
localStorage.setItem('isAdmin', 'true');
```

ページをリロードしても、**GAS側で検証されるため、管理画面にはアクセスできません**。

### 4-2. JWTトークンの検証

ログイン時に、以下の流れで検証されます：

1. Google OAuthから受け取ったJWTトークンをGASに送信
2. GAS側でトークンをデコードしてメールアドレスを取得
3. `ADMIN_EMAILS`リストと照合
4. 結果をフロントエンドに返す

この検証プロセスは**サーバー側（GAS）**で行われるため、ユーザーが改ざんすることはできません。

---

## 5. トラブルシューティング

### 問題1: ログインできない

**症状**: 「ログインに失敗しました」と表示される

**解決方法**:
- Google Cloud ConsoleでOAuth認証情報が正しく設定されているか確認
- `.env`ファイルの`REACT_APP_GOOGLE_CLIENT_ID`が正しいか確認
- 開発サーバーを再起動

### 問題2: 管理者なのにアクセスできない

**症状**: ログインはできるが「アクセス権限がありません」と表示される

**解決方法**:
1. GAS側の`ADMIN_EMAILS`リストに自分のメールアドレスが含まれているか確認
2. メールアドレスが完全に一致しているか確認（スペースや大文字小文字に注意）
3. GASを再デプロイしたか確認
4. ブラウザのコンソールでログを確認：
   ```javascript
   // AuthContext.jsのlogin関数で出力されるログ
   // 'Login successful: { email: "...", isAdmin: true/false }'
   ```

### 問題3: 「認証を確認中...」のまま進まない

**症状**: ログイン後、ずっとローディング画面が表示される

**解決方法**:
- `.env`ファイルの`REACT_APP_GAS_API_URL`が正しいか確認
- GASがデプロイされているか確認
- ブラウザのコンソールでエラーメッセージを確認
- GASのエラーログを確認（Apps Scriptエディタの「実行数」タブ）

### 問題4: GAS側でエラーが発生する

**症状**: GASのログに「decodeJwt Error」などが表示される

**解決方法**:
- `verifyAdmin()`関数と`decodeJwt()`関数が正しくコピーされているか確認
- GAS側の`doPost()`関数に`case 'verifyAdmin':`が追加されているか確認
- スクリプトのエラーログを確認

---

## 6. 本番環境へのデプロイ

### 6-1. GitHub Pagesでの設定

1. `.env.production`ファイルを作成（`.gitignore`で除外されるため安全）:
   ```bash
   REACT_APP_GOOGLE_CLIENT_ID=your-production-client-id
   REACT_APP_GAS_API_URL=your-gas-api-url
   REACT_APP_ADMIN_EMAILS=admin@example.com
   ```

2. Google Cloud Consoleで本番URLを追加:
   - 承認済みのJavaScript生成元: `https://yr04491.github.io`
   - 承認済みのリダイレクトURI: `https://yr04491.github.io/web_Fukui/login`

3. ビルドしてデプロイ:
   ```bash
   npm run build
   npm run deploy
   ```

### 6-2. セキュリティのベストプラクティス

✅ **推奨**:
- `.env`ファイルを`.gitignore`に含める（既に設定済み）
- GAS側の`ADMIN_EMAILS`を定期的に見直す
- 不要になった管理者アカウントは速やかに削除

❌ **避けるべき**:
- 管理者メールアドレスをGitHubにコミットしない
- `.env`ファイルを公開リポジトリにプッシュしない
- テスト用のメールアドレスを本番環境に残さない

---

## 7. 管理者の追加・削除

### 管理者を追加する場合

1. **GAS側**: `ADMIN_EMAILS`配列に新しいメールアドレスを追加
   ```javascript
   const ADMIN_EMAILS = [
     'admin@example.com',
     'new-admin@example.com'  // 追加
   ];
   ```

2. **フロントエンド側**: `.env`ファイルに追加（オプション、フォールバック用）
   ```bash
   REACT_APP_ADMIN_EMAILS=admin@example.com,new-admin@example.com
   ```

3. GASを再デプロイ

4. 新しい管理者にGoogleアカウントでログインしてもらう

### 管理者を削除する場合

1. `ADMIN_EMAILS`配列から該当のメールアドレスを削除
2. GASを再デプロイ
3. 該当ユーザーはログアウトさせる（必要に応じて）

---

## 8. システム構成

### フロントエンド (React)

- **index.js**: `GoogleOAuthProvider`と`AuthProvider`でアプリ全体をラップ
- **AuthContext.js**: 認証状態を管理、GAS側で管理者検証
- **LoginPage.js**: Googleログインボタンを表示
- **AdminProtectedRoute.js**: 管理者専用ルートを保護
- **App.js**: `/admin`と`/admin/experience/:id`ルートに保護を適用

### バックエンド (GAS)

- **adminFunctions.gs**:
  - `ADMIN_EMAILS`: 管理者リスト
  - `verifyAdmin()`: JWTトークンを検証して管理者かどうか判定
  - `decodeJwt()`: JWTトークンをデコード

- **searchExperiences.gs**:
  - `doPost()`: `verifyAdmin`エンドポイントを追加

### API通信 (gasApi.js)

- `verifyAdmin()`: GASに管理者検証リクエストを送信

---

## 9. よくある質問 (FAQ)

### Q1: フロントエンドだけで制御するのでは不十分ですか？

A: はい、不十分です。フロントエンドのコードはブラウザで実行されるため、技術的に詳しい人なら開発者ツールを使って改ざんできます。GAS側での検証により、サーバーサイドで権限チェックが行われるため安全です。

### Q2: Google Workspaceの`hd`パラメータとの違いは？

A: Google Workspaceの`hd`（hosted domain）は、特定のドメイン全体（例: `@company.com`）のユーザーを制限しますが、無料のGmailアカウントでは使用できません。このシステムは個人単位で管理者を指定できます。

### Q3: 管理者リストはいくつまで設定できますか？

A: 技術的な制限はありませんが、管理しやすい人数（5-10人程度）を推奨します。

### Q4: ログイン状態はどのくらい持続しますか？

A: ローカルストレージに保存されるため、ブラウザを閉じても持続します。ただし、明示的にログアウトするか、ローカルストレージをクリアすると削除されます。

### Q5: 管理者が不正にログインできないか確認する方法は？

A: GASの「実行数」タブで、`verifyAdmin`関数のログを確認できます。誰がいつアクセスしたかログに記録されています。

---

## 10. まとめ

✅ 完了チェックリスト:
- [ ] `.env`ファイルで`REACT_APP_ADMIN_EMAILS`を設定
- [ ] GAS側の`ADMIN_EMAILS`配列を更新
- [ ] GASを再デプロイ
- [ ] 開発サーバーを再起動
- [ ] 管理者アカウントでログインできることを確認
- [ ] 管理者以外のアカウントでアクセス拒否されることを確認
- [ ] 未ログイン時にログインページへリダイレクトされることを確認

このセットアップが完了すると、管理画面へのアクセスが安全に制限され、承認された管理者のみが体験談の管理を行えるようになります。

---

## サポート

問題が解決しない場合は、以下を確認してください：

1. ブラウザのコンソールログ（F12を押して確認）
2. GASの実行ログ（Apps Scriptエディタの「実行数」タブ）
3. ネットワークタブでAPIリクエストが正常に送信されているか

それでも解決しない場合は、エラーメッセージとともに開発者に相談してください。
