# 体験談カードの動的データ取得実装

## 概要
トップページおよび詳細ページの体験談カード（TweetCard）を、Googleフォームの実データから動的に取得するように実装しました。

## 実装した機能

### 1. GAS（Google Apps Script）の新規エンドポイント

#### `getExperiencesByQuestion` 関数
特定の質問項目から承認済みの体験談を取得する関数を追加しました。

**パラメータ:**
- `questionId`: 質問ID（例: '2-2', '2-11', '6-1-5'）
- `limit`: 取得件数（デフォルト6件、最新から取得）

**対応する質問ID:**
- `2-2`: F列 - 詳しい状況（不登校のきっかけ）
- `2-11`: O列 - 学校との繋がり（不登校初期の対応）
- `4-1-3`: V列 - 進路1の選んだ理由
- `4-2-3`: AB列 - 進路2の選んだ理由
- `4-3-3`: AH列 - 進路3の選んだ理由
- `6-1-5`: AP列 - サポート1の感想
- `6-2-5`: AV列 - サポート2の感想
- `6-3-5`: BB列 - サポート3の感想

**機能:**
- タイムスタンプで降順ソート（最新が先頭）
- 承認済み体験談のみを取得
- 対象列にデータがあるもののみ抽出
- エラーと該当なしを明確に区別

### 2. フロントエンド（React）の実装

#### gasApi.js
`getExperiencesByQuestion` 関数を追加し、GASエンドポイントと通信します。

**戻り値:**
```javascript
{
  data: [],           // 体験談データの配列
  noData: false,      // 該当データなしフラグ
  errorType: null,    // エラータイプ（'FETCH_ERROR'など）
  error: null         // エラーメッセージ
}
```

#### ExperienceSection コンポーネント
動的データ取得に対応しました。

**新しいプロパティ:**
- `questionId`: 質問ID（指定すると動的取得）
- `limit`: 取得件数（デフォルト6件）

**表示状態:**
- ローディング中: 「読み込み中...」
- 取得エラー: 「⚠️ 取得エラー: [エラー内容]」
- 該当なし: 「該当する体験談がまだありません」
- 正常: 体験談カードを表示

## 各セクションの設定

### ホームページ（トップページ）

#### Section00 (Road00)
```javascript
questionId="2-2"  // 不登校のきっかけ（F列）
limit={6}
```

#### Section01 (Road01)
```javascript
questionId="2-11"  // 学校との繋がり（O列）
limit={6}
```

#### Section02 (Road02)
```javascript
questionId="6-1-5"  // 公的支援の感想1（AP列）
limit={6}
```
※注意: 実際には6-1-5, 6-2-5, 6-3-5の3つをまとめて表示したい場合は、後で統合処理が必要

#### Section05 (Road05)
```javascript
questionId="4-1-3"  // 進路1の選んだ理由（V列）
limit={6}
```
※注意: 実際には4-1-3, 4-2-3, 4-3-3の3つをまとめて表示したい場合は、後で統合処理が必要

### 詳細ページ

#### Section00Content (Road00詳細)
```javascript
questionId="2-2"  // 不登校のきっかけ（F列）
最新2件を表示
```

#### Section01Content (Road01詳細)
```javascript
questionId="2-11"  // 不登校初期の対応（O列）
最新2件を表示
```

※「学校の支援制度」セクションは現状のまま（静的データ）

## エラーハンドリング

### 3つの状態を明確に区別
1. **取得エラー** (`errorType` が存在): サーバーエラーやネットワークエラー
2. **該当なし** (`noData` が `true`): データは正常に取得できたが、条件に合う体験談がない
3. **正常**: 体験談データが存在し、正常に表示

### ユーザーへの表示
- **取得エラー**: 赤い背景のエラーメッセージ
- **該当なし**: グレーの背景の情報メッセージ
- **ローディング**: シンプルなテキスト

## CSSスタイル

各コンポーネントに以下のスタイルを追加:
- `.loadingMessage`: ローディング表示
- `.errorMessage`: エラー表示（赤背景）
- `.noDataMessage`: 該当なし表示（グレー背景）

## 使い方

### GASのデプロイ
1. [gas/searchExperiences.gs](../gas/searchExperiences.gs) をGASエディタに更新
2. スプレッドシートIDとシート名を設定
3. Webアプリとしてデプロイ
4. デプロイURLを `.env` ファイルに設定

### .envファイルの設定
```bash
REACT_APP_GAS_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### 動作確認
1. `npm start` でアプリを起動
2. トップページの各セクションで体験談カードが表示されることを確認
3. データがない場合は「該当する体験談がまだありません」と表示
4. エラーが発生した場合は「取得エラー」と表示

## 今後の拡張

### Road02の複数列統合
現在は6-1-5のみ取得していますが、6-1-5, 6-2-5, 6-3-5の3つをまとめて取得したい場合:

**方法1**: GASで複数列を統合する新しい関数を作成
**方法2**: フロントエンドで3回APIを呼び出して統合

### Road05の複数列統合
現在は4-1-3のみ取得していますが、4-1-3, 4-2-3, 4-3-3の3つをまとめて取得したい場合も同様に統合処理が必要

## ファイル一覧

### 更新したファイル
- `gas/searchExperiences.gs`: 新規エンドポイント追加
- `src/config/gasConfig.js`: エンドポイント設定追加
- `src/utils/gasApi.js`: API関数追加
- `src/components/common/ExperienceSection/ExperienceSection.js`: 動的取得対応
- `src/components/common/ExperienceSection/ExperienceSection.module.css`: スタイル追加
- `src/components/MainContent/home/Section00.js`: questionId追加
- `src/components/MainContent/home/Section01.js`: questionId追加
- `src/components/MainContent/home/Section02.js`: questionId追加
- `src/components/MainContent/home/Section05.js`: questionId追加
- `src/components/MainContent/00/Section00Content.js`: 動的取得実装
- `src/components/MainContent/00/Section00Content.module.css`: スタイル追加
- `src/components/MainContent/01/Section01Content.js`: 動的取得実装
- `src/components/MainContent/01/Section01Content.module.css`: スタイル追加

## 注意事項

1. **承認ステータス**: BG列（58列目）が「承認済み」のデータのみ表示されます
2. **データの順序**: タイムスタンプの新しい順に並びます
3. **空データ**: 対象列が空の行は除外されます
4. **リンク**: カードをクリックすると詳細ページ（`/experiences/{id}`）に遷移します
