// src/components/MainContent/05/Section05Content.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './Section05Content.module.css';
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import SchoolCard from '../../common/SchoolCard/SchoolCard';
import schoolCards from '../../../data/schoolCards';
import road05Image from '../../../assets/icons/ROAD05.png';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB.png';

const Section05Content = () => {
  const navigate = useNavigate();
  return (
    <div className={`${layoutStyles.pageContainer} ${styles.section05Content}`}>

      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="05" sectionTitle="中学卒業後のこと" />

      {/* タイトル部分 */}
      <div className={styles.titleSection}>
        <img src={road05Image} alt="ROAD 05" className={styles.roadImage} />
        <h1 className={styles.mainTitle}>中学卒業後のこと</h1>
        <img src={dotlineImage} alt="点線" className={styles.dotline} />
      </div>

      {/* 説明セクション */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>
          全日制の高校に行けるのかしら？<br />
          大丈夫、様々な高校、通い方があるんです。
        </h2>
        <div className={styles.dividerLine}></div>
        <p className={styles.descriptionText}>
          今の時代、通信制・定時制・サポート高校など、福井にいながら、様々な勉強方法で高校卒業資格を取得できるのです。
        </p>
      </div>

      {/* 検索機能セクション */}
      <div className={styles.searchSection}>
        <h3 className={styles.searchTitle}>検索機能</h3>
        <div className={styles.dividerLine}></div>
        <div className={styles.placeCardArea}>
          <SchoolCard cardId={1} />
          <SchoolCard cardId={2} />
          <SchoolCard cardId={3} />
          <SchoolCard cardId={4} />
          <SchoolCard cardId={5} />
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

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section05Content;