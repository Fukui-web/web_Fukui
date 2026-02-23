// Google Apps Script (GAS) APIのエンドポイント設定
// .envファイルで環境変数を設定することを推奨

const GAS_CONFIG = {
  // GASのデプロイURL（環境変数から取得、なければデフォルト値）
  API_URL: process.env.REACT_APP_GAS_API_URL || '',
  
  // API エンドポイント
  ENDPOINTS: {
    SEARCH_EXPERIENCES: 'searchExperiences',
    GET_ALL_EXPERIENCES: 'getAllExperiences',
    GET_EXPERIENCE_BY_ID: 'getExperienceById',
    GET_EXPERIENCES_BY_QUESTION: 'getExperiencesByQuestion',
    POST_EXPERIENCE: 'postExperience',
    GET_PENDING_EXPERIENCES: 'getPendingExperiences',
    GET_APPROVED_EXPERIENCES: 'getApprovedExperiences',
    GET_ON_HOLD_EXPERIENCES: 'getOnHoldExperiences',
    APPROVE_EXPERIENCE: 'approveExperience',
    REJECT_EXPERIENCE: 'rejectExperience',
    RETURN_TO_PENDING: 'returnToPending'
  },
  
  // タイムアウト設定（ミリ秒）
  TIMEOUT: 30000,
  
  // リトライ設定
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000
};

export default GAS_CONFIG;
