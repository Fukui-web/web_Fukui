import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）
import styles from './ExperiencesContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import TweetCard from '../../common/TweetCard/TweetCard';
import FilterModal from '../../common/FilterModal';
import dotlineImage from '../../../assets/images/dotline.png';
import SearchIcon from '../../../assets/icons/SearchIcon';
import FilterIcon from '../../../assets/icons/FilterIcon';
import { getAllExperiences } from '../../../utils/gasApi';

const ExperiencesContent = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const [pickupExperiences, setPickupExperiences] = useState([]);
  const [isLoadingPickup, setIsLoadingPickup] = useState(true);

  // ピックアップ体験談を取得（上から6件）
  useEffect(() => {
    const loadPickupExperiences = async () => {
      setIsLoadingPickup(true);
      try {
        const allExperiences = await getAllExperiences();
        // 上から6件取得
        const pickup = allExperiences.slice(0, 6);
        setPickupExperiences(pickup);
      } catch (error) {
        console.error('ピックアップ体験談の取得エラー:', error);
        setPickupExperiences([]);
      } finally {
        setIsLoadingPickup(false);
      }
    };

    loadPickupExperiences();
  }, []);

  const handleApplyFilters = (count, selectedFilters) => {
    setFilterCount(count);
    setFilters(selectedFilters);
  };

  const handleClearFilters = () => {
    setFilterCount(0);
    setFilters({});
  };

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '体験談をさがす', path: '/experiences' }
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

  // 検索ボタンクリック
  const handleSearchClick = () => {
    console.log('=== ExperiencesContent handleSearchClick ===');
    console.log('searchKeyword:', searchKeyword);
    console.log('filterCount:', filterCount);
    
    // バリデーション: キーワードもフィルターも指定されていない場合
    if (!searchKeyword.trim() && filterCount === 0) {
      console.log('バリデーションエラー');
      setError('検索キーワードまたは絞り込み条件を指定してください。');
      return;
    }
    
    setError(null); // エラーをクリア
    const keyword = searchKeyword.trim() || '*'; // キーワードが空の場合は「*」（全検索）
    const queryParams = new URLSearchParams();
    queryParams.set('keyword', keyword);
    
    // フィルター情報をURLパラメータに追加
    if (filterCount > 0) {
      queryParams.set('filters', JSON.stringify(filters));
    }
    
    console.log('検索実行、navigate to:', `/experiences/search?${queryParams.toString()}`);
    navigate(`/experiences/search?${queryParams.toString()}`);
  };

  // Enterキーでの検索
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* 検索セクション */}
      <div className={styles.searchSection}>
        <h1 className={styles.searchTitle}>体験談をさがす</h1>
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
            >
              <SearchIcon size={18} color="#fff" />
              <span>検索する</span>
            </button>
          </div>
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {/* 体験談ピックアップセクション */}
      <div className={styles.pickupSection}>
        <h2 className={styles.pickupTitle}>体験談ピックアップ</h2>
        <div className={styles.dividerLine}></div>
        <p className={styles.pickupDescription}>
          みんなの体験談から、似ているところや参考にしたい情報をみつけてみてください。
        </p>
        
        {/* 体験談カードグリッド */}
        {isLoadingPickup ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>体験談を読み込み中...</p>
          </div>
        ) : pickupExperiences.length > 0 ? (
          <div className={styles.cardsGrid}>
            {pickupExperiences.map((experience, index) => (
              <TweetCard 
                key={experience.id || index} 
                cardId={experience.id}
                data={experience}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noDataContainer}>
            <p className={styles.noDataText}>表示できる体験談がありません。</p>
          </div>
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

export default ExperiencesContent;
