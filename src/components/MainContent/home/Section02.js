import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Section02.module.css';
import vectorRB from '../../../assets/images/vectorRB.png';
import roadNumberImage from '../../../assets/icons/02_0.png';
import SectionTitle from '../../common/SectionTitle';
import ContentFrame from '../../common/ContentFrame';
import ExperienceSection from '../../common/ExperienceSection';

const Section02 = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.section02}>
      <SectionTitle 
        roadNumber="02" 
        title="行政が行う公的支援" 
        roadNumberImage={roadNumberImage} 
      />

      <ContentFrame
        title="公的な支援機関はいくつかあります"
        buttonElement={
          <button 
            className={styles.projectButton}
            onClick={() => navigate('/section02')}
          >
            <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
            <span>相談の窓口などご紹介。福井県内各所、利用しやすいところを選んでください。</span>
          </button>
        }
      >
        <div className={styles.contentList}>
          <p>◯ちゃれんじ教室</p>
          <p>◯ソーシャルワーカー　など</p>
        </div>
      </ContentFrame>

      <ExperienceSection 
        title="みんなの体験談を見てみよう！
公的支援を利用してどうだった？"
        questionId="6-1-5"
        limit={6}
        moreButtonText="体験談をさがす"
        customClass={styles.experience02}
        onMoreClick={() => navigate('/experiences?questionId=6-1-5')}
      />
    </div>
  );
};

export default Section02;
