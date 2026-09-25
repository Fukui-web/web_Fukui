// src/components/MainContent/02/Section02Content.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './Section02Content.module.css';
import commonStyles from '../SectionCommon.module.css';
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import FlexiCard from '../../common/FlexiCard/FlexiCard';
import { getCardsByCategory } from '../../../data/flexiCardData';
import road02Image from '../../../assets/icons/ROAD02.png';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB2.png';

const Section02Content = () => {
  const navigate = useNavigate();

  return (
    <div className={`${layoutStyles.pageContainer} ${styles.section02Content}`}>
      <Helmet>
        <title>公的支援や医療機関｜ぼくらのみち</title>
        <meta name="description" content="不登校の子どもや保護者が利用できる公的機関の支援や医療機関を紹介します。福井県内の相談窓口、カウンセリング情報も掃羅。" />
        <link rel="canonical" href="https://bokuranomichi-fukui.com/section02" />
        <meta property="og:title" content="公的支援や医療機関｜ぼくらのみち" />
        <meta property="og:description" content="不登校の子どもや保護者が利用できる公的機関の支援や医療機関を紹介します。" />
        <meta property="og:url" content="https://bokuranomichi-fukui.com/section02" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://bokuranomichi-fukui.com/title.png" />
        <meta name="twitter:card" content="summary_large_image" />
        {/* BreadcrumbList は Breadcrumbs コンポーネントが出力するため、ここには書かない */}
      </Helmet>

      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="02" sectionTitle="行政が行う公的支援" />

      {/* タイトル部分 */}
      <div className={commonStyles.pageTitleSection}>
        <img src={road02Image} alt="ROAD 02" className={commonStyles.pageRoadImage} />
        <h1 className={commonStyles.pageMainTitle}>公的支援や医療機関</h1>
        <img src={dotlineImage} alt="点線" className={commonStyles.pageDotline} />
      </div>

      {/* 説明セクション */}
      <div className={commonStyles.pageDescriptionSection}>
        <h2 className={commonStyles.pageDescriptionTitle}>
          学校以外で支援や相談に乗ってくれるところです。
        </h2>
        <div className={commonStyles.pageDividerLine}></div>
        <p className={commonStyles.pageDescriptionText}>
          学校での相談が思うように進まなかったり、欲しい情報が得られなかったりすることもあります。まずはお近くの窓口で相談してみてください。
        </p>
      </div>

      {/* 相談窓口カードセクション */}
      <div className={styles.consultationSection}>
        <div className={styles.flexiCardArea}>
          {getCardsByCategory('prefecture').map((card) => (
            <FlexiCard
              key={card.id}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              phone={card.phone}
              phones={card.phones}
              url={card.url}
            />
          ))}
        </div>
      </div>

      {/* 各市町の情報セクション */}
      <div className={styles.municipalSection}>
        <p className={styles.municipalIntro}>
          各市町で独自に行なっている支援もあります。
        </p>
        <div className={commonStyles.pageDividerLine}></div>
        <p className={styles.municipalDescription}>
          各自治体の情報をまとめました。お住まいの地域を探してみてください。
        </p>
        <div className={styles.flexiCardArea}>
          {getCardsByCategory('municipal').map((card) => (
            <FlexiCard
              key={card.id}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              phone={card.phone}
              phones={card.phones}
              url={card.url}
            />
          ))}
        </div>
      </div>

      {/* 行政・医療機関一覧ボタン */}
      <button className={styles.listButton} onClick={() => { navigate('/school-info'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
        <span>行政・医療機関一覧を見る</span>
      </button>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section02Content;