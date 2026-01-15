// src/components/MainContent/00/Section00Content.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）
import styles from './Section00Content.module.css'; // 00ページ固有CSS
import commonStyles from '../SectionCommon.module.css'; // 共通CSS（コンポーネント）
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import TweetCard from '../../common/TweetCard/TweetCard';
import road00Image from '../../../assets/icons/ROAD00.png';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB.png';
import { getExperiencesByQuestion } from '../../../utils/gasApi';

const Section00Content = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const result = await getExperiencesByQuestion('2-2', 6);
        
        if (result.errorType) {
          setError(result.error || '取得エラーが発生しました');
          setExperiences([]);
        } else if (result.noData || result.data.length === 0) {
          setNoData(true);
          setExperiences([]);
        } else {
          setExperiences(result.data);
        }
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error('Experience fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    // ページレイアウト (styles)
    <div className={`${layoutStyles.pageContainer} ${styles.section00Content}`}>
      
      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="00" sectionTitle="まずは、どうする？" />
      
      {/* セクション1: タイトル部分 (styles) */}
      <div className={styles.section00Top}>
        {/* ROAD 00 画像 */}
        <div className={styles.roadImageContainer}>
          <img src={road00Image} alt="ROAD 00" className={styles.roadImage} />
        </div>
        
        {/* サブタイトル */}
        <p className={styles.topSubtitle}>子どもが不登校に・・・</p>
        
        {/* メインタイトル */}
        <h1 className={styles.topMainTitle}>まずは、どうする？</h1>
        
        {/* ドットライン装飾 */}
        <div className={styles.dotlineContainer}>
          <img src={dotlineImage} alt="" className={styles.dotline} />
        </div>
        
        {/* 説明テキスト */}
        <h2 className={styles.topDescription}>
          ＼　大丈夫です。なんとかなります。／<br />
          まずは慌てず落ち着きましょう。
        </h2>
        
        {/* description (commonStyles) */}
        <p className={commonStyles.description}>
          お子さんの急な不登校宣言。驚きますよね。<br />
          どうしたの？何かあったの？いじめ！？聞きたくなる気持ちはわかります。<br />
          ただ、お子さんは今、傷ついた自分の心を守るため、必死に戦っています。<br />
          お子さんの心が回復できるように、まずはお父さん、お母さんが、慌てず落ち着いて、子どもが安心できる家庭を維持する事を意識してください。<br /><br />
          「甘えとの境界線がわからない。」<br />
          そうですよね。多くの保護者が悩まれるところだと思います。<br />
          ただ、サボりたいが為に不登校になる子どもはほとんどいないそうです。<br />
          お子さんも悩みに悩んだ末の決断なのです。<br />
          お子さんの気持ちを尊重し、親が動じず、例え何が起きても大丈夫、という姿勢を見せることも大事かもしれません。
        </p>
      </div>

      {/* セクション2: 体験談 */}
      <div className={styles.section00Middle}>
        <h3 className={styles.experienceTitle}>
          みんなの体験談をみてみよう！<br />
          不登校になったきっかけは？
        </h3>
        
        {/* TweetCardを表示 */}
        <div className={styles.tweetCardsContainer}>
          {loading && <div className={styles.loadingMessage}>読み込み中...</div>}
          
          {error && (
            <div className={styles.errorMessage}>
              <p>⚠️ 取得エラー: {error}</p>
            </div>
          )}
          
          {noData && !error && (
            <div className={styles.noDataMessage}>
              <p>該当する体験談がまだありません</p>
            </div>
          )}
          
          {!loading && !error && !noData && experiences.slice(0, 2).map((exp, index) => (
            <TweetCard 
              key={exp.id || index} 
              data={exp}
              relatedContext={{
                type: 'section',
                sectionName: '不登校のきっかけに関する体験談',
                questionId: '2-2',
                relatedExperiences: experiences.slice(0, 6)
              }}
            />
          ))}
        </div>
        
        {/* ボタン */}
        <button 
          className={styles.experienceButton}
          onClick={() => navigate('/experiences?questionId=2-2')}
        >
          <img src={vectorRB} alt="" className={styles.buttonIcon} />
          <span>体験談をさがす</span>
        </button>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section00Content;