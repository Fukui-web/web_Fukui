import React from 'react';
import { useNavigate } from 'react-router-dom';
import commonStyles from './NavigationCommon.module.css';
import { searchItems } from '../../data/navigationItems';

const NavigationBottom = ({ onActionCompleted }) => {
  const navigate = useNavigate();

  // 検索項目クリックハンドラ
  const handleSearchItemClick = (item) => {
    console.log(`「${item}」がクリックされました`);
    
    if (item === '◯体験談をさがす') {
      navigate('/experiences');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (item === '◯居場所をさがす') {
      navigate('/places');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (item === '◯卒業後の進路をさがす') {
      navigate('/schools');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // メニューを閉じるなどの後処理
    if (onActionCompleted) {
      onActionCompleted();
    }
  };

  // フッタークリックハンドラ
  const handleFooterClick = () => {
    console.log("「プロジェクトと私たちについて」がクリックされました");
    // navigate('/about'); 

    if (onActionCompleted) {
      onActionCompleted();
    }
  };

  // 寄付ボタンクリックハンドラ
  const handleDonationClick = () => {
    console.log("寄付ボタンがクリックされました");
    // window.location.href = 'https://...'; // 寄付ページのURL

    if (onActionCompleted) {
      onActionCompleted();
    }
  };

  return (
    <>
      {/* 探してみようセクション */}
      <div className={commonStyles.searchSection}>
        <div className={commonStyles.searchTitle}>探してみよう</div>
        <div className={commonStyles.dividerLine}></div>
        <div className={commonStyles.searchItems}>
          {searchItems.map((item, index) => (
            <div 
              key={index}
              className={commonStyles.searchItem}
              onClick={() => handleSearchItemClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* プロジェクトと私たちについて */}
      <div 
        className={commonStyles.navFooter}
        onClick={handleFooterClick}
        style={{ cursor: 'pointer', marginBottom: '10px' }}
      >
        プロジェクトと私たちについて
      </div>

      {/* 寄付のお願いセクション */}
      <div className={commonStyles.donationSection}>
        <h3 className={commonStyles.donationTitle}>寄付のお願い</h3>
        <div className={commonStyles.dottedDivider}></div>
        <p className={commonStyles.donationText}>
          たくさんの新しい情報をお届けするためにみなさんのご支援をお願いします。
        </p>
        <button 
          className={commonStyles.donationButton}
          onClick={handleDonationClick}
        >
          月500円から寄付をする
        </button>
      </div>
    </>
  );
};

export default NavigationBottom;