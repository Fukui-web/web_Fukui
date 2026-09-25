import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './ExperiencesSearchResultsContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import TweetCard from '../../common/TweetCard/TweetCard';
import FilterModal from '../../common/FilterModal';
import dotlineImage from '../../../assets/images/dotline.png';
import SearchIcon from '../../../assets/icons/SearchIcon';
import FilterIcon from '../../../assets/icons/FilterIcon';
import { searchExperiences } from '../../../utils/gasApi';
import experienceFilterConfig from '../../../config/experienceFilterConfig';

/**
 * 選択されている絞り込み条件の数を数える
 * @param {object} filters - { grade: [...], trigger: [...] } 形式
 * @return {number} - 選択数
 */
const countFilters = (filters) =>
  Object.values(filters || {}).reduce((sum, values) => sum + (values ? values.length : 0), 0);

const ExperiencesSearchResultsContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 検索欄の状態（まだ検索していない、入力中の条件）
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempFilterCount, setTempFilterCount] = useState(0);
  const [tempFilters, setTempFilters] = useState({});
  const [formError, setFormError] = useState(null);

  // 検索結果の状態管理
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // URLパラメータから検索キーワードとフィルターを取得
  const urlKeyword = searchParams.get('keyword') || '';
  const urlFilters = searchParams.get('filters');

  // 実行済みの検索条件はURLだけを正とする。
  // 検索欄用のstateと分けておかないと、検索欄の操作（クリア等）が
  // 検索結果の表示にそのまま波及してしまう。
  const appliedFilters = useMemo(() => {
    if (!urlFilters) return {};
    try {
      return JSON.parse(urlFilters);
    } catch (e) {
      console.error('フィルターのパースエラー:', e);
      return {};
    }
  }, [urlFilters]);

  const appliedFilterCount = useMemo(() => countFilters(appliedFilters), [appliedFilters]);

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '体験談を探す', path: '/experiences' },
    { label: '検索結果', path: `/experiences/search?keyword=${urlKeyword}` }
  ];

  const filterConfig = experienceFilterConfig;

  // URLの条件が変わったら、検索欄と検索結果の両方をその条件に合わせる
  useEffect(() => {
    // 検索欄（一時state）もURLの条件へ同期する。
    // これをしないと、体験談さがすページから遷移した1回目だけ
    // 絞り込みの件数と選択内容が検索欄に反映されない。
    setTempFilters(appliedFilters);
    setTempFilterCount(appliedFilterCount);
    setSearchKeyword(urlKeyword === '*' ? '' : urlKeyword); // '*'の場合は空文字に変換
    setFormError(null);

    if (urlKeyword) {
      handleSearch(urlKeyword, appliedFilters);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKeyword, appliedFilters, appliedFilterCount]);

  // 検索処理
  const handleSearch = async (keyword, currentFilters = {}) => {
    // キーワードが'*'（全検索）または空でフィルターがある場合は検索実行
    const searchKeyword = keyword === '*' ? '' : keyword;

    // モーダルは未選択のカテゴリも空配列で返すため、キーの有無ではなく選択数で判定する
    if (!searchKeyword.trim() && countFilters(currentFilters) === 0) {
      setError('検索キーワードまたは絞り込み条件を指定してください。');
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('検索実行:', { keyword: searchKeyword || '全件', filters: currentFilters }); // デバッグログ
      // キーワードが空の場合は'*'（ワイルドカード）で検索
      const results = await searchExperiences(searchKeyword || '*', currentFilters);
      console.log('検索結果:', results); // デバッグログ
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('検索結果が見つかりませんでした。');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('検索中にエラーが発生しました。しばらくしてから再度お試しください。');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 検索ボタンクリック
  const handleSearchClick = () => {
    // バリデーション: キーワードもフィルターも指定されていない場合
    if (!searchKeyword.trim() && tempFilterCount === 0) {
      // 検索欄の入力に対する指摘なので、検索結果側ではなく検索欄の下に出す
      setFormError('検索キーワードまたは絞り込み条件を指定してください。');
      return;
    }

    setFormError(null);

    const keyword = searchKeyword.trim() || '*';
    const queryParams = new URLSearchParams();
    queryParams.set('keyword', keyword);

    if (tempFilterCount > 0) {
      queryParams.set('filters', JSON.stringify(tempFilters));
    }

    const nextQuery = queryParams.toString();

    if (nextQuery === searchParams.toString()) {
      // URLが変わらないとuseEffectが動かないため、同じ条件のときはその場で再検索する
      handleSearch(keyword, tempFilters);
      return;
    }

    // URLを更新すればuseEffectが検索を実行する（検索条件の起点はURLに一本化）
    navigate(`/experiences/search?${nextQuery}`);
  };

  // Enterキーでの検索
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // フィルター適用
  const handleApplyFilters = (count, selectedFilters) => {
    // 一時的なstateに保存（検索実行まで表示に反映させない）
    setTempFilterCount(count);
    setTempFilters(selectedFilters);
    setFormError(null);
  };

  // クリアボタン: 検索欄だけを空にする（実行済みの検索結果には触れない）
  const handleClearFilters = () => {
    setTempFilterCount(0);
    setTempFilters({});
    setSearchKeyword('');
    setFormError(null);
  };

  return (
    <div className={`${layoutStyles.pageContainer} ${styles.pageRoot}`}>
      <Helmet>
        <title>体験談検索結果｜ぼくらのみち</title>
        <meta name="description" content="不登校に関する体験談の検索結果です。" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* 検索セクション */}
      <div className={styles.searchSection}>
        <h1 className={styles.searchTitle}>体験談を探す</h1>
        <img src={dotlineImage} alt="" className={styles.dotline} />
        
        <div className={styles.searchBox}>
          {/* 検索入力フィールド */}
          <div className={styles.searchInputWrapper}>
            <SearchIcon size={20} color="#999" />
            <input 
              type="text" 
              placeholder="調べたい内容を、キーワードで記入してください。"
              className={styles.searchInput}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          
          {/* ボタンエリア */}
          <div className={styles.buttonArea}>
            <div className={styles.filterRow}>
              <button 
                className={styles.filterButton}
                onClick={() => setIsModalOpen(true)}
              >
                <FilterIcon size={16} color="#EF9F94" />
                <span>絞り込み{tempFilterCount > 0 && `(${tempFilterCount})`}</span>
              </button>
              <button 
                className={styles.clearButton}
                onClick={handleClearFilters}
              >
                クリア
              </button>
            </div>
            
            <button 
              className={styles.searchButton}
              onClick={handleSearchClick}
              disabled={isLoading}
            >
              <SearchIcon size={18} color="#fff" />
              <span>{isLoading ? '検索中...' : '検索する'}</span>
            </button>
          </div>

          {/* 検索欄の入力に対するエラー（検索結果とは独立して表示する） */}
          {formError && (
            <p className={styles.formErrorText}>{formError}</p>
          )}
        </div>
      </div>

      {/* 検索結果セクション */}
      <div className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <h2 className={styles.resultsTitle}>
            {urlKeyword === '*' || !urlKeyword ? '絞り込み検索' : `"${urlKeyword}"`} の検索結果
            {!isLoading && searchResults.length > 0 && (
              <span className={styles.resultCount}>（{searchResults.length}件）</span>
            )}
          </h2>
          <div className={styles.dividerLine}></div>
        </div>

        {/* 絞り込み条件の表示（実行済みの検索条件＝URLの内容） */}
        {appliedFilterCount > 0 && (
          <div className={styles.activeFilters}>
            <span className={styles.filterLabel}>絞り込み条件:</span>
            <div className={styles.filterTags}>
              {['grade', 'trigger', 'support', 'period'].map(key => (
                (appliedFilters[key] || []).map((item, index) => (
                  <span key={`${key}-${index}`} className={styles.filterTag}>
                    {item}
                  </span>
                ))
              ))}
            </div>
          </div>
        )}

        {/* ローディング表示 */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>検索中...</p>
          </div>
        )}

        {/* エラー表示 */}
        {error && !isLoading && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
            <button 
              className={styles.backButton}
              onClick={() => navigate('/experiences')}
            >
              体験談を探すページに戻る
            </button>
          </div>
        )}

        {/* 検索結果表示 */}
        {!isLoading && !error && searchResults.length > 0 && (
          <>
            <div className={styles.cardsGrid}>
              {searchResults.map((result, index) => (
                <TweetCard 
                  key={result.id || index} 
                  cardId={result.id || index}
                  data={result}
                  relatedContext={{
                    type: 'search',
                    searchKeyword: urlKeyword,
                    searchFilters: appliedFilters,
                    relatedExperiences: searchResults
                  }}
                />
              ))}
            </div>
            
            {/* TOPへ戻るボタン */}
            <div className={styles.backToTopContainer}>
              <button 
                className={styles.backToTopButton}
                onClick={() => navigate('/experiences')}
              >
                体験談を探すTOPへ戻る
              </button>
            </div>
          </>
        )}
      </div>

      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filterConfig={filterConfig}
        onApply={handleApplyFilters}
        selectedFilters={tempFilters}
      />

      <Footer />
    </div>
  );
};

export default ExperiencesSearchResultsContent;
