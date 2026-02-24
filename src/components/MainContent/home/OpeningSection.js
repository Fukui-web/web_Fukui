import React from 'react';
import styles from './OpeningSection.module.css';
import newWindowIcon from '../../../assets/images/newwindow.png';
import weAreImage from '../../../assets/images/we_are.png';

const OpeningSection = () => {
  return (
    <div className={styles.opening}>
      <p className={styles.openingText}>
        不登校の問題解決法は、100人に100通り。<br />
        それぞれのご家庭に合った解決法を見つけるヒントとなるように、専門家のご意見と共に、当事者たちの知恵と経験を次世代のみなさんへの処方箋となるよう、発信しています。
      </p>
      <div 
        className={styles.projectSection}
        onClick={() => window.open('https://tayouna-ikikata.studio.site/', '_blank')}
      >
        <img src={weAreImage} alt="私たちについて" className={styles.weAreImage} />
        <p className={styles.projectDescription}>
          このサイトは現役不登校生やその保護者で制作しています。
        </p>
        <div className={styles.projectButtonContent}>
          <img src={newWindowIcon} alt="新しいウィンドウ" className={styles.newWindowIcon} />
          <span>プロジェクトを詳しく見る</span>
        </div>
      </div>
    </div>
  );
};

export default OpeningSection;
