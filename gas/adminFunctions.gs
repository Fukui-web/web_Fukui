/**
 * Google Apps Script (GAS) - 管理者機能
 * 
 * 体験談の承認・却下機能を提供します
 * 
 * 注意: SHEET_NAME定数はsearchExperiences.gsで定義されています
 */

// 承認ステータス関連の列インデックス（0始まり）
const EMAIL_ADDRESS_INDEX = 57;   // BF列（58列目）: メールアドレス
const APPROVAL_STATUS_INDEX = 58; // BG列（59列目）: 承認ステータス
const APPROVAL_DATE_INDEX = 59;   // BH列（60列目）: 承認日時
const LAST_EDIT_DATE_INDEX = 60;  // BI列（61列目）: 最終編集日時
const APPROVAL_COUNT_INDEX = 61;  // BJ列（62列目）: 承認回数
const REJECT_REASON_INDEX = 62;   // BK列（63列目）: 却下理由（最新）
const FIRST_SUBMIT_DATE_INDEX = 63; // BL列（64列目）: 初回投稿日時
const EDIT_COUNT_INDEX = 64;      // BM列（65列目）: 編集回数
const SUBMISSION_STATE_INDEX = 65; // BN列（66列目）: 投稿状態
const REJECT_REASON_HISTORY_INDEX = 66; // BO列（67列目）: 却下理由履歴

// ステータス定数
const STATUS = {
  PENDING: '未承認',
  APPROVED: '承認済み',
  REJECTED: '却下'
};

// メール送信設定
const FORM_URL = 'https://docs.google.com/forms/d/YOUR_FORM_ID/edit'; // フォームの編集URLに置き換えてください

// 管理者メールアドレスのリスト（実際のメールアドレスに変更してください）
const ADMIN_EMAILS = [
  'admin@example.com',
  'manager@example.com'
  // 必要に応じて追加
];

/**
 * 管理者権限を検証する
 * @param {string} credential - Google OAuthのJWTトークン
 * @return {object} - 検証結果
 */
function verifyAdmin(credential) {
  try {
    // JWTトークンをデコード
    const decoded = decodeJwt(credential);
    
    if (!decoded || !decoded.email) {
      return {
        success: false,
        isAdmin: false,
        error: 'トークンのデコードに失敗しました'
      };
    }
    
    // メールアドレスが管理者リストに含まれているか確認
    const isAdmin = ADMIN_EMAILS.includes(decoded.email);
    
    Logger.log('Admin verification: ' + decoded.email + ' -> ' + isAdmin);
    
    return {
      success: true,
      isAdmin: isAdmin,
      email: decoded.email
    };
    
  } catch (error) {
    Logger.log('verifyAdmin Error: ' + error.toString());
    return {
      success: false,
      isAdmin: false,
      error: error.toString()
    };
  }
}

/**
 * JWTトークンをデコードする
 * @param {string} token - JWTトークン
 * @return {object} - デコードされたペイロード
 */
function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('無効なJWTトークンです');
    }
    
    // Base64URLデコード
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = Utilities.base64Decode(base64);
    const text = Utilities.newBlob(decoded).getDataAsString();
    
    return JSON.parse(text);
    
  } catch (error) {
    Logger.log('decodeJwt Error: ' + error.toString());
    return null;
  }
}

/**
 * 未承認の体験談を取得
 * @return {object} - 未承認体験談の配列
 */
