import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './PlaceSearchResults.module.css';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import PlaceCard from '../../components/common/PlaceCard/PlaceCard';
import FilterModal from '../../components/common/FilterModal';
import SearchIcon from '../../assets/icons/SearchIcon';
import FilterIcon from '../../assets/icons/FilterIcon';
import placeCards from '../../data/placeCards';

/**
 * PlaceSearchResults
 * - 居場所検索結果ページ
 * - キーワード検索とフィルタリング機能を実装
 */
const PlaceSearchResults = () => {
  const location = useLocation();
  // 初期状態: location.stateがない場合は空オブジェクト
  const [activeFilters, setActiveFilters] = useState(location.state?.filters || {});
  const [searchKeyword, setSearchKeyword] = useState(location.state?.keyword || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [filteredCards, setFilteredCards] = useState(placeCards);
  
  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '居場所をさがす', path: '/places' },
    { label: '検索結果', path: '/places/search' }
  ];

  const filterConfig = {
    selectedColor: '#88D3BC',
    buttonColor: '#88D3BC',
    categories: [
      {
        title: 'お子さんの学年からさがす',
        options: ['小学生から', '中学生から', '高校生から', '卒業している場合']
      },
      {
        title: '状況からさがす',
        options: ['進学したい', '専門的なことを学びたい', '一人で学習したい', 'オンラインで授業を受けたい', '学校行事に参加したい', '家以外の場所での居場所を見つけたい', '外部とコミュニケーションを取れる場所に行きたい', '不登校や子育てについて相談したい', '不登校や子育ての未来について見失わない', '不登校や子育てのイベントに参加したい', '友達をさがしたい']
      },
      {
        title: '施設の区分からさがす',
        options: ['フリースクール', '塾', 'オンラインサポート', 'サークル', 'オルタナティブスクール', '習い事', 'イベント']
      }
    ]
  };

  /**
   * 文字列正規化
   */
  const normalizeText = (str) => {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[ 　\t\n]+/g, '').toLowerCase();
  };

  // フィルタリングロジック
  useEffect(() => {
    console.log("居場所フィルタリング開始:", { searchKeyword, activeFilters });
    let results = placeCards;

    // 1. キーワード検索
    if (searchKeyword) {
      const term = normalizeText(searchKeyword);
      results = results.filter(card => {
        const title = normalizeText(card.title);
        const body = normalizeText(card.body);
        const tags = card.tags ? normalizeText(card.tags.join('')) : '';
        const details = card.detailInfo ? normalizeText(Object.values(card.detailInfo).join('')) : '';
        
        const searchTagsText = card.searchTags 
          ? normalizeText(Object.values(card.searchTags).flat().join(''))
          : '';
        
        const allText = title + body + tags + details + searchTagsText;
        return allText.includes(term);
      });
    }

    // 2. カテゴリフィルタ
    Object.keys(activeFilters).forEach(category => {
      const options = activeFilters[category];
      if (options && options.length > 0) {
        
        console.log(`カテゴリ[${category}] で絞り込み中:`, options);

        results = results.filter(card => {
          if (card.searchTags) {
            return options.some(opt => {
              const optNorm = normalizeText(opt);
              
              if (category === 'grade') {
                const gradeTags = card.searchTags.grade || [];
                return gradeTags.some(tag => normalizeText(tag).includes(optNorm) || optNorm.includes(normalizeText(tag)));
              }
              
              if (category === 'situation') {
                const situationTags = card.searchTags.situation || [];
                return situationTags.some(tag => normalizeText(tag).includes(optNorm) || optNorm.includes(normalizeText(tag)));
              }
              
              if (category === 'facility') {
                const facilityTags = card.searchTags.facility || [];
                return facilityTags.some(tag => normalizeText(tag).includes(optNorm) || optNorm.includes(normalizeText(tag)));
              }
              
              return false;
            });
          }
          return false;
        });
      }
    });

    console.log("居場所フィルタリング結果:", results.length, "件");
    setFilteredCards(results);
  }, [searchKeyword, activeFilters]);

  const getDisplayTag = (uniqueTag) => {
    // タグの表示形式を調整（必要に応じてロジック修正）
    if (!uniqueTag) return '';
    return uniqueTag.includes('_') ? uniqueTag.split('_').slice(1).join('_') : uniqueTag;
  };

  // フィルタ削除処理（オブジェクト構造に対応）
  const removeFilter = (tagToRemove) => {
    setActiveFilters(prev => {
      const nextFilters = { ...prev };
      Object.keys(nextFilters).forEach(key => {
        nextFilters[key] = nextFilters[key].filter(t => t !== tagToRemove);
        // 配列が空になったらキーごと削除するか、空配列のままにするかの方針による
        // ここでは空配列を残す形にしますが、必要なら delete nextFilters[key] してください
      });
      return nextFilters;
    });
    setFilterCount(prev => Math.max(0, prev - 1));
  };

  const removeKeyword = () => {
    setSearchKeyword('');
  };

  const handleApplyFilters = (count, filters) => {
    setFilterCount(count);
    setActiveFilters(filters);
  };

  const handleClearAll = () => {
    setSearchKeyword('');
    setActiveFilters({});
    setFilterCount(0);
  };

  // 検索アイコンクリック時の動作（useEffectで自動検索されるなら空でもOK）
  const handleReSearch = () => {
    console.log('検索実行', searchKeyword);
  };

  // activeFilters（オブジェクト）から表示用のタグリストを生成
  const displayTags = Object.values(activeFilters).flat();

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={styles.contentArea}>
        {/* 検索エリア */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <div className={styles.searchInputWrapper}>
              <button className={styles.searchIconButton} onClick={handleReSearch}>
                <SearchIcon size={20} color="#999" />
              </button>
              <input 
                type="text" 
                placeholder="キーワードを入力して検索"
                className={styles.searchInput}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleReSearch()}
              />
            </div>
            
            <div className={styles.filterArea}>
              <button 
                className={styles.clearButton}
                onClick={handleClearAll}
              >
                クリア
              </button>
              
              <button 
                className={styles.filterButton}
                onClick={() => setIsModalOpen(true)}
              >
                <FilterIcon size={16} color="#88D3BC" />
                <span>絞り込み{filterCount > 0 && `(${filterCount})`}</span>
              </button>
              
              {searchKeyword && (
                <div className={styles.filterTag}>
                  <span>{searchKeyword}</span>
                  <button 
                    className={styles.tagRemove}
                    onClick={removeKeyword}
                  >
                    ×
                  </button>
                </div>
              )}
              
              {/* オブジェクトからタグを展開して表示 */}
              {displayTags.map((tag, index) => (
                <div key={`${tag}-${index}`} className={styles.filterTag}>
                  <span>{getDisplayTag(tag)}</span>
                  <button 
                    className={styles.tagRemove}
                    onClick={() => removeFilter(tag)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.resultsSection}>
          <h2 className={styles.resultsTitle}>検索結果</h2>
          <div className={styles.dividerLine}></div>
          <p className={styles.resultsDescription}>
            みんなの居場所から、お子さんや保護者の方に合う場所をみつけてみてください。
          </p>
          
          {/* 居場所カードグリッド */}
          <div className={styles.cardsGrid}>
            {filteredCards.length > 0 ? (
              filteredCards.map(card => (
                <PlaceCard key={card.id} cardId={card.id} />
              ))
            ) : (
              <div className={styles.noResults}>
                <p>条件に一致する居場所は見つかりませんでした。</p>
              </div>
            )}
          </div>
        </div>
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

export default PlaceSearchResults;