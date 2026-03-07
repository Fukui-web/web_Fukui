// src/components/MainContent/03/Section03Content.js

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './Section03Content.module.css';
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import PlaceCard from '../../common/PlaceCard/PlaceCard';
import road03Image from '../../../assets/icons/ROAD03.png';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB.png';

const Section03Content = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // URLのハッシュに対応したスクロール
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className={`${layoutStyles.pageContainer} ${styles.section03Content}`}>
      <Helmet>
        <title>みんなの居場所｜ぼくらのみち</title>
        <meta name="description" content="不登校の子どもたちが通える居場所や、保護者同士が集まれる居場所を福井県内から探すことができます。" />
        <link rel="canonical" href="https://bokuranomichi-fukui.com/section03" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "TOP", "item": "https://bokuranomichi-fukui.com/"},
            {"@type": "ListItem", "position": 2, "name": "みんなの居場所", "item": "https://bokuranomichi-fukui.com/section03"}
          ]
        })}</script>
      </Helmet>

      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="03" sectionTitle="まだまだある！みんなの居場所" />

      {/* タイトル部分 */}
      <div className={styles.titleSection}>
        <img src={road03Image} alt="ROAD 03" className={styles.roadImage} />
        <h1 className={styles.mainTitle}>まだまだある！<br />みんなの居場所</h1>
        <img src={dotlineImage} alt="点線" className={styles.dotline} />
      </div>

      {/* 説明セクション */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>
          子どもだけじゃない。<br />
          保護者のみなさんの居場所もあります。
        </h2>
        <div className={styles.dividerLine}></div>
        <p className={styles.descriptionText}>
          多くの民間団体やサークルが、不登校の子どもたちや保護者の居場所を作ってくれています。保護者のみなさんが、子どもたちにと思う場所をまず見つけてください。
        </p>
      </div>

      {/* みんなの居場所一覧セクション */}
      <div className={styles.placeListSection}>
        <h3 id="kids-place" className={styles.placeListTitle}>こどもの居場所一覧</h3>
        <div className={styles.dividerLine}></div>
        <div className={styles.placeCardArea}>
          <PlaceCard cardId={1} />
          <PlaceCard cardId={3} />
          <PlaceCard cardId={5} />
          <PlaceCard cardId={7} />
          <PlaceCard cardId={8} />
          <PlaceCard cardId={9} />
          <PlaceCard cardId={10} />
        </div>

        <h3 id="parents-place" className={styles.placeListTitle}>保護者の居場所一覧</h3>
        <div className={styles.dividerLine}></div>
        <div className={styles.placeCardArea}>
          <PlaceCard cardId={2} />
          <PlaceCard cardId={4} />
          <PlaceCard cardId={6} />
          <PlaceCard cardId={11} />
        </div>
      </div>

      {/* みんなの居場所検索ページボタン */}
      <button 
        className={styles.searchButton}
        onClick={() => navigate('/places')}
      >
        <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
        <span>みんなの居場所をさがす</span>
      </button>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section03Content;