function getPendingExperiences() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。');
    }
    
    const data = sheet.getDataRange().getValues();
    const results = [];
    
    // 基本情報の列インデックス
    const timestampIndex = 0;
    const authorNameIndex = 1;
    const gradeIndex = 2;
    const triggerIndex = 4;
    const detailIndex = 5;
    
    // 2行目以降をチェック（1行目はヘッダー）
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 承認ステータスが「未承認」または空欄の場合
      const status = row[APPROVAL_STATUS_INDEX] || STATUS.PENDING;
      
      if (status === STATUS.PENDING) {
        // タイトルを生成（詳しい状況の最初の50文字）
        const title = String(row[detailIndex] || '').substring(0, 50) + '...';
        
        // サポートの種類を取得（複数のサポート列から）
        const support1Index = 37; // AL列
        const support2Index = 43; // AR列
        const support3Index = 49; // AX列
        const supportTypes = [];
        if (row[support1Index]) supportTypes.push(row[support1Index]);
        if (row[support2Index]) supportTypes.push(row[support2Index]);
        if (row[support3Index]) supportTypes.push(row[support3Index]);
        
        results.push({
          id: i,
          title: title,
          summary: String(row[detailIndex] || '').substring(0, 100) + '...',
          description: String(row[detailIndex] || ''),
          authorName: row[authorNameIndex] || '匿名',
          date: formatDate(row[timestampIndex]),
          startGrade: row[gradeIndex] || '',
          trigger: row[triggerIndex] || '',
          supportTypes: supportTypes.join(', '),
          status: status,
          lastEditDate: row[LAST_EDIT_DATE_INDEX] || '',
          firstSubmitDate: row[FIRST_SUBMIT_DATE_INDEX] || '',
          editCount: row[EDIT_COUNT_INDEX] || 0,
          submissionState: row[SUBMISSION_STATE_INDEX] || '新規投稿',
          rejectReason: row[REJECT_REASON_INDEX] || '',
          rejectReasonHistory: row[REJECT_REASON_HISTORY_INDEX] || ''
        });
      }
    }
    
    return {
      success: true,
      data: results,
      count: results.length
    };
    
  } catch (error) {
    Logger.log('Get Pending Experiences Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 承認済みの体験談を取得
 * @return {object} - 承認済み体験談の配列
 */
function getApprovedExperiences() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。');
    }
    
    const data = sheet.getDataRange().getValues();
    const results = [];
    
    // 基本情報の列インデックス
    const timestampIndex = 0;
    const authorNameIndex = 1;
    const gradeIndex = 2;
    const triggerIndex = 4;
    const detailIndex = 5;
    
    // 2行目以降をチェック
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 承認ステータスが「承認済み」の場合
      if (row[APPROVAL_STATUS_INDEX] === STATUS.APPROVED) {
        const title = String(row[detailIndex] || '').substring(0, 50) + '...';
        
        // サポートの種類を取得
        const support1Index = 37;
        const support2Index = 43;
        const support3Index = 49;
        const supportTypes = [];
        if (row[support1Index]) supportTypes.push(row[support1Index]);
        if (row[support2Index]) supportTypes.push(row[support2Index]);
        if (row[support3Index]) supportTypes.push(row[support3Index]);
        
        results.push({
          id: i,
          title: title,
          summary: String(row[detailIndex] || '').substring(0, 100) + '...',
          description: String(row[detailIndex] || ''),
          authorName: row[authorNameIndex] || '匿名',
          date: formatDate(row[timestampIndex]),
          startGrade: row[gradeIndex] || '',
          trigger: row[triggerIndex] || '',
          supportTypes: supportTypes.join(', '),
          status: STATUS.APPROVED,
          approvalDate: row[APPROVAL_DATE_INDEX] || '',
          approvalCount: row[APPROVAL_COUNT_INDEX] || 0,
          lastEditDate: row[LAST_EDIT_DATE_INDEX] || '',
          firstSubmitDate: row[FIRST_SUBMIT_DATE_INDEX] || '',
          editCount: row[EDIT_COUNT_INDEX] || 0,
          submissionState: row[SUBMISSION_STATE_INDEX] || '新規投稿'
        });
      }
    }
    
    return {
      success: true,
      data: results,
      count: results.length
    };
    
  } catch (error) {
    Logger.log('Get Approved Experiences Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 保留中（却下）の体験談を取得
 * @return {object} - 保留中体験談の配列
 */
function getOnHoldExperiences() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。');
    }
    
    const data = sheet.getDataRange().getValues();
    const results = [];
    
    // 基本情報の列インデックス
    const timestampIndex = 0;
    const authorNameIndex = 1;
    const gradeIndex = 2;
    const triggerIndex = 4;
    const detailIndex = 5;
    
    // 2行目以降をチェック
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 承認ステータスが「却下」の場合
      if (row[APPROVAL_STATUS_INDEX] === STATUS.REJECTED) {
        const title = String(row[detailIndex] || '').substring(0, 50) + '...';
        
        // サポートの種類を取得
        const support1Index = 37;
        const support2Index = 43;
        const support3Index = 49;
        const supportTypes = [];
        if (row[support1Index]) supportTypes.push(row[support1Index]);
        if (row[support2Index]) supportTypes.push(row[support2Index]);
        if (row[support3Index]) supportTypes.push(row[support3Index]);
        
        results.push({
          id: i,
          title: title,
          summary: String(row[detailIndex] || '').substring(0, 100) + '...',
          description: String(row[detailIndex] || ''),
          authorName: row[authorNameIndex] || '匿名',
          date: formatDate(row[timestampIndex]),
          startGrade: row[gradeIndex] || '',
          trigger: row[triggerIndex] || '',
          supportTypes: supportTypes.join(', '),
          status: STATUS.REJECTED,
          lastEditDate: row[LAST_EDIT_DATE_INDEX] || '',
          firstSubmitDate: row[FIRST_SUBMIT_DATE_INDEX] || '',
          editCount: row[EDIT_COUNT_INDEX] || 0,
          submissionState: row[SUBMISSION_STATE_INDEX] || '新規投稿',
          rejectReason: row[REJECT_REASON_INDEX] || '',
          rejectReasonHistory: row[REJECT_REASON_HISTORY_INDEX] || ''
        });
      }
    }
    
    return {
      success: true,
      data: results,
      count: results.length
    };
    
  } catch (error) {
    Logger.log('Get On Hold Experiences Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 体験談を承認
 * @param {number} id - 体験談のID（行番号）
 * @return {object} - 処理結果
 */
function approveExperience(id) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。');
    }
    
    // 行番号をチェック（1行目はヘッダー、2行目以降がデータ）
    const rowNumber = parseInt(id);
    if (rowNumber < 1 || rowNumber >= sheet.getLastRow()) {
      throw new Error('無効な行番号です: ' + id);
    }
    
    // 実際のシート上の行は1を足す（0始まりのインデックスを1始まりの行番号に変換）
    const sheetRow = rowNumber + 1;
    
    // 現在の承認回数を取得
    const currentCount = sheet.getRange(sheetRow, APPROVAL_COUNT_INDEX + 1).getValue() || 0;
    
    // 承認ステータスを更新
    sheet.getRange(sheetRow, APPROVAL_STATUS_INDEX + 1).setValue(STATUS.APPROVED);
    
    // 承認日時を記録
    const now = new Date();
    sheet.getRange(sheetRow, APPROVAL_DATE_INDEX + 1).setValue(Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss'));
    
    // 承認回数をインクリメント
    sheet.getRange(sheetRow, APPROVAL_COUNT_INDEX + 1).setValue(parseInt(currentCount) + 1);
    
    // 投稿状態を更新
    const editCount = sheet.getRange(sheetRow, EDIT_COUNT_INDEX + 1).getValue() || 0;
    if (editCount > 0) {
      sheet.getRange(sheetRow, SUBMISSION_STATE_INDEX + 1).setValue('再編集');
    } else {
      sheet.getRange(sheetRow, SUBMISSION_STATE_INDEX + 1).setValue('新規投稿');
    }
    
    // 承認メールを送信
    try {
      const email = sheet.getRange(sheetRow, EMAIL_ADDRESS_INDEX + 1).getValue();
      const authorName = sheet.getRange(sheetRow, 2).getValue(); // C列（投稿者名）
      const detailIndex = 5; // F列（詳しい状況）
      const detail = sheet.getRange(sheetRow, detailIndex + 1).getValue();
      const title = String(detail || '').substring(0, 50) + '...';
      
      if (email) {
        sendApprovalEmail(email, authorName, title);
      }
    } catch (emailError) {
      Logger.log('メール送信エラー（承認は完了しました）: ' + emailError.toString());
      // メール送信に失敗しても承認処理は成功とする
    }
    
    return {
      success: true,
      message: '体験談を承認しました',
      id: id
    };
    
  } catch (error) {
    Logger.log('Approve Experience Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**体験談を保留中から未承認に戻す
 * @param {number} id - 体験談のID（行番号）
 * @return {object} - 処理結果
 */
function returnToPending(id) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。');
    }
    
    // 行番号をチェック
    const rowNumber = parseInt(id);
    if (rowNumber < 1 || rowNumber >= sheet.getLastRow()) {
      throw new Error('無効な行番号です: ' + id);
    }
    
    const sheetRow = rowNumber + 1;
    
    // 現在のステータスを確認
    const currentStatus = sheet.getRange(sheetRow, APPROVAL_STATUS_INDEX + 1).getValue();
    
    if (currentStatus !== STATUS.REJECTED) {
      throw new Error('この体験談は保留中ではありません（現在のステータス: ' + currentStatus + '）');
    }
    
    // 承認ステータスを「未承認」に変更
    sheet.getRange(sheetRow, APPROVAL_STATUS_INDEX + 1).setValue(STATUS.PENDING);
    
    // 最新の却下理由をクリア（履歴は保持）
    sheet.getRange(sheetRow, REJECT_REASON_INDEX + 1).setValue('');
    
    Logger.log('体験談（行' + sheetRow + '）を未承認に戻しました');
    
    return {
      success: true,
      message: '体験談を未承認に戻しました',
      id: id
    };
    
  } catch (error) {
    Logger.log('Return To Pending Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 
 * 体験談を却下
 * @param {number} id - 体験談のID（行番号）
 * @param {string} reason - 却下理由
 * @return {object} - 処理結果
 */
function rejectExperience(id, reason) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。');
    }
    
    // 行番号をチェック
    const rowNumber = parseInt(id);
    if (rowNumber < 1 || rowNumber >= sheet.getLastRow()) {
      throw new Error('無効な行番号です: ' + id);
    }
    
    const sheetRow = rowNumber + 1;
    
    // 承認ステータスを「却下」に更新
    sheet.getRange(sheetRow, APPROVAL_STATUS_INDEX + 1).setValue(STATUS.REJECTED);
    
    // 却下理由を履歴に追加
    if (reason) {
      // 最新の却下理由を保存
      sheet.getRange(sheetRow, REJECT_REASON_INDEX + 1).setValue(reason);
      
      // 却下理由履歴に追加
      const existingHistory = sheet.getRange(sheetRow, REJECT_REASON_HISTORY_INDEX + 1).getValue();
      const updatedHistory = addRejectReasonToHistory(existingHistory, reason);
      sheet.getRange(sheetRow, REJECT_REASON_HISTORY_INDEX + 1).setValue(updatedHistory);
    }
    
    // 却下時は承認日時をクリア（承認済みではないため）
    sheet.getRange(sheetRow, APPROVAL_DATE_INDEX + 1).setValue('');
    
    // 最終編集日時は保持（管理者が誤って保留にした場合に未承認に戻せるように）
    // sheet.getRange(sheetRow, LAST_EDIT_DATE_INDEX + 1).setValue(''); // 削除
    
    // 却下メールを送信
    try {
      const email = sheet.getRange(sheetRow, EMAIL_ADDRESS_INDEX + 1).getValue();
      const authorName = sheet.getRange(sheetRow, 2).getValue(); // C列（投稿者名）
      const detailIndex = 5; // F列（詳しい状況）
      const detail = sheet.getRange(sheetRow, detailIndex + 1).getValue();
      const title = String(detail || '').substring(0, 50) + '...';
      
      if (email) {
        sendRejectionEmail(email, authorName, title, reason);
      }
    } catch (emailError) {
      Logger.log('メール送信エラー（却下は完了しました）: ' + emailError.toString());
      // メール送信に失敗しても却下処理は成功とする
    }
    
    return {
      success: true,
      message: '体験談を却下しました',
      id: id,
      reason: reason
    };
    
  } catch (error) {
    Logger.log('Reject Experience Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 日付フォーマット関数（既存のsearchExperiences.gsにもあるが、ここでも定義）
 */
function formatDate(timestamp) {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    return Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd');
  } catch (error) {
    return '';
  }
}

/**
 * 却下理由履歴に新しい理由を追加
 * @param {string} existingHistory - 既存の却下理由履歴
 * @param {string} newReason - 新しい却下理由
 * @return {string} - 更新された却下理由履歴
 */
function addRejectReasonToHistory(existingHistory, newReason) {
  const now = new Date();
  const timestamp = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
  const newEntry = '[' + timestamp + '] ' + newReason;
  
  if (!existingHistory || existingHistory.trim() === '') {
    return newEntry;
  }
  
  // 既存の履歴に追記（改行で区切る）
  return existingHistory + '\n' + newEntry;
}

/**
 * 承認メール送信
 * @param {string} email - 送信先メールアドレス
 * @param {string} authorName - 投稿者名
 * @param {string} title - 体験談のタイトル
 */
function sendApprovalEmail(email, authorName, title) {
  try {
    const subject = '【承認通知】あなたの体験談が承認されました';
    const body = `${authorName}様

この度は体験談をご投稿いただき、ありがとうございました。
管理者による審査の結果、あなたの体験談が承認されました。

タイトル: ${title}
承認日時: ${Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy年MM月dd日 HH:mm')}

体験談はウェブサイトに公開されます。
あなたの経験が、同じような状況にある方々の助けになることを願っています。

今後とも当サイトをよろしくお願いいたします。

------
このメールは自動送信されています。
ご不明な点がございましたら、お気軽にお問い合わせください。
`;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body
    });
    
    Logger.log('承認メール送信成功: ' + email);
  } catch (error) {
    Logger.log('承認メール送信エラー: ' + error.toString());
    throw error;
  }
}

