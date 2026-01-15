import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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

const ExperiencesSearchResultsContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [filters, setFilters] = useState({});
  
  // 検索結果の状態管理
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // URLパラメータから検索キーワードとフィルターを取得
  const urlKeyword = searchParams.get('keyword') || '';
  const urlFilters = searchParams.get('filters');

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '体験談を探す', path: '/experiences' },
    { label: '検索結果', path: `/experiences/search?keyword=${urlKeyword}` }
  ];

  const filterConfig = {
    selectedColor: '#EF9F94',
    buttonColor: '#EF9F94',
    categories: [
      {
        title: '初めて不登校になった学年',
        options: ['小学校1年生', '小学校2年生', '小学校3年生', '小学校4年生', '小学校5年生', '小学校6年生', '中学校1年生', '中学校2年生', '中学校3年生']
      },
      {
        title: '不登校になったきっかけ',
        options: ['いじめ／友人関係', '勉強のつまずき', '発達特性・体調要因', '教師や学校との関係', 'はっきりとした原因が無い', 'その他']
      },
      {
        title: '利用したサポートの種類',
        options: ['公的なフリースクール', 'スクールカウンセラー', '学校内の支援教室（校内サポートルーム等）', 'スクールソーシャルワーカー', '心のパートナー', '行政の相談窓口', '行政主催のお話会やイベント', '民間のフリースクール', '民間の学習支援', '民間主催のお話会やイベント', '民間の相談窓口', 'その他']
      }
    ]
  };

  // 初回レンダリング時に検索を実行
  useEffect(() => {
    // URLからフィルター情報を取得
    let initialFilters = {};
    if (urlFilters) {
      try {
        initialFilters = JSON.parse(urlFilters);
        setFilters(initialFilters);
        // フィルター数をカウント
        const count = Object.values(initialFilters).reduce((sum, arr) => sum + arr.length, 0);
        setFilterCount(count);
      } catch (e) {
        console.error('フィルターのパースエラー:', e);
      }
    }
    
    if (urlKeyword) {
      const keyword = urlKeyword === '*' ? '' : urlKeyword; // '*'の場合は空文字に変換
      setSearchKeyword(keyword);
      handleSearch(urlKeyword, initialFilters);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKeyword, urlFilters]);

  // 検索処理
  const handleSearch = async (keyword, currentFilters = {}) => {
    // キーワードが'*'（全検索）または空でフィルターがある場合は検索実行
    const searchKeyword = keyword === '*' ? '' : keyword;
    
    if (!searchKeyword.trim() && Object.keys(currentFilters).length === 0) {
      setError('検索キーワードまたは絞り込み条件を指定してください。');
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
    console.log('=== handleSearchClick called ===');
    console.log('searchKeyword:', searchKeyword);
    console.log('searchKeyword.trim():', searchKeyword.trim());
    console.log('filterCount:', filterCount);
    console.log('filters:', filters);
    
    // バリデーション: キーワードもフィルターも指定されていない場合
    if (!searchKeyword.trim() && filterCount === 0) {
      console.log('バリデーションエラー: キーワードとフィルターが両方未指定');
      setError('検索キーワードまたは絞り込み条件を指定してください。');
      return;
    }

    console.log('バリデーション通過、検索を実行');
    const keyword = searchKeyword.trim() || '*';
    const queryParams = new URLSearchParams();
    queryParams.set('keyword', keyword);
    
    if (filterCount > 0) {
      queryParams.set('filters', JSON.stringify(filters));
    }
    
    console.log('navigate to:', `/experiences/search?${queryParams.toString()}`);
    navigate(`/experiences/search?${queryParams.toString()}`);
    handleSearch(keyword, filters);
  };

  // Enterキーでの検索
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // フィルター適用
  const handleApplyFilters = (count, selectedFilters) => {
    console.log('フィルター適用:', { count, selectedFilters }); // デバッグログ
    setFilterCount(count);
    setFilters(selectedFilters);
    // 決定ボタンを押しただけでは検索を実行しない（検索ボタンを押した時のみ検索）
  };

  // クリアボタン
  const handleClearFilters = () => {
    console.log('=== handleClearFilters called ===');
    setFilterCount(0);
    setFilters({});
    setSearchKeyword('');
  };

  return (
    <div className={layoutStyles.pageContainer}>
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
                <span>絞り込み{filterCount > 0 && `(${filterCount})`}</span>
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

        {/* 絞り込み条件の表示 */}
        {filterCount > 0 && (
          <div className={styles.activeFilters}>
            <span className={styles.filterLabel}>絞り込み条件:</span>
            <div className={styles.filterTags}>
              {filters.grade && filters.grade.map((item, index) => (
                <span key={`grade-${index}`} className={styles.filterTag}>
                  {item}
                </span>
              ))}
              {filters.trigger && filters.trigger.map((item, index) => (
                <span key={`trigger-${index}`} className={styles.filterTag}>
                  {item}
                </span>
              ))}
              {filters.support && filters.support.map((item, index) => (
                <span key={`support-${index}`} className={styles.filterTag}>
                  {item}
                </span>
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
      />

      <Footer />
    </div>
  );
};

export default ExperiencesSearchResultsContent;
