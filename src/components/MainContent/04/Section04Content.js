// src/components/MainContent/04/Section04Content.js

import React from 'react';
import { Helmet } from 'react-helmet-async';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './Section04Content.module.css';
import commonStyles from '../SectionCommon.module.css';
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import InterviewCard from '../../common/InterviewCard/InterviewCard';
import road04Image from '../../../assets/icons/ROAD04.png';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB2.png';

const Section04Content = () => {
  return (
    <div className={`${layoutStyles.pageContainer} ${styles.section04Content}`}>
      <Helmet>
        <title>インタビュー 不登校とぼくら｜ぼくらのみち</title>
        <meta name="description" content="不登校を経験した子どもたちや保護者のリアルな声をインタビュー形式でお届けします。" />
        <link rel="canonical" href="https://bokuranomichi-fukui.com/section04" />
        <meta property="og:title" content="インタビュー 不登校とぼくら｜ぼくらのみち" />
        <meta property="og:description" content="不登校を経験した子どもたちや保護者のリアルな声をインタビュー形式でお届けします。" />
        <meta property="og:url" content="https://bokuranomichi-fukui.com/section04" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://bokuranomichi-fukui.com/title.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "TOP", "item": "https://bokuranomichi-fukui.com/"},
            {"@type": "ListItem", "position": 2, "name": "インタビュー 不登校とぼくら", "item": "https://bokuranomichi-fukui.com/section04"}
          ]
        })}</script>
      </Helmet>

      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="04" sectionTitle="不登校とぼくら" />

      {/* タイトル部分 */}
      <div className={commonStyles.pageTitleSection}>
        <img src={road04Image} alt="ROAD 04" className={commonStyles.pageRoadImage} />
        <p className={styles.subTitle}>インタビュー</p>
        <h1 className={commonStyles.pageMainTitle}>不登校とぼくら</h1>
        <img src={dotlineImage} alt="点線" className={commonStyles.pageDotline} />
      </div>

      {/* 説明セクション */}
      <div className={commonStyles.pageDescriptionSection}>
        <h2 className={commonStyles.pageDescriptionTitle}>
          大丈夫。あなただけじゃない。
        </h2>
        <div className={commonStyles.pageDividerLine}></div>
        <p className={commonStyles.pageDescriptionText}>
          福井県内で不登校を身近に経験した方々にインタビューをしました。当時のこと、今のこと、今から考えること・・・<br />
          なにかヒントが見つかるかもしれません。
        </p>
      </div>

      {/* インタビューセクション */}
      <div className={styles.interviewSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.titleLine1}>自分と同じ気持ちの人はいるかな。</span>
            <span className={styles.titleLine2}>不登校を体験したみんなのインタビューを見てみよう！</span>
          </h3>
        </div>
        <div className={styles.interviewCardArea}>
          <InterviewCard cardId={1} />
          <InterviewCard cardId={3} />
          <InterviewCard cardId={4} />
          <div className={commonStyles.pageDividerLine}></div>
          <span className={styles.titleLine2}>支援者のみなさんからのメッセージ</span>
          <InterviewCard cardId={2} />
        </div>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section04Content;