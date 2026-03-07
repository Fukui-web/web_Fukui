import React from 'react';
import { Helmet } from 'react-helmet-async';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './FlexiCardListPage.module.css';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import FlexiCard from '../../components/common/FlexiCard/FlexiCard';
import { getCardsByCategory } from '../../data/flexiCardData';
import dotlineImage from '../../assets/images/dotline.png';

const FlexiCardListPage = () => {
  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '学校・行政・医療情報の一覧', path: '/school-info' }
  ];

  return (
    <div className={layoutStyles.pageContainer}>
      <Helmet>
        <title>学校・行政・医療情報の一覧｜ぼくらのみち</title>
        <meta name="description" content="福井県内の学校・行政機関・医療機関の情報一覧です。不登校の相談先や支援相談窓口を掲載します。" />
        <link rel="canonical" href="https://bokuranomichi-fukui.com/school-info" />
        <meta property="og:title" content="学校・行政・医療情報の一覧｜ぼくらのみち" />
        <meta property="og:description" content="福井県内の学校・行政機関・医療機関の情報一覧です。" />
        <meta property="og:url" content="https://bokuranomichi-fukui.com/school-info" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://bokuranomichi-fukui.com/title.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={layoutStyles.contentArea}>
        {/* タイトルセクション */}
        <section className={styles.titleSection}>
          <h1 className={styles.pageTitle}>学校・行政・医療情報の一覧</h1>
        </section>
        <div className={styles.dotlineContainer}>
          <img src={dotlineImage} alt="" className={styles.dotline} />
        </div>

        {/* メインコンテンツエリア */}
        <section className={styles.cardListSection}>

          <h2 className={styles.sectionTitle}>学校の支援</h2>
          <div className={styles.sectionDivider}></div>
          <div className={styles.flexiCardArea}>
            {getCardsByCategory('school').map((card) => (
              <FlexiCard
                key={card.id}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
              />
            ))}
          </div>

          <h2 className={styles.sectionTitle}>行政の支援／福井県</h2>
          <div className={styles.sectionDivider}></div>
          <div className={styles.flexiCardArea}>
            {getCardsByCategory('prefecture').map((card) => (
              <FlexiCard
                key={card.id}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
              />
            ))}
          </div>

          <h2 className={styles.sectionTitle}>行政の支援／各市町</h2>
          <div className={styles.sectionDivider}></div>
          <div className={styles.flexiCardArea}>
            {getCardsByCategory('municipal').map((card) => (
              <FlexiCard
                key={card.id}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
              />
            ))}
          </div>

          <h2 className={styles.sectionTitle}>医療機関／子どもの発達障害・心療内科</h2>
          <div className={styles.sectionDivider}></div>
          <div className={styles.flexiCardArea}>
            {getCardsByCategory('medical').map((card) => (
              <FlexiCard
                key={card.id}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
              />
            ))}
          </div>

        </section>
      </div>

      <Footer />
    </div>
  );
};

export default FlexiCardListPage;
