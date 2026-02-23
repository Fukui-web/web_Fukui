// src/components/common/Footer/Footer.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';
// 1. logo1 から Footer_logo.png にインポートを変更
import footerLogo from '../../../assets/icons/Footer_logo.png'; 

const Footer = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    console.log('フッターロゴがクリックされました - ホームページに遷移');
    // ホームページに遷移
    navigate('/');
    // ページトップにスクロール
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 2. リスト項目用のクリックハンドラを追加
  const handleListClick = (item) => {
    console.log(`${item} がクリックされました`);
    // 体験談をさがすページに遷移
    if (item === '体験談をさがす') {
      navigate('/experiences');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // 居場所をさがすページに遷移
    if (item === 'みんなの居場所をさがす') {
      navigate('/places');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // 卒業後の進路をさがすページに遷移
    if (item === '中学卒業後の進路をさがす') {
      navigate('/paths');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // 体験談の投稿ページに遷移
    if (item === '体験談の投稿') {
      navigate('/experiences/post');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <button 
          className={styles.footerLogo}
          onClick={handleLogoClick}
          aria-label="ホームページに戻る"
        >
          {/* 3. src と alt を変更 */}
          <img src={footerLogo} alt="ぼくらのみち 福井県版" className={styles.logoImage} />
        </button>
        
        {/* 採択プランテキスト */}
        <p className={styles.adoptionText}>
          【福井県ワクワクチャレンジプランコンテスト2025採択プラン】
        </p>
        
        {/* 4. 既存の .footerMenu を削除し、新しい .footerList に変更 */}
        <ul className={styles.footerList}>
          <li onClick={() => handleListClick('体験談をさがす')}>体験談をさがす</li>
          <li onClick={() => handleListClick('みんなの居場所をさがす')}>居場所をさがす</li>
          <li onClick={() => handleListClick('中学卒業後の進路をさがす')}>卒業後の進路をさがす</li>
          <li className={styles.lastRow}>
            <span onClick={() => handleListClick('学校・行政・医療情報の一覧')}>学校・行政・医療情報の一覧</span>
            <span className={styles.submitButton} onClick={() => handleListClick('体験談の投稿')}>体験談を投稿する</span>
          </li>
        </ul>
      </div>
      
      {/* 管理者画面へのリンク */}
      <button 
        className={styles.adminLink}
        onClick={() => navigate('/admin')}
        aria-label="管理者画面"
      >
        管理者画面
      </button>
    </footer>
  );
};

export default Footer;