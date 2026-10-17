/**
 * Google Apps Script (GAS) - 体験談検索API
 * 
 * このスクリプトをGoogle Apps Scriptエディタにコピーして使用してください。
 * スプレッドシートから体験談データを検索し、Reactアプリに返すWeb APIです。
 */

// スプレッドシートのID（ここに実際のスプレッドシートIDを設定してください）
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// シート名 - Googleフォームの回答シート名に変更してください
const SHEET_NAME = 'フォームの回答 1'; // Googleフォームの回答シート名を設定

/**
 * Web アプリケーションとして公開するためのdoPost関数
 * POSTリクエストを受け付けます
 */
function doPost(e) {
  try {
    // POSTデータを取得
    const params = JSON.parse(e.postData.contents);
    const endpoint = params.endpoint;

    let result;
    
    switch(endpoint) {
      case 'searchExperiences':
        result = searchExperiences(params.keyword, params.filters);
        break;
      case 'getAllExperiences':
        result = getAllExperiences(params.limit);
        break;
      case 'getExperienceById':
        result = getExperienceById(params.id);
        break;
      case 'postExperience':
        result = postExperience(params);
        break;
      case 'getPendingExperiences':
        result = getPendingExperiences();
        break;
      case 'getApprovedExperiences':
        result = getApprovedExperiences();
        break;
      case 'getOnHoldExperiences':
        result = getOnHoldExperiences();
        break;
      case 'approveExperience':
        result = approveExperience(params.id);
        break;
      case 'rejectExperience':
        result = rejectExperience(params.id, params.reason);
        break;
      case 'returnToPending':
        result = returnToPending(params.id);
        break;
      case 'getExperiencesByQuestion':
        result = getExperiencesByQuestion(params.questionId, params.limit);
        break;
      case 'verifyAdmin':
        result = verifyAdmin(params.credential);
        break;
      default:
        result = {
          success: false,
          error: '不正なエンドポイントです'
        };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * OPTIONSリクエストへの対応（CORS プリフライト）
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * フリーワード検索で体験談を取得
 * 承認済みの体験談のみを返します
 * @param {string} keyword - 検索キーワード
 * @param {object} filters - フィルター条件
 * @return {object} - 検索結果
 */
function searchExperiences(keyword, filters = {}) {
  try {
    // テスト環境では常にgetActiveSpreadsheetを使用
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。SHEET_NAMEを確認してください。');
    }
    
    const data = sheet.getDataRange().getValues();
    
    // ヘッダー行（1行目）から列位置を解決する（定義は columns.gs）
    const col = getColumnMap(data[0]);

    // データ行（2行目以降）を検索
    const results = [];
    const keywordLower = keyword.toLowerCase();
    const isWildcardSearch = keyword === '*'; // ワイルドカード検索（全件対象）
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 空行をスキップ
      if (!row[col.authorName] && !row[col.detail]) continue;

      // 承認済みの体験談のみを対象
      const status = row[col.approvalStatus] || '';
      if (status !== '承認済み') continue;
      
      // キーワード検索（全ての記述回答から検索）
      // ワイルドカード検索の場合はキーワードチェックをスキップ
      if (!isWildcardSearch) {
        const searchableText = row.slice(1).join(' ').toLowerCase();
        
        if (!searchableText.includes(keywordLower)) {
          continue;
        }
      }
      

      // フィルター条件の適用
      if (filters && Object.keys(filters).length > 0) {
        let matchFilter = true;
        
        // 学年フィルター
        if (filters.grade && filters.grade.length > 0) {
          const rowGrade = normalizeForCompare_(row[col.grade]);
          if (!filters.grade.some(filterGrade => rowGrade.includes(normalizeForCompare_(filterGrade)))) {
            matchFilter = false;
          }
        }

        // きっかけフィルター（複数選択可能な項目）
        if (filters.trigger && filters.trigger.length > 0) {
          const rowTrigger = normalizeForCompare_(normalizeMultiSelect_(row[col.trigger]));
          // 選択されたフィルターのいずれかが含まれているかチェック
          if (!filters.trigger.some(filterTrigger => rowTrigger.includes(normalizeForCompare_(filterTrigger)))) {
            matchFilter = false;
          }
        }

        // サポートの種類フィルター（3つの列のいずれかに含まれているか）
        if (filters.support && filters.support.length > 0) {
          const support1 = String(row[col.support1Type] || '');
          const support2 = String(row[col.support2Type] || '');
          const support3 = String(row[col.support3Type] || '');
          const allSupports = normalizeForCompare_(support1 + ', ' + support2 + ', ' + support3);

          // 選択されたフィルターのいずれかが含まれているかチェック
          if (!filters.support.some(filterSupport => allSupports.includes(normalizeForCompare_(filterSupport)))) {
            matchFilter = false;
          }
        }
        
        // 時期フィルター（各時期に記述があるかチェック）
        if (filters.period && filters.period.length > 0) {
          let hasPeriodContent = false;
          
          filters.period.forEach(periodType => {
            let content = '';
            
            // 時期の種類に応じて対応する列を確認
            if (periodType === '登校渋り期') {
              content = String(row[col.detail] || ''); // 2-2 なりはじめの頃の状態
            } else if (periodType === '混乱期') {
              content = String(row[col.q2_8] || ''); // 2-8 一番つらかった時期
            } else if (periodType === '安定期') {
              content = String(row[col.q2_9] || ''); // 2-9 改善のきっかけ
            } else if (periodType === '回復期') {
              content = String(row[col.q2_10] || ''); // 2-10 さらなる改善
            }
            
            // その時期の内容が存在すれば、この体験談を含める
            if (content && content.trim().length > 0) {
              hasPeriodContent = true;
            }
          });
          
          if (!hasPeriodContent) {
            matchFilter = false;
          }
        }
        
        if (!matchFilter) continue;
      }
      
      // 時期フィルターが適用されている場合、該当する時期の内容をdescriptionとして使用
      let description = String(row[col.detail] || ''); // デフォルトは2-2 なりはじめの頃の状態
      let title = '';

      if (filters.period && filters.period.length > 0) {
        const periodType = filters.period[0]; // 時期フィルターは1つのみ選択可能

        if (periodType === '登校渋り期') {
          description = String(row[col.detail] || ''); // 2-2 なりはじめの頃の状態
        } else if (periodType === '混乱期') {
          description = String(row[col.q2_8] || ''); // 2-8 一番つらかった時期
        } else if (periodType === '安定期') {
          description = String(row[col.q2_9] || ''); // 2-9 改善のきっかけ
        } else if (periodType === '回復期') {
          description = String(row[col.q2_10] || ''); // 2-10 さらなる改善
        }
      }
      
      // タイトルを生成（descriptionの最初の50文字）
      title = description.substring(0, 50) + '...';
      
      // 結果に追加
      results.push({
        id: i,  // 配列インデックス（data[1]から開始なのでid=1）
        title: title,
        description: description,
        authorName: row[col.authorName] || '匿名',
        authorInitial: getInitial(row[col.authorName]),
        date: formatDate(row[col.timestamp]),
        grade: row[col.grade],
        trigger: normalizeMultiSelect_(row[col.trigger]),
        support: [row[col.support1Type], row[col.support2Type], row[col.support3Type]].filter(s => s).join(', ')
      });
    }
    
    return {
      success: true,
      data: results,
      count: results.length
    };
    
  } catch (error) {
    Logger.log('Search Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * すべての体験談を取得（ピックアップ用）
 * 承認済みの体験談のみを返します
 * @param {number} limit - 取得件数の上限
 * @return {object} - 体験談データ
 */
function getAllExperiences(limit = null) {
  try {
    // テスト環境では常にgetActiveSpreadsheetを使用
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。SHEET_NAMEを確認してください。');
    }
    
    const data = sheet.getDataRange().getValues();
    
    // ヘッダー行（1行目）から列位置を解決する（定義は columns.gs）
    const col = getColumnMap(data[0]);

    const dataRows = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      if (!row[col.authorName] && !row[col.detail]) continue;

      // 承認済みの体験談のみを取得
      const status = row[col.approvalStatus] || '';
      if (status !== '承認済み') continue;

      dataRows.push({
        row: row,
        timestamp: row[col.timestamp] ? new Date(row[col.timestamp]) : new Date(0),
        dataIndex: i  // data配列のインデックス（data[1]から開始なのでid=1）
      });
    }

    // タイムスタンプで降順ソート（最新が先頭）
    dataRows.sort((a, b) => b.timestamp - a.timestamp);

    // limit件数まで取得
    const limitedRows = limit ? dataRows.slice(0, limit) : dataRows;

    const results = limitedRows.map(({ row, dataIndex }) => {
      // タイトルを生成（なりはじめの頃の状態の最初の50文字）
      const title = String(row[col.detail] || '').substring(0, 50) + '...';

      // 学校情報を配列化
      const schools = buildSchools_(row, col);

      // サポート情報を配列化
      const supports = buildSupports_(row, col);

      return {
        id: dataIndex,  // 配列インデックス（data[1]から開始なのでid=1）
        title: title,
        description: String(row[col.detail] || ''),
        authorName: row[col.authorName] || '匿名',
        authorInitial: getInitial(row[col.authorName]),
        date: formatDate(row[col.timestamp]),
        birthYear: String(row[col.birthYear] || ''),
        grade: row[col.grade],
        family: row[col.family],
        trigger: normalizeMultiSelect_(row[col.trigger]),
        schools: schools,  // 学校情報を追加
        supports: supports  // サポート情報を追加
      };
    });

    return {
      success: true,
      data: results,
      count: results.length
    };
    
  } catch (error) {
    Logger.log('Get All Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * ヘルパー関数: 学校情報（最大3校）を配列にまとめる
 * 学校名が入力されているものだけを返す
 * @param {Array} row - データ行
 * @param {object} col - 列マップ
 * @return {Array} - 学校情報の配列
 */
function buildSchools_(row, col) {
  return [1, 2, 3].map(n => ({
    name: row[col['school' + n + 'Name']] || '',
    reason: String(row[col['school' + n + 'Reason']] || ''),  // 選んだ理由
    review: String(row[col['school' + n + 'Review']] || ''),  // 感想
    cost: String(row[col['school' + n + 'Cost']] || '')       // 費用
  })).filter(s => s.name);
}

/**
 * ヘルパー関数: サポート情報（最大3つ）を配列にまとめる
 * 種類が入力されているものだけを返す
 * @param {Array} row - データ行
 * @param {object} col - 列マップ
 * @return {Array} - サポート情報の配列
 */
function buildSupports_(row, col) {
  return [1, 2, 3].map(n => ({
    type: row[col['support' + n + 'Type']] || '',
    name: String(row[col['support' + n + 'Detail']] || ''),      // 名称
    frequency: String(row[col['support' + n + 'Freq']] || ''),   // 利用期間・回数
    reason: String(row[col['support' + n + 'Reason']] || ''),    // 利用きっかけ
    feeling: String(row[col['support' + n + 'Feeling']] || '')   // 感想
  })).filter(s => s.type);
}

/**
 * IDで特定の体験談を取得（全データを返す）
 * @param {number} id - 体験談のID（行番号）
 * @return {object} - 体験談データ
 */
function getExperienceById(id) {
  try {
    // テスト環境では常にgetActiveSpreadsheetを使用
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。SHEET_NAMEを確認してください。');
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // IDは配列インデックスに対応（data[1]がid=1）
    const dataIndex = parseInt(id);
    
    if (dataIndex < 1 || dataIndex >= data.length) {
      return {
        success: false,
        error: '指定されたIDの体験談が見つかりません'
      };
    }
    
    const row = data[dataIndex];

    // ヘッダー行（1行目）から列位置を解決する（定義は columns.gs）
    const col = getColumnMap(headers);

    // タイトルを生成（2-2 なりはじめの頃の状態から）
    const title = String(row[col.detail] || '').substring(0, 50) + '...';

    return {
      success: true,
      data: {
        id: dataIndex,
        title: title,

        // 基本情報（セクション1）
        timestamp: row[col.timestamp],
        authorName: row[col.authorName] || '匿名',
        authorInitial: getInitial(row[col.authorName]),
        date: formatDate(row[col.timestamp]),
        birthYear: String(row[col.birthYear] || ''),            // 1-3 本人の生まれた年
        grade: row[col.grade] || '',                            // 1-4 初めて不登校になった学年
        family: row[col.family] || '',                          // 1-5 家族構成

        // セクション2: 不登校のきっかけ
        trigger: normalizeMultiSelect_(row[col.trigger]),
        detail: String(row[col.detail] || ''),
        description: String(row[col.detail] || ''), // 互換性のため

        // セクション2の続き: 初動と経過
        parentInitialAction: String(row[col.q2_3] || ''),       // 2-3 保護者の初動
        childReaction: String(row[col.q2_4] || ''),             // 2-4 子どもの反応
        schoolResponse: String(row[col.q2_5] || ''),            // 2-5 学校の反応・対応
        initialReflection: String(row[col.q2_6] || ''),         // 2-6 初動の振り返り
        firstMonthLife: String(row[col.q2_7] || ''),            // 2-7 不登校1か月の生活
        hardestTime: String(row[col.q2_8] || ''),               // 2-8 一番つらかった時期
        dailyLifeOverMonth: String(row[col.q2_9] || ''),        // 2-9 改善のきっかけ
        improvementTrigger: String(row[col.q2_10] || ''),       // 2-10 さらなる改善
        schoolConnection: String(row[col.q2_11] || ''),         // 2-11 学校との繋がり
        workImpact: String(row[col.q2_12] || ''),               // 2-12 仕事への影響

        // セクション3: 子どもの成長過程
        elementarySchool: String(row[col.q3_1] || ''),          // 3-1 小学生のころ
        juniorHighSchool: String(row[col.q3_2] || ''),          // 3-2 中学生のころ
        highSchool: String(row[col.q3_3] || ''),                // 3-3 高校生のころ
        alternativeSchool: String(row[col.q3_4] || ''),         // 3-4 中学卒業後の通信制・定時制

        // セクション4: 通信制・定時制の学校情報
        schools: buildSchools_(row, col),

        // セクション5: 行政・民間サポートの有無
        supportUsed: String(row[col.q5_1] || ''),               // 5-1 利用したサポート

        // セクション6: 利用したサポート
        supports: buildSupports_(row, col),

        // サポートの種類（簡易版・互換性のため）
        support: [row[col.support1Type], row[col.support2Type], row[col.support3Type]]
          .filter(s => s).join(', '),

        // セクション7: その他のサポートと今の想い
        otherSupport: String(row[col.q7_1] || ''),              // 7-1 その他のサポート・活動
        currentThoughts: String(row[col.q7_2] || ''),           // 7-2 不登校に対する考え・想い
        message: String(row[col.q7_2] || ''),                   // 互換性のため（7-2と同じ）

        // 管理者用情報
        approvalStatus: row[col.approvalStatus] || '',
        approvalDate: row[col.approvalDate] || '',
        lastEditDate: row[col.lastEditDate] || '',
        approvalCount: row[col.approvalCount] || 0,
        rejectReason: row[col.rejectReason] || '',
        firstSubmitDate: row[col.firstSubmitDate] || '',
        editCount: row[col.editCount] || 0,
        submissionState: row[col.submissionState] || '',
        rejectReasonHistory: row[col.rejectReasonHistory] || ''
      }
    };
    
  } catch (error) {
    Logger.log('Get By ID Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 体験談を投稿（Googleフォーム経由で投稿されるため、このエンドポイントは使用しない）
 * @param {object} experienceData - 投稿データ
 * @return {object} - 投稿結果
 */
function postExperience(experienceData) {
  // Googleフォーム経由で投稿するため、この関数は使用しません
  return {
    success: false,
    message: '体験談の投稿はGoogleフォームをご利用ください'
  };
}

/**
 * ヘルパー関数: 複数選択（チェックボックス）の回答を整える
 *
 * Googleフォームの複数選択は「A, B」のようにカンマ区切りで1セルに記録されますが、
 * 空の選択肢が混ざると「A, B, 」のように末尾へカンマが残ります。
 * 区切り直したうえで空要素を捨て、'A, B' の形に揃えます。
 *
 * @param {*} value - セルの値
 * @return {string} - 整形済みのカンマ区切り文字列
 */
function normalizeMultiSelect_(value) {
  return String(value || '')
    .split(/[,、，]/)
    .map(item => item.trim())
    .filter(item => item)
    .join(', ');
}

/**
 * ヘルパー関数: 絞り込み比較用に文字列を正規化する
 *
 * フロントの選択肢とフォームの選択肢は、見た目が同じでも文字が違うことがあります。
 * 例: 「いじめ／友人関係」(全角スラッシュ U+FF0F) と
 *     「いじめ/友人関係」(半角スラッシュ U+002F) は includes で一致しません。
 * 全角の英数字・記号を半角へ畳み、空白を無視して比較できるようにします。
 *
 * ※ 表示用の値には使いません。比較のときだけ通してください。
 *
 * @param {*} value - 比較したい文字列
 * @return {string} - 正規化後の文字列
 */
function normalizeForCompare_(value) {
  return String(value || '')
    // 全角の英数字・記号（！〜～）を半角へ
    .replace(/[！-～]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    // 半角中点を全角中点へ（「発達特性・体調要因」の表記ゆれ対策）
    .replace(/･/g, '・')
    // 全角スペースを含め、空白はすべて無視する
    .replace(/[\s　]/g, '')
    .toLowerCase();
}

/**
 * ヘルパー関数: 名前のイニシャルを取得
 * @param {string} name - 名前
 * @return {string} - イニシャル
 */
function getInitial(name) {
  if (!name) return 'A';
  return name.charAt(0).toUpperCase();
}

/**
 * ヘルパー関数: 日付を整形
 * @param {Date|string} date - 日付
 * @return {string} - 整形された日付文字列
 */
function formatDate(date) {
  if (!date) return '';
  
  try {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  } catch (error) {
    return String(date);
  }
}

/**
 * フロントエンドから渡される質問ID → 列の内部キー
 *
 * 進路の「選んだ理由」は、2026年のフォーム改訂で 4-x-3 → 4-x-2 に繰り上がりました。
 * 既存のリンクやブックマークが 4-x-3 のまま残っているため、旧番号も同じ列に向けています。
 * サポートの「感想」(6-x-5) は改訂後も番号が変わっていません。
 */
const QUESTION_COLUMN_KEYS = {
  '2-2': 'detail',          // なりはじめの頃の状態
  '2-11': 'q2_11',          // 学校との繋がり

  '4-1-2': 'school1Reason', // 進路1を選んだ理由
  '4-2-2': 'school2Reason', // 進路2を選んだ理由
  '4-3-2': 'school3Reason', // 進路3を選んだ理由

  // 旧番号（改訂前のリンク互換）
  '4-1-3': 'school1Reason',
  '4-2-3': 'school2Reason',
  '4-3-3': 'school3Reason',

  '6-1-5': 'support1Feeling', // サポート1の感想
  '6-2-5': 'support2Feeling', // サポート2の感想
  '6-3-5': 'support3Feeling'  // サポート3の感想
};

/**
 * 特定の質問項目から体験談を取得
 * @param {string} questionId - 質問ID (例: '2-2', '2-11', '6-1-5', '4-1-2')
 * @param {number} limit - 取得件数（デフォルト6件、最新から取得）
 * @return {object} - 検索結果
 */
function getExperiencesByQuestion(questionId, limit = 6) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        error: 'シート「' + SHEET_NAME + '」が見つかりません',
        errorType: 'FETCH_ERROR'
      };
    }
    
    const data = sheet.getDataRange().getValues();

    // ヘッダー行（1行目）から列位置を解決する（定義は columns.gs）
    const col = getColumnMap(data[0]);

    const targetColumnKey = QUESTION_COLUMN_KEYS[questionId];

    if (targetColumnKey === undefined) {
      return {
        success: false,
        error: '不正な質問IDです: ' + questionId,
        errorType: 'INVALID_QUESTION_ID'
      };
    }

    const targetColumnIndex = col[targetColumnKey];

    if (targetColumnIndex < 0) {
      return {
        success: false,
        error: '質問ID「' + questionId + '」に対応する列がシートにありません',
        errorType: 'FETCH_ERROR'
      };
    }

    const results = [];
    
    // データ行を新しい順にソート（タイムスタンプの降順）
    const dataRows = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 空行をスキップ
      if (!row[col.authorName] && !row[targetColumnIndex]) continue;

      // 承認済みの体験談のみを対象
      const status = row[col.approvalStatus] || '';
      if (status !== '承認済み') continue;

      // 対象列にデータがあるもののみ
      const targetContent = String(row[targetColumnIndex] || '').trim();
      if (!targetContent) continue;

      dataRows.push({
        row: row,
        timestamp: row[col.timestamp] ? new Date(row[col.timestamp]) : new Date(0),
        dataIndex: i  // data配列のインデックス（data[1]から開始なのでid=1）
      });
    }
    
    // タイムスタンプで降順ソート（最新が先頭）
    dataRows.sort((a, b) => b.timestamp - a.timestamp);
    
    // limit件数まで取得
    const limitedRows = dataRows.slice(0, limit);
    
    // 該当なしの場合
    if (limitedRows.length === 0) {
      return {
        success: true,
        data: [],
        message: '該当する体験談がありません',
        noData: true
      };
    }
    
    // データを整形
    for (let i = 0; i < limitedRows.length; i++) {
      const item = limitedRows[i];
      const row = item.row;
      const dataIndex = item.dataIndex; // data配列のインデックス（id=dataIndex）
      
      const authorName = String(row[col.authorName] || '匿名');
      const targetContent = String(row[targetColumnIndex] || '');
      
      // タイトルは対象列の内容の最初の50文字
      let title = targetContent.substring(0, 50);
      if (targetContent.length > 50) {
        title += '...';
      }
      
      results.push({
        id: dataIndex,  // 配列インデックス（data[1]から開始なのでid=1）
        title: title,
        description: targetContent,
        text: targetContent,
        authorName: authorName,
        authorInitial: getInitial(authorName),
        date: formatDate(row[col.timestamp]),
        grade: String(row[col.grade] || ''),
        family: String(row[col.family] || ''),
        trigger: normalizeMultiSelect_(row[col.trigger]),
        questionId: questionId
      });
    }
    
    return {
      success: true,
      data: results,
      count: results.length
    };
    
  } catch (error) {
    Logger.log('getExperiencesByQuestion Error: ' + error.toString());
    return {
      success: false,
      error: error.toString(),
      errorType: 'FETCH_ERROR'
    };
  }
}