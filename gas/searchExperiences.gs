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
      case 'approveExperience':
        result = approveExperience(params.id);
        break;
      case 'rejectExperience':
        result = rejectExperience(params.id, params.reason);
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
    
    // ヘッダー行を取得（1行目）- スプレッドシートの実際の列名
    const headers = data[0];
    const timestampIndex = 0; // A列: タイムスタンプ
    const authorNameIndex = 1; // B列: 1-2ペンネーム
    const gradeIndex = 2; // C列: 1-3初めて不登校になった学年
    const familyIndex = 3; // D列: 1-4家族構成
    const triggerIndex = 4; // E列: 2-1不登校になったきっかけ（複数選択可）
    const detailIndex = 5; // F列: 2-2詳しい状況
    const q2_8Index = 11;        // L列: 2-8 一番つらかった時期（混乱期）
    const q2_9Index = 12;        // M列: 2-9 不登校1ヶ月以上の過ごし方（安定期）
    const q2_10Index = 13;       // N列: 2-10 改善のきっかけ（回復期）
    const support1Index = 37; // AL列: 6-1-1サポートの種類
    const support2Index = 43; // AR列: 6-2-1サポートの種類
    const support3Index = 49; // AX列: 6-3-1サポートの種類
    const approvalStatusIndex = 58; // BG列: 承認ステータス
    
    // データ行（2行目以降）を検索
    const results = [];
    const keywordLower = keyword.toLowerCase();
    const isWildcardSearch = keyword === '*'; // ワイルドカード検索（全件対象）
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 空行をスキップ
      if (!row[authorNameIndex] && !row[detailIndex]) continue;
      
      // 承認済みの体験談のみを対象
      const status = row[approvalStatusIndex] || '';
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
          const rowGrade = String(row[gradeIndex] || '');
          if (!filters.grade.some(filterGrade => rowGrade.includes(filterGrade))) {
            matchFilter = false;
          }
        }
        
        // きっかけフィルター（複数選択可能な項目）
        if (filters.trigger && filters.trigger.length > 0) {
          const rowTrigger = String(row[triggerIndex] || '');
          // 選択されたフィルターのいずれかが含まれているかチェック
          if (!filters.trigger.some(filterTrigger => rowTrigger.includes(filterTrigger))) {
            matchFilter = false;
          }
        }
        
        // サポートの種類フィルター（3つの列のいずれかに含まれているか）
        if (filters.support && filters.support.length > 0) {
          const support1 = String(row[support1Index] || '');
          const support2 = String(row[support2Index] || '');
          const support3 = String(row[support3Index] || '');
          const allSupports = support1 + ', ' + support2 + ', ' + support3;
          
          // 選択されたフィルターのいずれかが含まれているかチェック
          if (!filters.support.some(filterSupport => allSupports.includes(filterSupport))) {
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
              content = String(row[detailIndex] || ''); // 2-2 詳しい状況
            } else if (periodType === '混乱期') {
              content = String(row[q2_8Index] || ''); // 2-8 一番つらかった時期
            } else if (periodType === '安定期') {
              content = String(row[q2_9Index] || ''); // 2-9 不登校1ヶ月以上の過ごし方
            } else if (periodType === '回復期') {
              content = String(row[q2_10Index] || ''); // 2-10 改善のきっかけ
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
      let description = String(row[detailIndex] || ''); // デフォルトは2-2 詳しい状況
      let title = '';
      
      if (filters.period && filters.period.length > 0) {
        const periodType = filters.period[0]; // 時期フィルターは1つのみ選択可能
        
        if (periodType === '登校渋り期') {
          description = String(row[detailIndex] || ''); // 2-2 詳しい状況
        } else if (periodType === '混乱期') {
          description = String(row[q2_8Index] || ''); // 2-8 一番つらかった時期
        } else if (periodType === '安定期') {
          description = String(row[q2_9Index] || ''); // 2-9 不登校1ヶ月以上の過ごし方
        } else if (periodType === '回復期') {
          description = String(row[q2_10Index] || ''); // 2-10 改善のきっかけ
        }
      }
      
      // タイトルを生成（descriptionの最初の50文字）
      title = description.substring(0, 50) + '...';
      
      // 結果に追加
      results.push({
        id: i,  // 配列インデックス（data[1]から開始なのでid=1）
        title: title,
        description: description,
        authorName: row[authorNameIndex] || '匿名',
        authorInitial: getInitial(row[authorNameIndex]),
        date: formatDate(row[timestampIndex]),
        grade: row[gradeIndex],
        trigger: row[triggerIndex],
        support: [row[support1Index], row[support2Index], row[support3Index]].filter(s => s).join(', ')
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
    
    const timestampIndex = 0; // A列: タイムスタンプ
    const authorNameIndex = 1; // B列: 1-2ペンネーム
    const gradeIndex = 2; // C列: 1-3初めて不登校になった学年
    const detailIndex = 5; // F列: 2-2詳しい状況
    const approvalStatusIndex = 58; // BG列: 承認ステータス
    
    const results = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      if (!row[authorNameIndex] && !row[detailIndex]) continue;
      
      // 承認済みの体験談のみを取得
      const status = row[approvalStatusIndex] || '';
      if (status !== '承認済み') continue;
      
      // タイトルを生成（詳しい状況の最初の50文字）
      const title = String(row[detailIndex] || '').substring(0, 50) + '...';
      
      results.push({
        id: i,  // 配列インデックス（data[1]から開始なのでid=1）
        title: title,
        description: String(row[detailIndex] || ''),
        authorName: row[authorNameIndex] || '匿名',
        authorInitial: getInitial(row[authorNameIndex]),
        date: formatDate(row[timestampIndex]),
        grade: row[gradeIndex]
      });
      
      if (limit && results.length >= limit) break;
    }
    
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
    
    // 列インデックスの定義
    const timestampIndex = 0;    // A列: タイムスタンプ
    const authorNameIndex = 1;   // B列: 1-2 ペンネーム
    const gradeIndex = 2;        // C列: 1-3 初めて不登校になった学年
    const familyIndex = 3;       // D列: 1-4 家族構成
    const triggerIndex = 4;      // E列: 2-1 不登校になったきっかけ
    const detailIndex = 5;       // F列: 2-2 詳しい状況
    
    // セクション2の続き: 初動と経過
    const q2_3Index = 6;         // G列: 2-3 保護者の初動
    const q2_4Index = 7;         // H列: 2-4 子どもの反応
    const q2_5Index = 8;         // I列: 2-5 学校の反応・対応
    const q2_6Index = 9;         // J列: 2-6 初動の振り返り
    const q2_7Index = 10;        // K列: 2-7 不登校1か月の生活
    const q2_8Index = 11;        // L列: 2-8 一番つらかった時期
    const q2_9Index = 12;        // M列: 2-9 不登校1ヶ月以上の過ごし方
    const q2_10Index = 13;       // N列: 2-10 改善のきっかけ
    const q2_11Index = 14;       // O列: 2-11 学校との繋がり
    
    // セクション3: 子どもの成長過程
    const q3_1Index = 15;        // P列: 3-1 小学生のころ
    const q3_2Index = 16;        // Q列: 3-2 中学生のころ
    const q3_3Index = 17;        // R列: 3-3 高校生のころ
    const q3_4Index = 18;        // S列: 3-4 中学卒業後の通信制・定時制
    
    // セクション4: 通信制・定時制の学校情報（最大3校）
    const school1NameIndex = 19;      // T列: 4-1-1 学校名
    const school1PeriodIndex = 20;    // U列: 4-1-2 通学期間
    const school1ReasonIndex = 21;    // V列: 4-1-3 選んだ理由
    const school1ReviewIndex = 22;    // W列: 4-1-4 感想
    const school1CostIndex = 23;      // X列: 4-1-5 費用
    const school1MoreIndex = 24;      // Y列: 4-1-6 他にもあるか
    
    const school2NameIndex = 25;      // Z列: 4-2-1 学校名
    const school2PeriodIndex = 26;    // AA列: 4-2-2 通学期間
    const school2ReasonIndex = 27;    // AB列: 4-2-3 選んだ理由
    const school2ReviewIndex = 28;    // AC列: 4-2-4 感想
    const school2CostIndex = 29;      // AD列: 4-2-5 費用
    const school2MoreIndex = 30;      // AE列: 4-2-6 他にもあるか
    
    const school3NameIndex = 31;      // AF列: 4-3-1 学校名
    const school3PeriodIndex = 32;    // AG列: 4-3-2 通学期間
    const school3ReasonIndex = 33;    // AH列: 4-3-3 選んだ理由
    const school3ReviewIndex = 34;    // AI列: 4-3-4 感想
    const school3CostIndex = 35;      // AJ列: 4-3-5 費用
    
    // セクション5: 行政・民間サポートの有無
    const q5_1Index = 36;        // AK列: 5-1 利用した行政サポート民間サポート
    
    // セクション6: 利用したサポート（最大3つ）
    const support1TypeIndex = 37;      // AL列: 6-1-1 サポート1の種類
    const support1DetailIndex = 38;    // AM列: 6-1-2 サポート1の名称
    const support1FreqIndex = 39;      // AN列: 6-1-3 サポート1の利用期間・回数
    const support1ReasonIndex = 40;    // AO列: 6-1-4 サポート1の利用きっかけ
    const support1FeelingIndex = 41;   // AP列: 6-1-5 サポート1の感想
    const support1MoreIndex = 42;      // AQ列: 6-1-6 他にも利用したサポートがあるか
    
    const support2TypeIndex = 43;      // AR列: 6-2-1 サポート2の種類
    const support2DetailIndex = 44;    // AS列: 6-2-2 サポート2の名称
    const support2FreqIndex = 45;      // AT列: 6-2-3 サポート2の利用期間・回数
    const support2ReasonIndex = 46;    // AU列: 6-2-4 サポート2の利用きっかけ
    const support2FeelingIndex = 47;   // AV列: 6-2-5 サポート2の感想
    const support2MoreIndex = 48;      // AW列: 6-2-6 他にも利用したサポートがあるか
    
    const support3TypeIndex = 49;      // AX列: 6-3-1 サポート3の種類
    const support3DetailIndex = 50;    // AY列: 6-3-2 サポート3の名称
    const support3FreqIndex = 51;      // AZ列: 6-3-3 サポート3の利用期間・回数
    const support3ReasonIndex = 52;    // BA列: 6-3-4 サポート3の利用きっかけ
    const support3FeelingIndex = 53;   // BB列: 6-3-5 サポート3の感想
    
    // セクション7: その他のサポートと今の想い
    const q7_1Index = 54;        // BC列: 7-1 その他のサポート・活動
    const q7_2Index = 55;        // BD列: 7-2 不登校に対する考え・想い
    
    // メールアドレスと承認ステータス
    const emailIndex = 57;       // BF列: メールアドレス
    const approvalStatusIndex = 58;  // BG列: 承認ステータス
    const approvalDateIndex = 59;    // BH列: 承認日時
    const lastEditDateIndex = 60;    // BI列: 最終編集日時
    const approvalCountIndex = 61;   // BJ列: 承認回数
    const rejectReasonIndex = 62;    // BK列: 却下理由（最新）
    const firstSubmitDateIndex = 63; // BL列: 初回投稿日時
    const editCountIndex = 64;       // BM列: 編集回数
    const submissionStateIndex = 65; // BN列: 投稿状態
    const rejectReasonHistoryIndex = 66; // BO列: 却下理由履歴
    
    // タイトルを生成（2-2の詳しい状況から）
    const title = String(row[detailIndex] || '').substring(0, 50) + '...';
    
    return {
      success: true,
      data: {
        id: dataIndex,
        title: title,
        
        // 基本情報（セクション1）
        timestamp: row[timestampIndex],
        authorName: row[authorNameIndex] || '匿名',
        authorInitial: getInitial(row[authorNameIndex]),
        date: formatDate(row[timestampIndex]),
        grade: row[gradeIndex] || '',
        family: row[familyIndex] || '',
        
        // セクション2: 不登校のきっかけ
        trigger: row[triggerIndex] || '',
        detail: String(row[detailIndex] || ''),
        description: String(row[detailIndex] || ''), // 互換性のため
        
        // セクション2の続き: 初動と経過
        parentInitialAction: String(row[q2_3Index] || ''),      // 2-3 保護者の初動
        childReaction: String(row[q2_4Index] || ''),            // 2-4 子どもの反応
        schoolResponse: String(row[q2_5Index] || ''),           // 2-5 学校の反応・対応
        initialReflection: String(row[q2_6Index] || ''),        // 2-6 初動の振り返り
        firstMonthLife: String(row[q2_7Index] || ''),           // 2-7 不登校1か月の生活
        hardestTime: String(row[q2_8Index] || ''),              // 2-8 一番つらかった時期
        dailyLifeOverMonth: String(row[q2_9Index] || ''),       // 2-9 不登校1ヶ月以上の過ごし方
        improvementTrigger: String(row[q2_10Index] || ''),      // 2-10 改善のきっかけ
        schoolConnection: String(row[q2_11Index] || ''),        // 2-11 学校との繋がり
        
        // セクション3: 子どもの成長過程
        elementarySchool: String(row[q3_1Index] || ''),         // 3-1 小学生のころ
        juniorHighSchool: String(row[q3_2Index] || ''),         // 3-2 中学生のころ
        highSchool: String(row[q3_3Index] || ''),               // 3-3 高校生のころ
        alternativeSchool: String(row[q3_4Index] || ''),        // 3-4 中学卒業後の通信制・定時制
        
        // セクション4: 通信制・定時制の学校情報
        schools: [
          {
            name: row[school1NameIndex] || '',
            period: String(row[school1PeriodIndex] || ''),
            reason: String(row[school1ReasonIndex] || ''),
            review: String(row[school1ReviewIndex] || ''),
            cost: String(row[school1CostIndex] || '')
          },
          {
            name: row[school2NameIndex] || '',
            period: String(row[school2PeriodIndex] || ''),
            reason: String(row[school2ReasonIndex] || ''),
            review: String(row[school2ReviewIndex] || ''),
            cost: String(row[school2CostIndex] || '')
          },
          {
            name: row[school3NameIndex] || '',
            period: String(row[school3PeriodIndex] || ''),
            reason: String(row[school3ReasonIndex] || ''),
            review: String(row[school3ReviewIndex] || ''),
            cost: String(row[school3CostIndex] || '')
          }
        ].filter(s => s.name), // 学校名が入力されているもののみ
        
        // セクション5: 行政・民間サポートの有無
        supportUsed: String(row[q5_1Index] || ''),              // 5-1 利用したサポート
        
        // セクション6: 利用したサポート
        supports: [
          {
            type: row[support1TypeIndex] || '',
            name: String(row[support1DetailIndex] || ''),           // サポート名称
            frequency: String(row[support1FreqIndex] || ''),        // 利用期間・回数
            reason: String(row[support1ReasonIndex] || ''),         // 利用きっかけ
            feeling: String(row[support1FeelingIndex] || '')        // 感想
          },
          {
            type: row[support2TypeIndex] || '',
            name: String(row[support2DetailIndex] || ''),
            frequency: String(row[support2FreqIndex] || ''),
            reason: String(row[support2ReasonIndex] || ''),
            feeling: String(row[support2FeelingIndex] || '')
          },
          {
            type: row[support3TypeIndex] || '',
            name: String(row[support3DetailIndex] || ''),
            frequency: String(row[support3FreqIndex] || ''),
            reason: String(row[support3ReasonIndex] || ''),
            feeling: String(row[support3FeelingIndex] || '')
          }
        ].filter(s => s.type), // 種類が入力されているもののみ
        
        // サポートの種類（簡易版・互換性のため）
        support: [row[support1TypeIndex], row[support2TypeIndex], row[support3TypeIndex]]
          .filter(s => s).join(', '),
        
        // セクション7: その他のサポートと今の想い
        otherSupport: String(row[q7_1Index] || ''),             // 7-1 その他のサポート・活動
        currentThoughts: String(row[q7_2Index] || ''),          // 7-2 不登校に対する考え・想い
        message: String(row[q7_2Index] || ''),                  // 互換性のため（7-2と同じ）
        
        // 管理者用情報
        approvalStatus: row[approvalStatusIndex] || '',
        approvalDate: row[approvalDateIndex] || '',
        lastEditDate: row[lastEditDateIndex] || '',
        approvalCount: row[approvalCountIndex] || 0,
        rejectReason: row[rejectReasonIndex] || '',
        firstSubmitDate: row[firstSubmitDateIndex] || '',
        editCount: row[editCountIndex] || 0,
        submissionState: row[submissionStateIndex] || '',
        rejectReasonHistory: row[rejectReasonHistoryIndex] || ''
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
 * 特定の質問項目から体験談を取得
 * @param {string} questionId - 質問ID (例: '2-2', '2-11', '6-1-5', '4-1-3')
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
    const headers = data[0];
    
    // 列インデックスのマッピング
    const columnMapping = {
      '2-2': 5,      // F列: 詳しい状況
      '2-11': 14,    // O列: 学校との繋がり
      '4-1-3': 21,   // V列: 進路1の選んだ理由
      '4-2-3': 27,   // AB列: 進路2の選んだ理由
      '4-3-3': 33,   // AH列: 進路3の選んだ理由
      '6-1-5': 41,   // AP列: サポート1の感想
      '6-2-5': 47,   // AV列: サポート2の感想
      '6-3-5': 53    // BB列: サポート3の感想
    };
    
    const targetColumnIndex = columnMapping[questionId];
    
    if (targetColumnIndex === undefined) {
      return {
        success: false,
        error: '不正な質問IDです: ' + questionId,
        errorType: 'INVALID_QUESTION_ID'
      };
    }
    
    // 共通列インデックス
    const timestampIndex = 0;        // A列: タイムスタンプ
    const authorNameIndex = 1;       // B列: ペンネーム
    const gradeIndex = 2;            // C列: 学年
    const familyIndex = 3;           // D列: 家族構成
    const triggerIndex = 4;          // E列: きっかけ
    const approvalStatusIndex = 58;  // BG列: 承認ステータス
    
    const results = [];
    
    // データ行を新しい順にソート（タイムスタンプの降順）
    const dataRows = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 空行をスキップ
      if (!row[authorNameIndex] && !row[targetColumnIndex]) continue;
      
      // 承認済みの体験談のみを対象
      const status = row[approvalStatusIndex] || '';
      if (status !== '承認済み') continue;
      
      // 対象列にデータがあるもののみ
      const targetContent = String(row[targetColumnIndex] || '').trim();
      if (!targetContent) continue;
      
      dataRows.push({
        row: row,
        timestamp: row[timestampIndex] ? new Date(row[timestampIndex]) : new Date(0),
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
      
      const authorName = String(row[authorNameIndex] || '匿名');
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
        date: formatDate(row[timestampIndex]),
        grade: String(row[gradeIndex] || ''),
        family: String(row[familyIndex] || ''),
        trigger: String(row[triggerIndex] || ''),
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