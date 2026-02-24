import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Section00.module.css';
import roadNumberImage from '../../../assets/icons/00_0.png';
import dotlineImage from '../../../assets/images/dotline.png';
import ContentFrame from '../../common/ContentFrame';
import ExperienceSection from '../../common/ExperienceSection';

const Section00 = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.section00}>
      <div className={styles.titleWrapper}>
        <div className={styles.logoContainer}>
          <span className={styles.roadText}>ROAD</span>
          <img src={roadNumberImage} alt="00" className={styles.logoChar} />
        </div>
        <p className={styles.subtitle}>子どもが不登校に・・・</p>
        <h2 className={styles.mainTitle}>まずは、どうする？</h2>
        <div 
          className={styles.dotline} 
          style={{ backgroundImage: `url(${dotlineImage})` }}
        ></div>
      </div>

      <ContentFrame
        title="＼　大丈夫です。なんとかなります。／まずは慌てず落ち着きましょう。"
        buttonElement={
          <button 
            className={styles.projectButton}
            onClick={() => navigate('/section00')}
          >
            <div className={styles.bookIcon}></div>
            <span>心が落ち着くかも。私たちの想いを読んでみてください</span>
          </button>
        }
      >
        <p>
          お子さんの急な不登校宣言。驚きますよね。<br />
          どうしたの？何かあったの？いじめ！？聞きたくなる気持ちはわかります。ただ、お子さんは今、傷ついた自分の心を守るため、必死に戦っています。お子さんの心が回復できるように、まずはお父さん、お母さんが、慌てず落ち着いて、子どもが安心できる家庭を維持する事を意識してください。
        </p>
      </ContentFrame>

      {/* 相談センター情報 */}
      <div className={styles.consultationInfo}>
        <p className={styles.consultationText}>
          今すぐどこかに相談したい方は<br />
          福井県教育総合研究所教育相談センター<br />
          <a href="tel:0120968104" className={styles.phoneLink}>0120-96-8104</a><br />
          <span className={styles.consultationNote}>(フリーダイヤル)24時間対応</span>
        </p>
      </div>

      <ExperienceSection 
        title="みんなの体験談を見てみよう！
不登校になったきっかけは？"
        questionId="2-2"
        limit={6}
        moreButtonText="体験談をもっとみる"
        customClass={styles.experience00}
        onMoreClick={() => navigate('/experiences?questionId=2-2')}
        sectionName="不登校のきっかけに関する体験談"
      />
    </div>
  );
};

export default Section00;
