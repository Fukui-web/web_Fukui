/**
 * 既存列の動作を簡単に確認するクイックテスト
 */

/**
 * 簡易テスト: スプレッドシートの基本情報を表示
 */
function quickTest() {
  Logger.log('===== クイックテスト: スプレッドシート基本情報 =====');
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log('スプレッドシート名: ' + spreadsheet.getName());
    
    const sheets = spreadsheet.getSheets();
    Logger.log('シート数: ' + sheets.length);
    Logger.log('');
    
    Logger.log('シート一覧:');
    sheets.forEach((sheet, index) => {
      Logger.log((index + 1) + '. ' + sheet.getName() + ' (' + sheet.getLastRow() + '行 × ' + sheet.getLastColumn() + '列)');
    });
    Logger.log('');
    
    // 「フォームの回答 1」シートの情報
    const targetSheet = spreadsheet.getSheetByName('フォームの回答 1');
    if (targetSheet) {
      Logger.log('ターゲットシート「フォームの回答 1」:');
      Logger.log('- データ行数: ' + (targetSheet.getLastRow() - 1) + '行');
      Logger.log('- 列数: ' + targetSheet.getLastColumn() + '列');
      Logger.log('');
      
      // BF〜BK列が存在するか確認
      const lastCol = targetSheet.getLastColumn();
      const requiredCols = {
        'BF（メールアドレス）': 58,
        'BG（承認ステータス）': 59,
        'BH（承認日時）': 60,
        'BI（最終編集日時）': 61,
        'BJ（承認回数）': 62,
        'BK（却下理由）': 63
      };
      
      Logger.log('必要な列の存在確認:');
      let allColumnsExist = true;
      for (const [name, col] of Object.entries(requiredCols)) {
        const exists = col <= lastCol;
        Logger.log('  ' + name + ': ' + (exists ? '✓ 存在' : '✗ 不足（現在' + lastCol + '列まで）'));
        if (!exists) allColumnsExist = false;
      }
      Logger.log('');
      
      if (allColumnsExist) {
        Logger.log('✓ 全ての必要な列が存在します');
        
        // ヘッダーを確認
        Logger.log('');
        Logger.log('列のヘッダー名:');
        const headers = targetSheet.getRange(1, 58, 1, 6).getValues()[0];
        headers.forEach((header, index) => {
          const colNum = 58 + index;
          const colLetter = String.fromCharCode(65 + Math.floor((colNum - 1) / 26) - 1) + 
                           String.fromCharCode(65 + ((colNum - 1) % 26));
          Logger.log('  ' + colLetter + '列: ' + (header || '（空）'));
        });
      } else {
        Logger.log('✗ 一部の列が不足しています。スプレッドシートに列を追加してください。');
      }
      
    } else {
      Logger.log('✗ エラー: シート「フォームの回答 1」が見つかりません');
    }
    
  } catch (error) {
    Logger.log('✗ エラー: ' + error.toString());
    Logger.log('スタックトレース: ' + error.stack);
  }
}

/**
 * APIのクイックテスト
 */
function quickAPITest() {
  Logger.log('===== クイックテスト: API動作確認 =====');
  Logger.log('');
  
  // getPendingExperiencesのテスト
  Logger.log('1. getPendingExperiences() のテスト');
  try {
    const result = getPendingExperiences();
    if (result.success) {
      Logger.log('   ✓ 成功: ' + result.count + '件取得');
      if (result.data.length > 0) {
        Logger.log('   最初のデータのID: ' + result.data[0].id);
        Logger.log('   投稿状態フィールド: ' + (result.data[0].submissionState !== undefined ? '✓ あり' : '✗ なし'));
      }
    } else {
      Logger.log('   ✗ 失敗: ' + result.error);
    }
  } catch (error) {
    Logger.log('   ✗ エラー: ' + error.toString());
  }
  Logger.log('');
  
  // getApprovedExperiencesのテスト
  Logger.log('2. getApprovedExperiences() のテスト');
  try {
    const result = getApprovedExperiences();
    if (result.success) {
      Logger.log('   ✓ 成功: ' + result.count + '件取得');
    } else {
      Logger.log('   ✗ 失敗: ' + result.error);
    }
  } catch (error) {
    Logger.log('   ✗ エラー: ' + error.toString());
  }
  Logger.log('');
  
  // getExperienceByIdのテスト
  Logger.log('3. getExperienceById(1) のテスト');
  try {
    const result = getExperienceById(1);
    if (result.success) {
      Logger.log('   ✓ 成功: ID ' + result.data.id + ' を取得');
      Logger.log('   新しいフィールドの確認:');
      Logger.log('   - approvalStatus: ' + (result.data.approvalStatus !== undefined ? '✓' : '✗'));
      Logger.log('   - submissionState: ' + (result.data.submissionState !== undefined ? '✓' : '✗'));
      Logger.log('   - editCount: ' + (result.data.editCount !== undefined ? '✓' : '✗'));
      Logger.log('   - rejectReasonHistory: ' + (result.data.rejectReasonHistory !== undefined ? '✓' : '✗'));
    } else {
      Logger.log('   ✗ 失敗: ' + result.error);
    }
  } catch (error) {
    Logger.log('   ✗ エラー: ' + error.toString());
  }
  Logger.log('');
}

/**
 * 全てのクイックテストを実行
 */
function runQuickTests() {
  Logger.log('================================================');
  Logger.log('クイックテスト実行');
  Logger.log('実行日時: ' + new Date());
  Logger.log('================================================');
  Logger.log('');
  
  quickTest();
  Logger.log('');
  quickAPITest();
  
  Logger.log('================================================');
  Logger.log('クイックテスト完了');
  Logger.log('================================================');
}
