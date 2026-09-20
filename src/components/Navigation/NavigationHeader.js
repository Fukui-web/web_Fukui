import React from 'react';
import { useNavigate } from 'react-router-dom';
import commonStyles from './NavigationCommon.module.css';

// 共通のNavigationHeaderコンポーネント
// onNavigate: 遷移後に呼ぶ処理。ハンバーガーメニューを閉じるために使う。
const NavigationHeader = ({ isHamburger = false, onNavigate }) => {
  const navigate = useNavigate();

  // タップ/クリック時の処理
  const handleLogoClick = () => {
    // ホームページに遷移する処理
    navigate('/');
    if (onNavigate) onNavigate();
  };

  const handleTitleClick = () => {
    // タイトルクリック時もホームページに遷移
    navigate('/');
    if (onNavigate) onNavigate();
  };

  return (
    <div className={commonStyles.navHeader}>
      <p 
        className={commonStyles.navHeaderTitle}
        onClick={handleTitleClick}
        style={{ cursor: 'pointer' }}
      >
        経験者の声から生まれた不登校情報サイト
      </p>
      
      <div 
        className={commonStyles.navLogo}
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      ></div>
      
      <div 
        className={commonStyles.navHeaderSubtitle}
        onClick={handleTitleClick}
        style={{ cursor: 'pointer' }}
      >
        福井県版
      </div>
    </div>
  );
};

export default NavigationHeader;
