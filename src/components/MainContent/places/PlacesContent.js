import React from 'react';
import { Helmet } from 'react-helmet-async';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './PlacesContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import PlaceCard from '../../common/PlaceCard/PlaceCard';
import dotlineImage from '../../../assets/images/dotline.png';
import placeCards from '../../../data/placeCards';

const PlacesContent = () => {

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '居場所をさがす', path: '/places' }
  ];

  // 市町村ごとにカードを分配
  const cityCards = {
    'あわら市': [],
    '池田町': [],
    '永平寺町': [],
    '越前市': [],
    '越前町': [],
    'おおい町': [],
    '大野市': [4],
    '小浜市': [],
    '勝山市': [1],
    '坂井市': [6],
    '鯖江市': [],
    '高浜町': [],
    '敦賀市': [],
    '福井市': [2, 3, 5, 7, 8, 9, 10, 11],
    '南越前町': [],
    '美浜町': [],
    '若狭町': []
  };

  // カードがある市町村のみを抽出
  const citiesWithCards = Object.entries(cityCards)
    .filter(([_, cardIds]) => cardIds.length > 0)
    .map(([cityName, cardIds]) => ({ cityName, count: cardIds.length }));

  // スクロール機能
  const scrollToSection = (cityName) => {
    const element = document.getElementById(`city-${cityName}`);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <Helmet>
        <title>居場所をさがす｜ぼくらのみち</title>
        <meta name="description" content="福井県内のフリースクール・居場所情報を掲載しています。地域から居場所を探すことができます。" />
        <link rel="canonical" href="https://bokuranomichi-fukui.com/places" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "TOP", "item": "https://bokuranomichi-fukui.com/"},
            {"@type": "ListItem", "position": 2, "name": "居場所をさがす", "item": "https://bokuranomichi-fukui.com/places"}
          ]
        })}</script>
      </Helmet>
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* タイトルセクション */}
      <div className={styles.searchSection}>
        <h1 className={styles.searchTitle}>居場所をさがす</h1>
        <img src={dotlineImage} alt="" className={styles.dotline} />
      </div>

      {/* 居場所ピックアップセクション */}
      <div className={styles.pickupSection}>
        <h2 className={styles.pickupTitle}>福井県(17市町)</h2>
        <div className={styles.dividerLine}></div>
        
        {/* 目次セクション */}
        <div className={styles.tocSection}>
          <h3 className={styles.tocTitle}>目次</h3>
          <div className={styles.tocList}>
            {citiesWithCards.map(({ cityName, count }) => (
              <div
                key={cityName}
                className={styles.tocItem}
                onClick={() => scrollToSection(cityName)}
              >
                {cityName}({count})
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.dividerLine}></div>
        
        {/* 市町名リストとカード */}
        <div className={styles.citiesContainer}>
          {Object.entries(cityCards).map(([cityName, cardIds]) => (
            <div key={cityName} id={`city-${cityName}`} className={styles.citySection}>
              <div className={styles.cityName}>{cityName}</div>
              {cardIds.length > 0 && (
                <div className={styles.cityCardsGrid}>
                  {cardIds.map(cardId => (
                    <PlaceCard key={cardId} cardId={cardId} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlacesContent;
