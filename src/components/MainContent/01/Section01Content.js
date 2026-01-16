// src/components/MainContent/01/Section01Content.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）
import styles from './Section01Content.module.css'; // 01ページ固有CSS
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import InterviewCard from '../../common/InterviewCard/InterviewCard';
import TweetCard from '../../common/TweetCard/TweetCard';
import FlexiCard from '../../common/FlexiCard/FlexiCard';
import road01Image from '../../../assets/icons/ROAD01.png';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB.png';
import { getExperiencesByQuestion } from '../../../utils/gasApi';

const Section01Content = () => {
  const navigate = useNavigate();
  
  // 不登校初期の体験談
  const [earlyExperiences, setEarlyExperiences] = useState([]);
  const [earlyLoading, setEarlyLoading] = useState(true);
  const [earlyError, setEarlyError] = useState(null);
  const [earlyNoData, setEarlyNoData] = useState(false);

  useEffect(() => {
    const fetchEarlyExperiences = async () => {
      try {
        const result = await getExperiencesByQuestion('2-11', 6);
        
        if (result.errorType) {
          setEarlyError(result.error || '取得エラーが発生しました');
          setEarlyExperiences([]);
        } else if (result.noData || result.data.length === 0) {
          setEarlyNoData(true);
          setEarlyExperiences([]);
        } else {
          setEarlyExperiences(result.data);
        }
      } catch (err) {
        setEarlyError('データの取得に失敗しました');
        console.error('Experience fetch error:', err);
      } finally {
        setEarlyLoading(false);
      }
    };

    fetchEarlyExperiences();
  }, []);

  return (
    <div className={`${layoutStyles.pageContainer} ${styles.section01Content}`}>

      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="01" sectionTitle="学校に相談してみよう" />

      {/* タイトル部分（00ページと同様） */}
      <div className={styles.titleSection}>
        <img src={road01Image} alt="ROAD 01" className={styles.roadImage} />
        <h1 className={styles.mainTitle}>学校に相談してみよう</h1>
        <img src={dotlineImage} alt="点線" className={styles.dotline} />
      </div>

      {/* 説明セクション */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>
          学校は解決するためではなく「利用するもの」<br />
          そう思っていろいろ相談してみてください。
        </h2>
        <div className={styles.dividerLine}></div>
        <p className={styles.descriptionText}>
          まずは、担任の先生や学年主任の先生、養護の先生に現状を相談するのが良いかもしれません。 ただ、全ての先生が不登校に詳しいというわけではありません。そして子どもも親も先生も人間です。合う・合わないは必ずあります。 なので、一番大変な時期だと思いますが、様々な人に相談してみてください。お子さんが一緒に行ければ良いですが、無理して連れて行くことはありません。
        </p>
        <p className={styles.descriptionText}>
          学校での様子、家での様子、情報を交換しあって、「原因探し」ではなく、お子さんを応援する「チームメンバー」になっていただくのが良いかもしれません。 学校は、「利用するもの」という意識を持つと少し楽になるかもしれません。
        </p>
      </div>

      {/* 経験談セクション */}
      <div className={styles.interviewSection}>
        <div className={styles.dottedBorder}></div>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.titleLine1}>専門家の先生にお聞きしました</span>
            <span className={styles.titleLine2}>不登校の原因って</span>
          </h3>
        </div>
        <InterviewCard cardId={1} />
        <div className={styles.dottedBorder}></div>
      </div>

      {/* 学校の支援セクション */}
      <div className={styles.supportSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.titleLine2Support}>みんなの体験談を見てみよう！</span>
            <span className={styles.titleLine1Support}>不登校初期、学校側とどのような対応した？</span>
          </h3>
        </div>
        <div className={styles.tweetCardArea}>
          {earlyLoading && <div className={styles.loadingMessage}>読み込み中...</div>}
          
          {earlyError && (
            <div className={styles.errorMessage}>
              <p>⚠️ 取得エラー: {earlyError}</p>
            </div>
          )}
          
          {earlyNoData && !earlyError && (
            <div className={styles.noDataMessage}>
              <p>該当する体験談がまだありません</p>
            </div>
          )}
          
          {!earlyLoading && !earlyError && !earlyNoData && earlyExperiences.slice(0, 2).map((exp, index) => (
            <TweetCard 
              key={exp.id || index} 
              data={exp}
              relatedContext={{
                type: 'section',
                sectionName: '学校とのつながりに関する体験談',
                questionId: '2-11',
                relatedExperiences: earlyExperiences.slice(0, 6)
              }}
            />
          ))}
        </div>
        <button 
          className={styles.moreButton2}
          onClick={() => navigate('/experiences?questionId=2-11')}
        >
          <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
          <span>体験談をさがす</span>
        </button>
      </div>

      {/* 支援の種類セクション */}
      <div className={styles.supportTypeSection}>
        <h3 className={styles.supportTypeTitle}>
          学校の中にはどんな支援があるの？<br />
          支援の種類をご紹介します！
        </h3>
        <div className={styles.dividerLine}></div>
        <p className={styles.supportTypeDescription}>
          学校や行政にも様々な不登校サポートがあります。お子さん、保護者の方に合うサポートもあるかもしれません。学校側も知らないことがあるので、積極的に聞いてみてください。
        </p>

        {/* FlexiCardエリア - 柔軟に使える汎用カード */}
        <div className={styles.flexiCardArea}>
          <FlexiCard
            title="スクールカウンセラー"
            description="ついつい頼りたくなりつらさを軽く理解できる話の専門家です。"
            buttonText="詳しく見る"
          />
          <FlexiCard
            title="校内サポートルーム"
            description="県内の小学校、１時間がありません。校内の先生とは別の相談窓口です。"
            buttonText="詳しく見る"
          />
          <FlexiCard
            title="ライフパートナー制度"
            description="専攻大学の学生さん。おしゃべりや遊び、自分との関わり、宿題など付き合ってくれます。"
            buttonText="詳しく見る"
          />
        </div>
      </div>

      {/* 体験談セクション2 */}
      <div className={styles.supportSection2}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.titleLine2Support}>みんなの体験談を見てみよう</span>
            <span className={styles.titleLine1Support}>学校の支援制度はどうだった？</span>
          </h3>
        </div>
        <div className={styles.tweetCardArea}>
          <TweetCard cardId={3} />
          <TweetCard cardId={4} />
        </div>
        <button 
          className={styles.moreButton2}
          onClick={() => navigate('/experiences')}
        >
          <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
          <span>体験談をさがす</span>
        </button>
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

export default Section01Content;