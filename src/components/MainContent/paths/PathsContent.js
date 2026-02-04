import React, { useState, useEffect } from 'react';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './PathsContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import SchoolCard from '../../common/SchoolCard/SchoolCard';
import FilterModal from '../../common/FilterModal';
import dotlineImage from '../../../assets/images/dotline.png';
import SearchIcon from '../../../assets/icons/SearchIcon';
import FilterIcon from '../../../assets/icons/FilterIcon';
import schoolCards from '../../../data/schoolCards';

const PathsContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filteredCards, setFilteredCards] = useState(schoolCards);

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '卒業後の進路をさがす', path: '/schools' }
  ];

  const filterConfig = {
    selectedColor: '#79B5EE',
    buttonColor: '#79B5EE',
    categories: [
      {
        title: '形態からさがす',
        options: ['定時制高校', '通信制高校', 'サポート校', 'フリースクール']
      },
      {
        title: '授業スタイルからさがす',
        options: ['対面', 'オンライン', '選択可能', 'その他']
      },
      {
        title: '登校頻度からさがす',
        options: ['毎日登校', '週1~5選択制登校', '年数回のスクーリング(宿泊なし)', '年数回のスクーリング(宿泊あり)', 'その他']
      },
      {
        title: '入試の有無からさがす',
        options: ['試験なし', '試験なし(面接のみ)', '試験なし(書類のみ)', 'その他']
      },
      {
        title: '本校所在地からさがす',
        options: ['福井県内', '福井にキャンパスがある', '福井県外']
      }
    ]
  };

  /**
   * シンプルな文字列正規化
   * スペース・タブ・改行を削除し、小文字化するだけ
   */
  const normalizeText = (str) => {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[ 　\t\n]+/g, '').toLowerCase();
  };

  useEffect(() => {
    console.log("フィルタリング開始:", { searchTerm, selectedFilters });
    let results = schoolCards;

    // 1. キーワード検索
    if (searchTerm) {
      const term = normalizeText(searchTerm);
      results = results.filter(card => {
        const title = normalizeText(card.title);
        const body = normalizeText(card.body);
        const tags = normalizeText((card.tags || []).join(''));
        const details = card.detailInfo ? normalizeText(Object.values(card.detailInfo).join('')) : '';
        
        // searchTagsも検索対象に含める
        const searchTagsText = card.searchTags 
          ? normalizeText(Object.values(card.searchTags).flat().join(''))
          : '';
        
        const allText = title + body + tags + details + searchTagsText;
        return allText.includes(term);
      });
    }

    // 2. カテゴリフィルタ（searchTagsを使った改善版）
    Object.keys(selectedFilters).forEach(category => {
      const options = selectedFilters[category];
      if (options && options.length > 0) {
        
        console.log(`カテゴリ[${category}] で絞り込み中:`, options);

        results = results.filter(card => {
          // searchTagsが存在する場合はそれを優先的に使用
          if (card.searchTags) {
            return options.some(opt => {
              const optNorm = normalizeText(opt);
              
              // FilterModalが使用する固定キーに対応
              // grade: 形態からさがす (index 0)
              // trigger: きっかけ (index 1) 
              // support: サポート内容 (index 2)
              // period: 時期で絞り込む (index 100+)
              
              if (category === 'grade') {
                // 形態フィルター
                const typeTags = card.searchTags.type || [];
                return typeTags.some(tag => normalizeText(tag).includes(optNorm) || optNorm.includes(normalizeText(tag)));
              }
              
              if (category === 'trigger') {
                // 授業スタイル
                const styleTags = card.searchTags.style || [];
                return styleTags.some(tag => normalizeText(tag).includes(optNorm) || optNorm.includes(normalizeText(tag)));
              }
              
              if (category === 'support') {
                // 登校頻度
                const freqTags = card.searchTags.frequency || [];
                return freqTags.some(tag => normalizeText(tag).includes(optNorm) || optNorm.includes(normalizeText(tag)));
              }
              
              // 以下は追加のカテゴリ（filterConfigに合わせて調整が必要な場合）
              if (category === 'exam') {
                const examTags = card.searchTags.exam || [];
                return examTags.some(tag => normalizeText(tag).includes(optNorm) || optNorm.includes(normalizeText(tag)));
              }
              
              if (category === 'location') {
                const locTags = card.searchTags.location || [];
                return locTags.some(tag => normalizeText(tag).includes(optNorm) || optNorm.includes(normalizeText(tag)));
              }
              
              return false;
            });
          }
          
          // searchTagsがない場合は従来のロジック（後方互換性）
          const info = card.detailInfo || {};
          return options.some(opt => {
            const optNorm = normalizeText(opt);
            
            if (category === 'grade') {
              const tagsStr = normalizeText((card.tags || []).join(''));
              const suggestion = normalizeText(info.suggestion);
              const title = normalizeText(card.title);
              return tagsStr.includes(optNorm) || suggestion.includes(optNorm) || title.includes(optNorm);
            }

            if (category === 'trigger') {
              if (opt === 'その他') return false; 
              return normalizeText(info.style).includes(optNorm);
            }

            if (category === 'support') {
               const freq = normalizeText(info.frequency);
               if (opt.includes('週1~5')) return freq.includes('週1') || freq.includes('週one') || freq.includes('週１');
               if (opt.includes('宿泊なし')) return freq.includes('宿泊なし') || freq.includes('宿泊無し');
               if (opt === 'その他') return false;
               return freq.includes(optNorm);
            }

            if (category === 'exam') {
               const exam = normalizeText(info.exam);
               if (opt === '試験なし') return exam.includes('なし') || exam.includes('ありません');
               if (opt.includes('面接のみ')) return exam.includes('面接');
               if (opt.includes('書類のみ')) return exam.includes('書類');
               if (opt === 'その他') return false;
               return exam.includes(optNorm);
            }

            if (category === 'location') {
               const loc = normalizeText(info.location);
               const campus = normalizeText(info.campus);
               if (opt === '福井県内') return loc.includes('福井');
               if (opt === '福井にキャンパスがある') return campus.includes('あり') || loc.includes('福井');
               if (opt === '福井県外') return !loc.includes('福井');
            }

            return false;
          });
        });
      }
    });

    console.log("フィルタリング結果:", results.length, "件");
    setFilteredCards(results);
  }, [searchTerm, selectedFilters]);

  // --- イベントハンドラ ---
  const handleFilterApply = (count, filters) => {
    setFilterCount(count);
    setSelectedFilters(filters);
  };

  const handleSearchClick = () => {
    setSearchTerm(inputValue);
  };

  const handleClear = () => {
    setFilterCount(0);
    setSelectedFilters({});
    setInputValue('');
    setSearchTerm('');
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* 検索セクション */}
      <div className={styles.searchSection}>
        <h1 className={styles.searchTitle}>卒業後の進路をさがす</h1>
        <img src={dotlineImage} alt="" className={styles.dotline} />
        
        <div className={styles.searchBox}>
          <div className={styles.searchInputWrapper}>
            <SearchIcon size={20} color="#999" />
            <input 
              type="text" 
              placeholder="調べたい内容を、キーワードで記入してください。"
              className={styles.searchInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
            />
          </div>
          
          <div className={styles.buttonArea}>
            <div className={styles.filterRow}>
              <button 
                className={styles.filterButton}
                onClick={() => setIsModalOpen(true)}
              >
                <FilterIcon size={16} color="#79B5EE" />
                <span>絞り込み{filterCount > 0 && `(${filterCount})`}</span>
              </button>
              <button className={styles.clearButton} onClick={handleClear}>
                クリア
              </button>
            </div>
            <button className={styles.searchButton} onClick={handleSearchClick}>
              <SearchIcon size={18} color="#fff" />
              <span>検索する</span>
            </button>
          </div>
        </div>
      </div>

      {/* 結果一覧 */}
      <div className={styles.pickupSection}>
        <h2 className={styles.pickupTitle}>検索結果</h2>
        <div className={styles.dividerLine}></div>
        
        <div className={styles.cardsGrid}>
          {filteredCards.length > 0 ? (
            filteredCards.map(card => (
              <SchoolCard key={card.id} cardId={card.id} />
            ))
          ) : (
            <div className={styles.noResults}>
              <p>条件に一致する進路は見つかりませんでした。</p>
            </div>
          )}
        </div>
      </div>

      <FilterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filterConfig={filterConfig}
        onApply={handleFilterApply}
      />
      <Footer />
    </div>
  );
};

export default PathsContent;