import React, { useState, useEffect } from 'react';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './PlacesContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import PlaceCard from '../../common/PlaceCard/PlaceCard';
import FilterModal from '../../common/FilterModal';
import dotlineImage from '../../../assets/images/dotline.png';
import SearchIcon from '../../../assets/icons/SearchIcon';
import FilterIcon from '../../../assets/icons/FilterIcon';
import placeCards from '../../../data/placeCards';

const PlacesContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredCards, setFilteredCards] = useState(placeCards);

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
              
              // FilterModalが使用する固定キー
              // grade: お子さんの学年 (index 0)
              // situation: 状況 (index 1) 
              // facility: 施設の区分 (index 2)
              
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

  const handleApplyFilters = (count, filters) => {
    setFilterCount(count);
    setActiveFilters(filters);
  };

  const handleClearAll = () => {
    setSearchKeyword('');
    setActiveFilters({});
    setFilterCount(0);
  };

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '居場所をさがす', path: '/places' }
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

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* 検索セクション */}
      <div className={styles.searchSection}>
        <h1 className={styles.searchTitle}>居場所をさがす</h1>
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
            />
          </div>
          
          {/* ボタンエリア */}
          <div className={styles.buttonArea}>
            <div className={styles.filterRow}>
              <button 
                className={styles.filterButton}
                onClick={() => setIsModalOpen(true)}
              >
                <FilterIcon size={16} color="#88D3BC" />
                <span>絞り込み{filterCount > 0 && `(${filterCount})`}</span>
              </button>
              <button 
                className={styles.clearButton}
                onClick={handleClearAll}
              >
                クリア
              </button>
            </div>
            
            <button className={styles.searchButton} onClick={() => setSearchKeyword(searchKeyword)}>
              <SearchIcon size={18} color="#fff" />
              <span>検索する</span>
            </button>
          </div>
        </div>
      </div>

      {/* 居場所ピックアップセクション */}
      <div className={styles.pickupSection}>
        <h2 className={styles.pickupTitle}>居場所ピックアップ</h2>
        <div className={styles.dividerLine}></div>
        <p className={styles.pickupDescription}>
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
              <p>検索条件に一致する居場所が見つかりませんでした。</p>
              <p>キーワードやフィルタ条件を変更して再度検索してください。</p>
            </div>
          )}
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

export default PlacesContent;
