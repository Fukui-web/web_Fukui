// src/components/MainContent/05/Section05Content.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './Section05Content.module.css';
import commonStyles from '../SectionCommon.module.css';
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import SchoolCard from '../../common/SchoolCard/SchoolCard';
import schoolCards from '../../../data/schoolCards';
import road05Image from '../../../assets/icons/ROAD05.png';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB2.png';

const Section05Content = () => {
  const navigate = useNavigate();
  return (
    <div className={`${layoutStyles.pageContainer} ${styles.section05Content}`}>
      <Helmet>
        <title>中学卒業後のこと｜ぼくらのみち</title>
        <meta name="description" content="中学卒業後の進路について、通信制高校・定時制高校・フリースクールなどの選択肢を紹介します。" />
        <link rel="canonical" href="https://bokuranomichi-fukui.com/section05" />
        <meta property="og:title" content="中学卒業後のこと｜ぼくらのみち" />
        <meta property="og:description" content="中学卒業後の進路、通信制高校・定時制高校・フリースクールなどの選択肢を紹介します。" />
        <meta property="og:url" content="https://bokuranomichi-fukui.com/section05" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://bokuranomichi-fukui.com/title.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "TOP", "item": "https://bokuranomichi-fukui.com/"},
            {"@type": "ListItem", "position": 2, "name": "中学卒業後のこと", "item": "https://bokuranomichi-fukui.com/section05"}
          ]
        })}</script>
      </Helmet>

      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="05" sectionTitle="中学卒業後のこと" />

      {/* タイトル部分 */}
      <div className={commonStyles.pageTitleSection}>
        <img src={road05Image} alt="ROAD 05" className={commonStyles.pageRoadImage} />
        <h1 className={commonStyles.pageMainTitle}>中学卒業後のこと</h1>
        <img src={dotlineImage} alt="点線" className={commonStyles.pageDotline} />
      </div>

      {/* 説明セクション */}
      <div className={commonStyles.pageDescriptionSection}>
        <h2 className={commonStyles.pageDescriptionTitle}>
          全日制の高校に行けるのかしら？<br />
          大丈夫、様々な高校、通い方があるんです。
        </h2>
        <div className={commonStyles.pageDividerLine}></div>
        <p className={commonStyles.pageDescriptionText}>
          今の時代、通信制・定時制・サポート高校など、福井にいながら、様々な勉強方法で高校卒業資格を取得できるのです。
        </p>
      </div>

      {/* 検索機能セクション */}
      <div className={styles.searchSection}>
        <h3 className={styles.searchTitle}>検索機能</h3>
        <div className={commonStyles.pageDividerLine}></div>
        <div className={styles.placeCardArea}>
          <SchoolCard cardId={2} />
          <SchoolCard cardId={3} />
          <SchoolCard cardId={4} />
          <SchoolCard cardId={5} />
          <SchoolCard cardId={6} />
        </div>
      </div>

      {/* 中学卒業後の進路ボタン */}
      <button
        className={styles.pathButton}
        onClick={() => navigate('/schools')}
      >
        <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
        <span>中学卒業後の進路をさがす</span>
      </button>

      {/* 全日制高校の情報（外部サイトへの案内） */}
      <div className={styles.fulltimeSection}>
        <h2 className={styles.fulltimeTitle}>全日制の高校の情報はこちらをご確認ください</h2>
        <div className={commonStyles.pageDividerLine}></div>

        <ul className={styles.fulltimeList}>
          <li>
            <a
              className={styles.fulltimeLink}
              href="https://www.pref.fukui.lg.jp/doc/koukou/sixyoukai.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              県立高校の紹介
              <span className={styles.fulltimeNote}>・福井県の福井県立学校紹介ページ</span>
            </a>
          </li>
          <li>
            <a
              className={styles.fulltimeLink}
              href="https://www.pref.fukui.lg.jp/doc/daishi/siritugakkou/koutougakkou.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              私立高校（通信制含む）の紹介
              <span className={styles.fulltimeNote}>・福井県の福井県内私立高校一覧ページ</span>
            </a>
          </li>
        </ul>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section05Content;