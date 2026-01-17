# 認証システム セットアップガイド

## 概要

このガイドでは、Google OAuth 2.0認証と管理者画面のアクセス制限機能のセットアップ手順を説明します。

### システム構成

1. **Google OAuth認証**: ユーザーがGoogleアカウントで本人確認
2. **管理者権限検証**: GAS（Google Apps Script）側で管理者権限をサーバーサイド検証

### セキュリティの仕組み

このシステムは**二段階認証**を実装しています：

- ✅ **Google OAuth**: ユーザーが本当にそのGoogleアカウントの所有者であることを証明
- ✅ **GASバックエンド検証**: サーバー側で管理者権限を検証（フロントエンドでは回避不可能）

**なぜ安全なのか？**
- ❌ フロントエンドのみの制御: ブラウザの開発者ツールで改ざん可能
- ✅ GAS側での検証: サーバー側で権限チェックするため改ざん不可能

---

## 1. Google Cloud Platformでの設定

### 1-1. プロジェクトの作成
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）

### 1-2. OAuth 2.0 認証情報の作成
1. 左メニューから「APIとサービス」→「認証情報」を選択
2. 「認証情報を作成」→「OAuth クライアント ID」をクリック
3. 同意画面の構成（初回のみ）
   - ユーザータイプ: **外部** を選択
   - アプリ名: `web_Fukui` （任意）
   - ユーザーサポートメール: 自分のメールアドレス
   - デベロッパーの連絡先情報: 自分のメールアドレス
   - 「保存して次へ」をクリック
   - スコープは追加不要（デフォルトのまま）
   - テストユーザーを追加（必要に応じて）

4. OAuth クライアント ID の作成
   - アプリケーションの種類: **ウェブ アプリケーション**
   - 名前: `web_Fukui OAuth Client` （任意）
   - 承認済みの JavaScript 生成元:
     ```
     http://localhost:3000
     ```
     **注意**: パスを含めることはできません（`/web_Fukui`は不要）
     
   - 承認済みのリダイレクト URI:
     ```
     http://localhost:3000
     http://localhost:3000/web_Fukui
     http://localhost:3000/web_Fukui/login
     ```
     **注意**: こちらはパスを含めることができます
     
   - 「作成」をクリック

5. **クライアント ID** が表示されるのでコピー

### 1-3. 本番環境用の設定（GitHub Pages）
本番デプロイ時には、以下も追加：

- **承認済みの JavaScript 生成元**:
  ```
  https://yr04491.github.io
  ```
  **重要**: ドメインのみを指定します。パス（`/web_Fukui`）を含めると「無効な生成元」エラーになります。
  
- **承認済みのリダイレクト URI**:
  ```
  https://yr04491.github.io/web_Fukui
  https://yr04491.github.io/web_Fukui/login
  ```
  **注意**: こちらはパスを含めることができます。具体的なリダイレクト先を指定してください。

## 2. 環境変数の設定

### 2-1. 環境変数ファイルの作成
プロジェクトのルートディレクトリに `.env` ファイルを作成（既にある場合はスキップ）：

```bash
cp .env.example .env
```

### 2-2. 環境変数の設定
`.env` ファイルを開いて、以下の情報を設定：

```bash
# Google OAuth 2.0 設定
# Google Cloud Consoleで取得したClient IDを設定
REACT_APP_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Google Apps Script API URL
# GASをウェブアプリケーションとしてデプロイした後のURLを設定
REACT_APP_GAS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# 管理者のメールアドレス（カンマ区切りで複数指定可能）
REACT_APP_ADMIN_EMAILS=admin@example.com,manager@example.com
```

**設定例**:

```bash
REACT_APP_GOOGLE_CLIENT_ID=523999293717-xxxxxxxxxx.apps.googleusercontent.com
REACT_APP_GAS_API_URL=https://script.google.com/macros/s/AKfycbxxxxxx/exec
REACT_APP_ADMIN_EMAILS=fukui.admin@gmail.com,manager@example.com
```

**重要**: 
- `REACT_APP_ADMIN_EMAILS`には実際の管理者のGoogleアカウントのメールアドレスを設定
- 複数の管理者を設定する場合は、カンマで区切る（スペースは入れない）

### 2-3. 開発サーバーの再起動
環境変数を読み込むため、開発サーバーを再起動：

