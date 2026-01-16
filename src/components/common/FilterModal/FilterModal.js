import React, { useState } from 'react';
import ReactDOM from 'react-dom'; // 1. ReactDOMをインポート
import styles from './FilterModal.module.css';

const FilterModal = ({ isOpen, onClose, filterConfig, onApply }) => {
  const [activeTab, setActiveTab] = useState('condition'); // 'condition' or 'period'
  const [selectedTags, setSelectedTags] = useState([]);

  if (!isOpen) return null;

  // タブ切り替え時に他方のフィルターをクリア
  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      // 切り替え前のタブの選択をクリア
      if (tab === 'condition') {
        // 時期フィルター（100番台）をクリア
        setSelectedTags(prev => prev.filter(tag => {
          const index = parseInt(tag.split('_')[0]);
          return index < 100;
        }));
      } else {
        // 条件フィルター（0-2番）をクリア
        setSelectedTags(prev => prev.filter(tag => {
          const index = parseInt(tag.split('_')[0]);
          return index >= 100;
        }));
      }
    }
    setActiveTab(tab);
  };

  const toggleTag = (tag, categoryIndex) => {
    const uniqueTag = `${categoryIndex}_${tag}`;
    
    // 時期フィルター（index >= 100）の場合は、1つのみ選択可能
    if (categoryIndex >= 100) {
      setSelectedTags(prev => {
        // すでに選択されている場合は解除
        if (prev.includes(uniqueTag)) {
          return prev.filter(t => t !== uniqueTag);
        }
        // 他の時期フィルターをクリアして新しいものを選択
        return [...prev.filter(t => {
          const index = parseInt(t.split('_')[0]);
          return index < 100; // 条件フィルターは残す
        }), uniqueTag];
      });
    } else {
      // 条件フィルターは複数選択可能（既存の動作）
      setSelectedTags(prev => 
        prev.includes(uniqueTag) 
          ? prev.filter(t => t !== uniqueTag)
          : [...prev, uniqueTag]
      );
    }
  };

  const getDisplayTag = (uniqueTag) => {
    return uniqueTag.split('_').slice(1).join('_');
  };

  const isTagSelected = (tag, categoryIndex) => {
    const uniqueTag = `${categoryIndex}_${tag}`;
    return selectedTags.includes(uniqueTag);
  };

  const handleDecide = () => {
    if (onApply) {
      // カテゴリごとにフィルターを整理
      const filters = {
        grade: [],
        trigger: [],
        support: [],
        period: []
      };

      selectedTags.forEach(uniqueTag => {
        const [categoryIndex, ...tagParts] = uniqueTag.split('_');
        const tag = tagParts.join('_');
        const index = parseInt(categoryIndex);

        // カテゴリインデックスに基づいてフィルターを分類
        if (index === 0) filters.grade.push(tag);
        else if (index === 1) filters.trigger.push(tag);
        else if (index === 2) filters.support.push(tag);
        else if (index >= 100) filters.period.push(tag); // 時期フィルターは100番台
      });

      onApply(selectedTags.length, filters);
    }
    onClose();
  };

  // 時期フィルターのカテゴリ定義（タブが「時期で絞りこむ」の場合に使用）
  const periodCategories = [
    {
      title: '登校渋り期',
      key: 'reluctance',
      index: 100
    },
    {
      title: '混乱期',
      key: 'confusion',
      index: 101
    },
    {
      title: '安定期',
      key: 'stable',
      index: 102
    },
    {
      title: '回復期',
      key: 'recovery',
      index: 103
    }
  ];

  // 2. モーダルの内容全体を ReactDOM.createPortal でラップし、document.body に描画する
  return ReactDOM.createPortal(
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <div className={styles.tagContainer}>
              {selectedTags.map(uniqueTag => (
                <span key={uniqueTag} className={styles.selectedTag}>
                  {getDisplayTag(uniqueTag)}
                  <button onClick={() => toggleTag(getDisplayTag(uniqueTag), parseInt(uniqueTag.split('_')[0]))} className={styles.tagRemove}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* タブ切り替え */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'condition' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('condition')}
          >
            条件で絞りこむ
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'period' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('period')}
          >
            時期で絞りこむ
          </button>
        </div>

        <div className={styles.filterContent}>
          {activeTab === 'condition' ? (
            // 条件フィルター（既存の実装）
            filterConfig.categories.map((category, index) => (
              <div key={index} className={styles.filterCategory}>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
                <div className={styles.buttonGroup}>
                  {category.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      className={`${styles.filterButton} ${
                        isTagSelected(option, index) ? styles.selected : ''
                      }`}
                      style={{
                        backgroundColor: isTagSelected(option, index) 
                          ? filterConfig.selectedColor 
                          : '#FFFFFF',
                        color: isTagSelected(option, index) 
                          ? '#FFFFFF' 
                          : '#333333',
                        borderColor: isTagSelected(option, index)
                          ? filterConfig.selectedColor
                          : '#E0E0E0'
                      }}
                      onClick={() => toggleTag(option, index)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // 時期フィルター（新規実装）
            <div className={styles.filterCategory}>
              <div className={styles.buttonGroup}>
                {periodCategories.map((category) => (
                  <button
                    key={category.key}
                    className={`${styles.filterButton} ${
                      isTagSelected(category.title, category.index) ? styles.selected : ''
                    }`}
                    style={{
                      backgroundColor: isTagSelected(category.title, category.index) 
                        ? filterConfig.selectedColor 
                        : '#FFFFFF',
                      color: isTagSelected(category.title, category.index) 
                        ? '#FFFFFF' 
                        : '#333333',
                      borderColor: isTagSelected(category.title, category.index)
                        ? filterConfig.selectedColor
                        : '#E0E0E0'
                    }}
                    onClick={() => toggleTag(category.title, category.index)}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          className={styles.decideButton}
          style={{ backgroundColor: filterConfig.buttonColor }}
          onClick={handleDecide}
        >
          決定
        </button>
      </div>
    </>,
    document.body // ポータルの描画先を指定
  );
};

export default FilterModal;