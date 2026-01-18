import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）
import styles from './ExperiencesContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import TweetCard from '../../common/TweetCard/TweetCard';
import FilterModal from '../../common/FilterModal';
import dotlineImage from '../../../assets/images/dotline.png';
import SearchIcon from '../../../assets/icons/SearchIcon';
import FilterIcon from '../../../assets/icons/FilterIcon';
import { getAllExperiences, getExperiencesByQuestion } from '../../../utils/gasApi';

const ExperiencesContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get('questionId'); // URLパラメータから取得
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const [pickupExperiences, setPickupExperiences] = useState([]);
  const [isLoadingPickup, setIsLoadingPickup] = useState(true);
  const [pickupError, setPickupError] = useState(null);
  const [noPickupData, setNoPickupData] = useState(false);

  // 質問IDに対応するセクション名を取得
  const getSectionName = (qId) => {
    const sectionNames = {
      '2-2': '不登校のきっかけ',
      '2-11': '学校との繋がり',
      '4-1-3': '卒業後の進路',
      '4-2-3': '卒業後の進路',
      '4-3-3': '卒業後の進路',
      '6-1-5': '公的支援の利用',
      '6-2-5': '公的支援の利用',
      '6-3-5': '公的支援の利用'
    };
    return sectionNames[qId] || null;
  };

  const sectionName = getSectionName(questionId);

  // ピックアップ体験談を取得
  useEffect(() => {
    const loadPickupExperiences = async () => {
      setIsLoadingPickup(true);
      setPickupError(null);
      setNoPickupData(false);
      
      try {
        if (questionId) {
          // questionIdが指定されている場合は、対応する体験談を取得
          const result = await getExperiencesByQuestion(questionId, 6);
          
          if (result.errorType) {
            setPickupError('体験談の取得に失敗しました');
            setPickupExperiences([]);
          } else if (result.noData || result.data.length === 0) {
            setNoPickupData(true);
            setPickupExperiences([]);
          } else {
            setPickupExperiences(result.data);
          }
        } else {
          // questionIdがない場合は、全体験談から上位6件を取得
          const allExperiences = await getAllExperiences();
          const pickup = allExperiences.slice(0, 6);
          
          if (pickup.length === 0) {
            setNoPickupData(true);
          }
          setPickupExperiences(pickup);
        }
      } catch (error) {
        console.error('ピックアップ体験談の取得エラー:', error);
        setPickupError('体験談の取得に失敗しました');
        setPickupExperiences([]);
      } finally {
        setIsLoadingPickup(false);
      }
    };

    loadPickupExperiences();
  }, [questionId]);

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
        <h2 className={styles.pickupTitle}>
          {sectionName ? `${sectionName}に関連する体験談` : '最新の体験談'}
        </h2>
        <div className={styles.dividerLine}></div>
        <p className={styles.pickupDescription}>
          {sectionName 
            ? `${sectionName}に関連する体験談を表示しています。`
            : '最新の体験談を表示しています。似ているところや参考にしたい情報をみつけてみてください。'
          }
        </p>
        
        {/* 体験談カードグリッド */}
        {isLoadingPickup ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>体験談を読み込み中...</p>
          </div>
        ) : pickupError ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>⚠️ 取得エラー: {pickupError}</p>
            <p className={styles.errorSubText}>データの取得に失敗しました。時間をおいて再度お試しください。</p>
          </div>
        ) : noPickupData ? (
          <div className={styles.noDataContainer}>
            <p className={styles.noDataText}>該当する体験談がまだありません</p>
            <p className={styles.noDataSubText}>
              {sectionName 
                ? '他のカテゴリの体験談をご覧いただくか、検索機能をお試しください。'
                : '体験談が投稿されるとここに表示されます。'
              }
            </p>
          </div>
        ) : pickupExperiences.length > 0 ? (
          <div className={styles.cardsGrid}>
            {pickupExperiences.map((experience, index) => (
              <TweetCard 
                key={experience.id || index} 
                cardId={experience.id}
                data={experience}
                relatedContext={{
                  type: questionId ? 'question' : 'pickup',
                  questionId: questionId,
                  sectionName: sectionName,
                  relatedExperiences: pickupExperiences
                }}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noDataContainer}>
            <p className={styles.noDataText}>表示できる体験談がありません</p>
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