```bash
# サーバーを停止（Ctrl + C）
npm start
```

---

## 3. Google Apps Script (GAS) の設定

### 3-1. adminFunctions.gsの編集

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

**重要**: `.env`ファイルと同じメールアドレスを設定してください。

### 3-2. GASファイルの確認

以下のファイルがGoogle Apps Scriptエディタに正しくアップロードされているか確認：

1. **adminFunctions.gs**
   - `verifyAdmin()` 関数: JWTトークンを検証して管理者判定
   - `decodeJwt()` 関数: JWTトークンをデコード
   - `ADMIN_EMAILS` リスト: 必ず更新すること

2. **searchExperiences.gs**
   - `doPost()` 関数に `case 'verifyAdmin':` が含まれているか確認

### 3-3. GASの再デプロイ

管理者リストを変更したら、必ず再デプロイしてください：

1. Google Apps Scriptエディタで「デプロイ」→「デプロイを管理」をクリック
2. 既存のデプロイの右にある「編集」アイコン（鉛筆マーク）をクリック
3. 「バージョン」を「新バージョン」に変更
4. 「デプロイ」をクリック
5. 新しいURLが表示されたら、`.env`ファイルの`REACT_APP_GAS_API_URL`を更新（URL変更がある場合）

---

## 4. 動作確認

### 4-1. ログインフローのテスト
1. ブラウザで `http://localhost:3000/web_Fukui` を開く
2. フッターの「体験談の投稿」をクリック
3. ログインページにリダイレクトされる
4. 「Googleでログイン」ボタンをクリック
5. Googleアカウントを選択してログイン
6. 投稿ページにリダイレクトされる

### 4-1. ログインフローのテスト
1. ブラウザで `http://localhost:3000/web_Fukui/login` を開く
2. 「Googleでログイン」ボタンをクリック
3. Googleアカウントを選択してログイン
4. 自動的にホーム画面またはリダイレクト先にリダイレクトされる

### 4-2. 管理画面へのアクセステスト

#### ✅ 管理者アカウントでログインした場合

1. `http://localhost:3000/web_Fukui/admin` にアクセス
2. 管理画面が表示される
3. 未承認の体験談の一覧が表示される
4. 承認・却下ボタンが機能する

#### ❌ 管理者以外のアカウントでログインした場合

1. `http://localhost:3000/web_Fukui/admin` にアクセス
2. 「アクセス権限がありません」というメッセージが表示される
3. 管理画面にはアクセスできない

#### 未ログインの場合

1. `http://localhost:3000/web_Fukui/admin` にアクセス
2. 自動的に `/login` ページにリダイレクトされる
3. ログイン後、元の管理画面に戻される

### 4-3. ログアウトのテスト
ブラウザのコンソールから実行可能：
```javascript
localStorage.removeItem('googleUser');
localStorage.removeItem('isAdmin');
window.location.reload();
```

---

## 5. セキュリティ確認

### 5-1. フロントエンドの回避不可能性を確認

試しに、ブラウザのコンソールで以下を実行してみてください：

```javascript
// ローカルストレージに偽の管理者情報を保存
localStorage.setItem('isAdmin', 'true');
// ページをリロード
location.reload();
```

ページをリロードしても、**GAS側で検証されるため、管理画面にはアクセスできません**。
「アクセス権限がありません」と表示されるはずです。

### 5-2. JWTトークンの検証フロー

ログイン時に、以下の流れで検証されます：

1. Google OAuthから受け取ったJWTトークンをGASに送信
2. GAS側でトークンをデコードしてメールアドレスを取得
3. `ADMIN_EMAILS`リストと照合
4. 結果（isAdmin: true/false）をフロントエンドに返す
5. フロントエンドで管理画面へのアクセスを制御

この検証プロセスは**サーバー側（GAS）**で行われるため、ユーザーが改ざんすることはできません。

### 5-3. ログの確認

ブラウザのコンソールで、ログイン成功時に以下のようなログが表示されます：

```
Login successful: { email: "your-email@gmail.com", isAdmin: true }
```

`isAdmin`が`true`の場合のみ、管理画面にアクセスできます。

---

## 6. セキュリティに関する注意事項

### 4-1. .envファイルの管理
- `.env` ファイルは **絶対に Git にコミットしない**
- `.gitignore` に `.env` が含まれていることを確認
- `.env.example` のみをコミット