/**
 * 却下メール送信
 * @param {string} email - 送信先メールアドレス
 * @param {string} authorName - 投稿者名
 * @param {string} title - 体験談のタイトル
 * @param {string} reason - 却下理由
 */
function sendRejectionEmail(email, authorName, title, reason) {
  try {
    const subject = '【再投稿のお願い】体験談について';
    const body = `${authorName}様

この度は体験談をご投稿いただき、ありがとうございました。

管理者による審査の結果、以下の理由により再投稿をお願いしたく、ご連絡いたします。

タイトル: ${title}

【却下理由】
${reason}

お手数ですが、上記の点を修正の上、再度ご投稿いただけますと幸いです。
※再投稿の際は、新規投稿として送信してください。

【再投稿用フォーム】
${FORM_URL}

皆様の貴重な体験談をお待ちしております。
ご不明な点がございましたら、お気軽にお問い合わせください。

------
このメールは自動送信されています。
`;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body
    });
    
    Logger.log('却下メール送信成功: ' + email);
  } catch (error) {
    Logger.log('却下メール送信エラー: ' + error.toString());
    throw error;
  }
}

/**
 * フォーム編集時の自動処理（onEditトリガー用）
 * Googleフォームで回答が編集された際に、承認ステータスを「未承認」に戻す
 */
