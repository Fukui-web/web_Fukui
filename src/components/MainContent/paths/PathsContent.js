import React, { useState } from 'react';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './PathsContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import SchoolCard from '../../common/SchoolCard/SchoolCard';
import FilterModal from '../../common/FilterModal';
import dotlineImage from '../../../assets/images/dotline.png';
import SearchIcon from '../../../assets/icons/SearchIcon';
import FilterIcon from '../../../assets/icons/FilterIcon';

const PathsContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '卒業後の進路をさがす', path: '/schools' }
  ];

  const filterConfig = {
    selectedColor: '#79B5EE',
    buttonColor: '#79B5EE',
    categories: [
      {
        title: 'お子さんの学年からさがす',
        options: ['小学生', '中学生', '高校生', '卒業生']
      },
      {
        title: '施設の区分からさがす',
        options: ['フリースクール', '塾', 'オンラインサポート', 'サークル', 'オルタナティブスクール', '習い事', 'イベント']
      },
      {
        title: '状況からさがす',
        options: ['#進学したい', '#専門的なことを学びたい', '#一人で学習したい', '#オンラインで授業を受けたい', '#学校行事に参加したい', '#家以外の場所での居場所を見つけたい', '#外部とコミュニケーションを取れる場所に行きたい', '#不登校や子育てについて相談したい', '#不登校や子育ての未来について見失わない', '#不登校や子育てのイベントに参加したい', '#友達をさがしたい']
      }
    ]
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* 検索セクション */}
      <div className={styles.searchSection}>
        <h1 className={styles.searchTitle}>卒業後の進路をさがす</h1>
        <img src={dotlineImage} alt="" className={styles.dotline} />
        
        <div className={styles.searchBox}>
          {/* 検索入力フィールド */}
          <div className={styles.searchInputWrapper}>
            <SearchIcon size={20} color="#999" />
            <input 
              type="text" 
              placeholder="調べたい内容を、キーワードで記入してください。"
              className={styles.searchInput}
            />
          </div>
          
          {/* ボタンエリア */}
          <div className={styles.buttonArea}>
            <div className={styles.filterRow}>
              <button 
                className={styles.filterButton}
                onClick={() => setIsModalOpen(true)}
              >
                <FilterIcon size={16} color="#79B5EE" />
                <span>絞り込み{filterCount > 0 && `(${filterCount})`}</span>
              </button>
              <button 
                className={styles.clearButton}
                onClick={() => setFilterCount(0)}
              >
                クリア
              </button>
            </div>
            
            <button className={styles.searchButton}>
              <SearchIcon size={18} color="#fff" />
              <span>検索する</span>
            </button>
          </div>
        </div>
      </div>

      {/* 進路ピックアップセクション */}
      <div className={styles.pickupSection}>
        <h2 className={styles.pickupTitle}>検索結果</h2>
        <div className={styles.dividerLine}></div>
        
        {/* 進路カードグリッド */}
        <div className={styles.cardsGrid}>
          <SchoolCard cardId={9} />
          <SchoolCard cardId={10} />
          <SchoolCard cardId={8} />
          <SchoolCard cardId={5} />
        </div>
      </div>

      <FilterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filterConfig={filterConfig}
        onApply={setFilterCount}
      />

      <Footer />
    </div>
  );
};

export default PathsContent;
