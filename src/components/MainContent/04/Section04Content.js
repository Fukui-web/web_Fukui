// src/components/MainContent/04/Section04Content.js

import React from 'react';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './Section04Content.module.css';
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import InterviewCard from '../../common/InterviewCard/InterviewCard';
import road04Image from '../../../assets/icons/ROAD04.png';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB.png';

const Section04Content = () => {
  return (
    <div className={`${layoutStyles.pageContainer} ${styles.section04Content}`}>

      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="04" sectionTitle="不登校とぼくら" />

      {/* タイトル部分 */}
      <div className={styles.titleSection}>
        <img src={road04Image} alt="ROAD 04" className={styles.roadImage} />
        <p className={styles.subTitle}>インタビュー</p>
        <h1 className={styles.mainTitle}>不登校とぼくら</h1>
        <img src={dotlineImage} alt="点線" className={styles.dotline} />
      </div>

      {/* 説明セクション */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>
          大丈夫。あなただけじゃない。
        </h2>
        <div className={styles.dividerLine}></div>
        <p className={styles.descriptionText}>
          福井県内で不登校を身近に経験した方々にインタビューをしました。当時のこと、今のこと、今から考えること・・・<br />
          なにかヒントが見つかるかもしれません。
        </p>
      </div>

      {/* インタビューセクション */}
      <div className={styles.interviewSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.titleLine1}>自分と同じ気持ちの人はいるかな。</span>
            <span className={styles.titleLine2}>みんなのインタビューを見てみよう！</span>
          </h3>
        </div>
        <div className={styles.interviewCardArea}>
          <InterviewCard cardId={1} />
          <InterviewCard cardId={2} />
        </div>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section04Content;