### 4-2. Client IDの扱い
- Client IDは公開されても問題ありませんが、Client Secret は **絶対に公開しない**
- 今回の実装ではClient Secretは使用していません（フロントエンドのみ）

### 4-3. 本番環境での考慮事項
- GitHub Pagesでデプロイする場合、環境変数は直接埋め込む必要があります
- ビルド時に環境変数を設定：
  ```bash
  REACT_APP_GOOGLE_CLIENT_ID=your_client_id npm run build
  ```

## 6. セキュリティに関する注意事項

### 6-1. .envファイルの管理
- `.env` ファイルは **絶対に Git にコミットしない**
- `.gitignore` に `.env` が含まれていることを確認
- `.env.example` のみをコミット
- 管理者のメールアドレスも公開しない

### 6-2. Client IDの扱い
- Client IDは公開されても問題ありませんが、Client Secret は **絶対に公開しない**
- 今回の実装ではClient Secretは使用していません（フロントエンドのみ）

### 6-3. GAS側の管理者リスト
- `ADMIN_EMAILS`リストは定期的に見直す
- 不要になった管理者アカウントは速やかに削除
- 変更後は必ずGASを再デプロイ

### 6-4. セキュリティのベストプラクティス

✅ **推奨**:
- 管理者リストは最小限の人数に制限
- 定期的にアクセスログを確認（GASの実行ログ）
- テスト用アカウントは本番環境に残さない

❌ **避けるべき**:
- 管理者メールアドレスをGitHubにコミット
- `.env`ファイルを公開リポジトリにプッシュ
- フロントエンドのみで権限チェック

### 6-5. 本番環境での考慮事項
- GitHub Pagesでデプロイする場合、環境変数は直接埋め込む必要があります
- ビルド時に環境変数を設定：
  ```bash
  REACT_APP_GOOGLE_CLIENT_ID=your_client_id \
  REACT_APP_GAS_API_URL=your_gas_url \
  REACT_APP_ADMIN_EMAILS=admin@example.com \
  npm run build
  ```
- または`.env.production`ファイルを作成（`.gitignore`に追加）

---

## 7. トラブルシューティング

### 問題1: ログインできない

**症状**: 「ログインに失敗しました」と表示される

**解決方法**:
- Google Cloud ConsoleでOAuth認証情報が正しく設定されているか確認
- `.env`ファイルの`REACT_APP_GOOGLE_CLIENT_ID`が正しいか確認
- 承認済みのJavaScript生成元とリダイレクトURIが正しく設定されているか確認
- 開発サーバーを再起動

### 問題2: 管理者なのにアクセスできない

**症状**: ログインはできるが「アクセス権限がありません」と表示される

**解決方法**:
1. GAS側の`ADMIN_EMAILS`リストに自分のメールアドレスが含まれているか確認
2. メールアドレスが完全に一致しているか確認（スペースや大文字小文字に注意）
3. GASを再デプロイしたか確認
4. ブラウザのコンソールでログを確認：
   ```javascript
   // 'Login successful: { email: "...", isAdmin: true/false }'
   ```
5. `.env`ファイルの`REACT_APP_GAS_API_URL`が正しいか確認

### 問題3: 「認証を確認中...」のまま進まない

**症状**: ログイン後、ずっとローディング画面が表示される

**解決方法**:
- `.env`ファイルの`REACT_APP_GAS_API_URL`が正しいか確認
- GASがデプロイされているか確認
- ブラウザのコンソールでエラーメッセージを確認
- GASのエラーログを確認（Apps Scriptエディタの「実行数」タブ）
- ネットワークタブでAPIリクエストが成功しているか確認

### 問題4: GAS側でエラーが発生する

**症状**: GASのログに「decodeJwt Error」などが表示される

**解決方法**:
- `verifyAdmin()`関数と`decodeJwt()`関数が正しくコピーされているか確認
- GAS側の`doPost()`関数に`case 'verifyAdmin':`が追加されているか確認
- スクリプトのエラーログを確認
- JWTトークンが正しく渡されているか確認

### エラー: "Invalid Client"
- Client IDが正しく設定されているか確認
- Google Cloud Consoleで承認済みのJavaScript生成元とリダイレクトURIが正しく設定されているか確認

