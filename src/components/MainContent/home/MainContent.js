// src/components/MainContent/home/MainContent.js

import React from 'react';
/* --- 修正箇所 開始 --- */
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）をインポート
/* --- 修正箇所 終了 --- */
import styles from './MainContent.module.css'; // 固有CSS（内側）
import TitleSection from './TitleSection';
import OpeningSection from './OpeningSection';
import Section00 from './Section00';
import Section01 from './Section01';
import Section02 from './Section02';
import Section03 from './Section03';
import Section04 from './Section04';
import Section05 from './Section05';
import Banner from '../../Banner';
import Footer from '../../common/Footer';

const MainContent = () => {
  return (
    /* --- 修正箇所 開始 --- */
    // 共通の「外枠」と、HomePage固有の「内側」のスタイルを両方適用
    <div className={`${layoutStyles.pageContainer} ${styles.mainContent}`}>
    {/* --- 修正箇所 終了 --- */ }
      {/* ヘッダーセクション */}
      <div className={styles.headerSection}>
        <TitleSection />
        <OpeningSection />
      </div>
      
      {/* ROADセクション群 */}
      <div className={styles.roadSections}>
        <Section00 />
        <Section01 />
        <Section02 />
        <Section03 />
        <Section04 />
        <Section05 />
      </div>
      
      {/* インラインバナー */}
      <div className={styles.inlineBannerWrapper}>
        <Banner />
      </div>
      
      {/* フッター */}
      <Footer />
    </div>
  );
};

export default MainContent;