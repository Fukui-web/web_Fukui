import GAS_CONFIG from '../config/gasConfig';

/**
 * GAS APIにリクエストを送信するヘルパー関数
 * @param {string} endpoint - APIエンドポイント名
 * @param {object} params - リクエストパラメータ
 * @param {number} retryCount - リトライ回数
 * @returns {Promise<object>} - APIレスポンス
 */
const fetchGasApi = async (endpoint, params = {}, retryCount = 0) => {
  const url = GAS_CONFIG.API_URL;
  
  // デバッグ用：環境変数が設定されているか確認
  if (!url) {
    console.error('GAS API URL is not configured. Please set REACT_APP_GAS_API_URL in .env file');
    throw new Error('GAS API URLが設定されていません。.envファイルでREACT_APP_GAS_API_URLを設定してください。');
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GAS_CONFIG.TIMEOUT);

    // GASにエンドポイント名とパラメータを含めて送信
    const requestBody = {
      endpoint: endpoint,
      ...params
    };

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error(`GAS API Error (${endpoint}):`, error);

    // リトライ処理
    if (retryCount < GAS_CONFIG.RETRY_COUNT) {
      console.log(`Retrying... (${retryCount + 1}/${GAS_CONFIG.RETRY_COUNT})`);
      await new Promise(resolve => setTimeout(resolve, GAS_CONFIG.RETRY_DELAY));
      return fetchGasApi(endpoint, params, retryCount + 1);
    }

    throw error;
  }
};

/**
 * フリーワード検索で体験談を取得
 * @param {string} keyword - 検索キーワード
 * @param {object} filters - フィルター条件（オプション）
 * @returns {Promise<Array>} - 体験談の配列
 */
export const searchExperiences = async (keyword, filters = {}) => {
  try {
    const params = {
      keyword: keyword.trim(),
      filters: filters
    };

    const response = await fetchGasApi(GAS_CONFIG.ENDPOINTS.SEARCH_EXPERIENCES, params);
    
    if (response.success) {
      return response.data || [];
    } else {
      throw new Error(response.error || '検索に失敗しました');
    }
  } catch (error) {
    console.error('Search experiences error:', error);
    throw error;
  }
};

/**
 * すべての体験談を取得（ピックアップ用）
 * @param {number} limit - 取得件数の上限（オプション）
 * @returns {Promise<Array>} - 体験談の配列
 */
export const getAllExperiences = async (limit = null) => {
  try {
    const params = limit ? { limit } : {};
    
    const response = await fetchGasApi(GAS_CONFIG.ENDPOINTS.GET_ALL_EXPERIENCES, params);
    
    if (response.success) {
      return response.data || [];
    } else {
      throw new Error(response.error || '体験談の取得に失敗しました');
    }
  } catch (error) {
    console.error('Get all experiences error:', error);
    throw error;
  }
};

/**
 * IDで特定の体験談を取得
 * @param {number|string} id - 体験談のID
 * @returns {Promise<object>} - 体験談データ
 */
export const getExperienceById = async (id) => {
  try {
    const params = { id: parseInt(id) };
    
    const response = await fetchGasApi(GAS_CONFIG.ENDPOINTS.GET_EXPERIENCE_BY_ID, params);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error || '体験談の取得に失敗しました');
    }
  } catch (error) {
    console.error('Get experience by ID error:', error);
    throw error;
  }
};

/**
 * 体験談を投稿
 * @param {object} experienceData - 投稿する体験談データ
 * @returns {Promise<object>} - 投稿結果
 */
export const postExperience = async (experienceData) => {
  try {
    const response = await fetchGasApi(GAS_CONFIG.ENDPOINTS.POST_EXPERIENCE, experienceData);
    
    if (response.success) {
      return response;
    } else {
      throw new Error(response.error || '投稿に失敗しました');
    }
  } catch (error) {
    console.error('Post experience error:', error);
    throw error;
  }
};

/**
 * 未承認の体験談を取得
 * @returns {Promise<Array>} - 未承認体験談の配列
 */
export const getPendingExperiences = async () => {
  try {
    const response = await fetchGasApi(GAS_CONFIG.ENDPOINTS.GET_PENDING_EXPERIENCES);
    
    if (response.success) {
      return response.data || [];
    } else {
      throw new Error(response.error || '未承認体験談の取得に失敗しました');
    }
  } catch (error) {
    console.error('Get pending experiences error:', error);
    throw error;
  }
};

/**
 * 承認済みの体験談を取得
 * @returns {Promise<Array>} - 承認済み体験談の配列
 */
export const getApprovedExperiences = async () => {
  try {
    const response = await fetchGasApi(GAS_CONFIG.ENDPOINTS.GET_APPROVED_EXPERIENCES);
    
    if (response.success) {
      return response.data || [];
    } else {
      throw new Error(response.error || '承認済み体験談の取得に失敗しました');
    }
  } catch (error) {
    console.error('Get approved experiences error:', error);
    throw error;
  }
};

/**
 * 体験談を承認
 * @param {number|string} id - 体験談のID
 * @returns {Promise<object>} - 承認結果
 */
export const approveExperience = async (id) => {
  try {
    const params = { id: parseInt(id) };
    const response = await fetchGasApi(GAS_CONFIG.ENDPOINTS.APPROVE_EXPERIENCE, params);
    
    if (response.success) {
      return response;
    } else {
      throw new Error(response.error || '承認に失敗しました');
    }
  } catch (error) {
    console.error('Approve experience error:', error);
    throw error;
  }
};

/**
 * 体験談を却下
 * @param {number|string} id - 体験談のID
 * @param {string} reason - 却下理由
 * @returns {Promise<object>} - 却下結果
 */
export const rejectExperience = async (id, reason = '') => {
  try {
    const params = { 
      id: parseInt(id),
      reason: reason
    };
    const response = await fetchGasApi(GAS_CONFIG.ENDPOINTS.REJECT_EXPERIENCE, params);
    
    if (response.success) {
      return response;
    } else {
      throw new Error(response.error || '却下に失敗しました');
    }
  } catch (error) {
    console.error('Reject experience error:', error);
    throw error;
  }
};

/**
 * GAS API接続テスト
 * @returns {Promise<boolean>} - 接続成功時true
 */
export const testGasConnection = async () => {
  try {
    // 簡単な接続テストとしてgetAllExperiencesを使用
    await getAllExperiences(1);
    return true;
  } catch (error) {
    console.error('GAS connection test failed:', error);
    return false;
  }
};

/**
 * 特定の質問項目から体験談を取得
 * @param {string} questionId - 質問ID ('2-2', '2-11', '6-1-5'など)
 * @param {number} limit - 取得件数（デフォルト6件）
 * @returns {Promise<Array>} - 体験談の配列
 */
export const getExperiencesByQuestion = async (questionId, limit = 6) => {
  try {
    const params = {
      questionId: questionId,
      limit: limit
    };

    const response = await fetchGasApi(GAS_CONFIG.ENDPOINTS.GET_EXPERIENCES_BY_QUESTION, params);
    
    if (response.success) {
      return {
        data: response.data || [],
        noData: response.noData || false,
        errorType: null
      };
    } else {
      return {
        data: [],
        noData: false,
        errorType: response.errorType || 'FETCH_ERROR',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Get experiences by question error:', error);
    return {
      data: [],
      noData: false,
      errorType: 'FETCH_ERROR',
      error: error.message
    };
  }
};
