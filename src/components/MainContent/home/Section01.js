import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Section01.module.css';
import vectorRB from '../../../assets/images/vectorRB.png';
import roadNumberImage from '../../../assets/icons/01_0.png';
import SectionTitle from '../../common/SectionTitle';
import ContentFrame from '../../common/ContentFrame';
import ExperienceSection from '../../common/ExperienceSection';


const Section01 = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.section01}>
      <SectionTitle 
        roadNumber="01" 
        title="学校に相談してみよう" 
        roadNumberImage={roadNumberImage} 
      />

      <ContentFrame
        title="学校にはいろんなサポートがあります"
        buttonElement={
          <button 
            className={styles.projectButton}
            onClick={() => navigate('/section01')}
          >
            <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
            <span>親側から積極的に支援を求めて下さい。サポートについて詳しく紹介しています。</span>
          </button>
        }
      >
        <p>
          まずは、担任の先生や学年主任の先生、養護の先生に現状を相談するのが良いかもしれません。<br />
          ただ、全ての先生が不登校に詳しいというわけではありません。そして子どもも親も先生も人間です。合う・合わないは必ずあります。学校は、「利用するもの」という意識を持つと少し楽になるかもしれません。
        </p>
        <div className={styles.contentList}>
          <p>◯スクールカウンセラー紹介</p>
          <p>◯校内サポートルーム</p>
          <p>◯ライフパートナー制度 など</p>
        </div>
      </ContentFrame>

      <ExperienceSection 
        title="みんなの体験談を見てみよう！
みんなの学校活用術"
        questionId="2-11"
        limit={6}
        moreButtonText="体験談をさがす"
        customClass={styles.experience01}
        onMoreClick={() => navigate('/experiences?questionId=2-11')}
        sectionName="学校とのつながりに関する体験談"
      />
    </div>
  );
};

export default Section01;