### ログインボタンが表示されない
- ブラウザのコンソールでエラーを確認
- `.env` ファイルが正しく読み込まれているか確認
  ```javascript
  console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);
  ```

### ログイン後にリダイレクトされない
- ブラウザのコンソールでエラーを確認
- ネットワークタブで認証リクエストが成功しているか確認

---

## 8. 管理者の追加・削除

### 管理者を追加する場合

1. **GAS側**: `gas/adminFunctions.gs`の`ADMIN_EMAILS`配列に新しいメールアドレスを追加
   ```javascript
   const ADMIN_EMAILS = [
     'admin@example.com',
     'new-admin@example.com'  // 追加
   ];
   ```

2. **フロントエンド側**: `.env`ファイルに追加（フォールバック用）
   ```bash
   REACT_APP_ADMIN_EMAILS=admin@example.com,new-admin@example.com
   ```

3. GASを再デプロイ

4. 新しい管理者にGoogleアカウントでログインしてもらう

5. 動作確認

### 管理者を削除する場合

1. `gas/adminFunctions.gs`の`ADMIN_EMAILS`配列から該当のメールアドレスを削除
2. `.env`ファイルからも削除
3. GASを再デプロイ
4. 該当ユーザーをログアウトさせる（必要に応じて）

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

### Q5: 管理者のアクセスログを確認する方法は？

A: GASの「実行数」タブで、`verifyAdmin`関数のログを確認できます。誰がいつアクセスしたかログに記録されています。

### Q6: OAuth認証とは何ですか？

A: OAuthは、パスワードを共有せずに、他のアプリケーションに権限を与えるための認証プロトコルです。Googleアカウントでログインすることで、ユーザーの身元を安全に確認できます。

---

## 10. システム構成

### フロントエンド (React)

- **index.js**: `GoogleOAuthProvider`と`AuthProvider`でアプリ全体をラップ
- **AuthContext.js**: 認証状態を管理、GAS側で管理者検証を実行
- **LoginPage.js**: Googleログインボタンを表示
- **ProtectedRoute.js**: 認証が必要なページを保護
- **AdminProtectedRoute.js**: 管理者専用ページを保護
- **App.js**: `/admin`と`/admin/experience/:id`ルートに保護を適用

### バックエンド (GAS)

- **adminFunctions.gs**:
  - `ADMIN_EMAILS`: 管理者メールアドレスのリスト
  - `verifyAdmin()`: JWTトークンを検証して管理者かどうか判定
  - `decodeJwt()`: JWTトークンをデコード
  - 体験談の承認・却下機能

- **searchExperiences.gs**:
  - `doPost()`: 各種エンドポイントのルーティング
  - `verifyAdmin`エンドポイントを含む

### API通信 (gasApi.js)

- `verifyAdmin()`: GASに管理者検証リクエストを送信
- その他の体験談取得・検索APIも含む

---

## 11. まとめ

✅ 完了チェックリスト:
- [ ] Google Cloud ConsoleでOAuth 2.0認証情報を作成
- [ ] `.env`ファイルで全ての環境変数を設定
  - `REACT_APP_GOOGLE_CLIENT_ID`
  - `REACT_APP_GAS_API_URL`
  - `REACT_APP_ADMIN_EMAILS`
- [ ] GAS側の`ADMIN_EMAILS`配列を更新
- [ ] GASを再デプロイ
- [ ] 開発サーバーを再起動
- [ ] 管理者アカウントでログインできることを確認
- [ ] 管理者以外のアカウントでアクセス拒否されることを確認
- [ ] 未ログイン時にログインページへリダイレクトされることを確認
- [ ] 本番環境用の承認済みURLを追加（デプロイ時）

このセットアップが完了すると：
- ユーザーはGoogleアカウントでログインできる
- 管理画面へのアクセスが安全に制限される
- 承認された管理者のみが体験談の管理を行える
- セキュリティが確保される（フロントエンドでの改ざん不可能）

---

## サポート

問題が解決しない場合は、以下を確認してください：

1. ブラウザのコンソールログ（F12を押して「Console」タブ）
2. GASの実行ログ（Apps Scriptエディタの「実行数」タブ）
3. ネットワークタブでAPIリクエストが正常に送信されているか
4. `.env`ファイルが正しく読み込まれているか

それでも解決しない場合は、エラーメッセージとともに開発者に相談してください。