function onEditTrigger(e) {
  try {
    const sheet = e.source.getActiveSheet();
    
    // 対象シートかチェック
    if (sheet.getName() !== SHEET_NAME) {
      return;
    }
    
    const range = e.range;
    const row = range.getRow();
    
    // ヘッダー行は無視
    if (row <= 1) {
      return;
    }
    
    // タイムスタンプ列（A列）の変更でない場合、ユーザーによる編集と判断
    // Googleフォームからの編集の場合、複数列が同時に更新される
    const editedColumn = range.getColumn();
    
    // 承認ステータス列以外が編集された場合
    if (editedColumn !== APPROVAL_STATUS_INDEX + 1 && 
        editedColumn !== APPROVAL_DATE_INDEX + 1 && 
        editedColumn !== APPROVAL_COUNT_INDEX + 1) {
      
      // 現在のステータスを確認
      const currentStatus = sheet.getRange(row, APPROVAL_STATUS_INDEX + 1).getValue();
      
      // 承認済みまたは却下済みの場合、未承認に戻す
      if (currentStatus === STATUS.APPROVED || currentStatus === STATUS.REJECTED) {
        sheet.getRange(row, APPROVAL_STATUS_INDEX + 1).setValue(STATUS.PENDING);
        
        // 最終編集日時を記録
        const now = new Date();
        sheet.getRange(row, LAST_EDIT_DATE_INDEX + 1).setValue(
          Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss')
        );
        
        // 編集回数をインクリメント
        const currentEditCount = sheet.getRange(row, EDIT_COUNT_INDEX + 1).getValue() || 0;
        sheet.getRange(row, EDIT_COUNT_INDEX + 1).setValue(parseInt(currentEditCount) + 1);
        
        // 投稿状態を「再編集」に更新
        sheet.getRange(row, SUBMISSION_STATE_INDEX + 1).setValue('再編集');
        
        Logger.log('体験談（行' + row + '）が編集されたため、承認ステータスを未承認に変更しました。編集回数: ' + (parseInt(currentEditCount) + 1));
      }
    }
    
  } catch (error) {
    Logger.log('onEditTrigger Error: ' + error.toString());
  }
}

