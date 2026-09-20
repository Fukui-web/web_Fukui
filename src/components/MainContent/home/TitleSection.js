import React from 'react';
import styles from './TitleSection.module.css';
import adobeStockImage from '../../../assets/images/main_img2.png';

const TitleSection = () => {
  return (
    <div className={styles.titleSection}>
      <p className={styles.mainTitle}>経験者の声から生まれた不登校情報サイト</p>
      <div className={styles.mainLogo}></div>
      <p className={styles.prefectureLabel}>福井県版</p>
      <div className={styles.adobeStockImage}>
        <img src={adobeStockImage} alt="AdobeStock" />
      </div>

      {/* --- ▼ 修正後のコード (Figmaデザイン) ▼ --- */}

      {/* Frame 18: 当事者たちによる... (h1 -> div に変更) */}
      <div className={styles.frame18}>
        不登校を経験した人たちの
      </div>

      {/* Frame 19: 白い枠 (内側の p タグを削除し、div に直接テキストを配置) */}
      <div className={styles.frame19}>
        「知りたかった」を集めました。
      </div>
      
      {/* --- ▲ 修正後のコード 終了 ▲ --- */}

    </div>
  );
};

export default TitleSection;
