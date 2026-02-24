// src/components/MainContent/02/Section02Content.js

import React from 'react';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './Section02Content.module.css';
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import FlexiCard from '../../common/FlexiCard/FlexiCard';
import road02Image from '../../../assets/icons/ROAD02.png';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB.png';

const Section02Content = () => {
  return (
    <div className={`${layoutStyles.pageContainer} ${styles.section02Content}`}>

      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="02" sectionTitle="公的支援や医療機関" />

      {/* タイトル部分 */}
      <div className={styles.titleSection}>
        <img src={road02Image} alt="ROAD 02" className={styles.roadImage} />
        <h1 className={styles.mainTitle}>公的支援や医療機関</h1>
        <img src={dotlineImage} alt="点線" className={styles.dotline} />
      </div>

      {/* 説明セクション */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>
          学校以外で支援や相談に乗ってくれるところです。
        </h2>
        <div className={styles.dividerLine}></div>
        <p className={styles.descriptionText}>
          学校での相談が思うように進まなかったり、欲しい情報が得られなかったりすることもあります。まずはお近くの窓口で相談してみてください。
        </p>
      </div>

      {/* 相談窓口カードセクション */}
      <div className={styles.consultationSection}>
        <div className={styles.flexiCardArea}>
          <FlexiCard
            title={`福井県教育総合研究所
教育相談センター`}
            description="0776-51-0511（メール不可）0120-96-8104（フリーダイヤル）"
            buttonText="詳しく見る"
          />
          <FlexiCard
            title={`福井県教育庁
教育相談課`}
            description="0776-56-1310"
            buttonText="詳しく見る"
          />
          <FlexiCard
            title={`スクールソーシャル
ワーカー`}
            description="家庭と学校現場の間の繋ぐスクールソーシャルワーカー不登校支援に関するのもお願いしま"
            buttonText="詳しく見る"
          />
        </div>
      </div>

      {/* 各市町の情報セクション */}
      <div className={styles.municipalSection}>
        <p className={styles.municipalIntro}>
          各市町で独自に行なっている支援もあります。
        </p>
        <div className={styles.dividerLine}></div>
        <p className={styles.municipalDescription}>
          各自治体の情報をまとめました。詳しくはお住まいの窓口まで問い合わせてください。
        </p>
        <div className={styles.flexiCardArea}>
          <FlexiCard
            title={`福井市
チャレンジ教室`}
            description="学校概要を再検討した。公費グラフ・スクール"
            buttonText="詳しく見る"
          />
          <FlexiCard
            title={`坂井市
スタッフスクールきぼう`}
            description="学校概要を再検討した。公費グラフ・スクール"
            buttonText="詳しく見る"
          />
          <FlexiCard
            title={`鮫江市
嶺北エールド`}
            description="学校概要を再検討した。公費グラフ・スクール"
            buttonText="詳しが見る"
          />
        </div>
      </div>

      {/* 行政・医療機関一覧ボタン */}
      <button className={styles.listButton}>
        <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
        <span>行政・医療機関一覧を見る</span>
      </button>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section02Content;