/**
 * フォーム送信時トリガー
 * 新しい投稿のデフォルトステータスを「未承認」に設定
 */
function onFormSubmit(e) {
  try {
    const sheet = e.range.getSheet();
    
    // 対象シートかチェック
    if (sheet.getName() !== 'フォームの回答 1') {
      return;
    }
    
    const row = e.range.getRow();
    const now = new Date();
    const formattedNow = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
    
    // 初回投稿日時を確認
    const firstSubmitDate = sheet.getRange(row, FIRST_SUBMIT_DATE_INDEX + 1).getValue();
    
    // 承認ステータスを「未承認」に設定
    sheet.getRange(row, APPROVAL_STATUS_INDEX + 1).setValue(STATUS.PENDING);
    
    if (!firstSubmitDate || firstSubmitDate === '') {
      // 初回投稿の場合
      Logger.log('初回投稿を検出（行' + row + '）');
      
      // 初回投稿日時を設定
      sheet.getRange(row, FIRST_SUBMIT_DATE_INDEX + 1).setValue(formattedNow);
      
      // 最終編集日時を設定
      sheet.getRange(row, LAST_EDIT_DATE_INDEX + 1).setValue(formattedNow);
      
      // 編集回数を0に初期化
      sheet.getRange(row, EDIT_COUNT_INDEX + 1).setValue(0);
      
      // 投稿状態を「新規投稿」に設定
      sheet.getRange(row, SUBMISSION_STATE_INDEX + 1).setValue('新規投稿');
      
      Logger.log('新規投稿として設定しました。初回投稿日時: ' + formattedNow);
    } else {
      // 再編集の場合（初回投稿日が既に存在）
      Logger.log('再編集を検出（行' + row + '）。初回投稿日時: ' + firstSubmitDate);
      
      // 最終編集日時を更新
      sheet.getRange(row, LAST_EDIT_DATE_INDEX + 1).setValue(formattedNow);
      
      // 編集回数をインクリメント
      const currentEditCount = sheet.getRange(row, EDIT_COUNT_INDEX + 1).getValue() || 0;
      sheet.getRange(row, EDIT_COUNT_INDEX + 1).setValue(parseInt(currentEditCount) + 1);
      
      // 投稿状態を「再編集」に設定
      sheet.getRange(row, SUBMISSION_STATE_INDEX + 1).setValue('再編集');
      
      Logger.log('再編集として更新しました。編集回数: ' + (parseInt(currentEditCount) + 1));
    }
    
  } catch (error) {
    Logger.log('onFormSubmit Error: ' + error.toString());
  }
}
