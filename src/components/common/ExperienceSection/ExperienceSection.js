import React, { useState, useEffect } from 'react';
import styles from './ExperienceSection.module.css';
import vectorRB from '../../../assets/images/vectorRB.png';
import TweetCard from '../TweetCard/TweetCard';
import { getExperiencesByQuestion } from '../../../utils/gasApi';

/**
 * 体験談セクションコンポーネント
 * ツイートカードと「もっと見る」ボタンを表示する共通コンポーネント
 * 
 * @param {string} tag - タグテキスト (オプショナル、Section01のみ使用)
 * @param {string} title - セクションタイトル
 * @param {Array<number>} tweetCardIds - 表示するTweetCardのID配列（静的データ用、非推奨）
 * @param {string} questionId - 質問ID（動的データ取得用）例: '2-2', '2-11'
 * @param {number} limit - 取得件数（デフォルト6件）
 * @param {string} moreButtonText - 「もっと見る」ボタンのテキスト
 * @param {string} customClass - カスタムCSSクラス (オプショナル)
 * @param {Function} onMoreClick - 「もっと見る」ボタンのクリックハンドラ (オプショナル)
 */
const ExperienceSection = ({ 
  tag, 
  title, 
  tweetCardIds, 
  questionId,
  limit = 6,
  moreButtonText, 
  customClass, 
  onMoreClick 
}) => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);

  // titleを改行で分割
  const titleLines = title.split('\n');

  useEffect(() => {
    // questionIdが指定されている場合のみ動的取得
    if (questionId) {
      const fetchExperiences = async () => {
        setLoading(true);
        setError(null);
        setNoData(false);
        
        try {
          const result = await getExperiencesByQuestion(questionId, limit);
          
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
    }
  }, [questionId, limit]);
  
  return (
    <div className={`${styles.experienceSection} ${customClass || ''}`}>
      {tag && (
        <div className={styles.experienceHeader}>
          <span className={styles.experienceTag}>{tag}</span>
          <div className={styles.experienceTitle}>
            {titleLines.map((line, index) => (
              <div key={index} className={index === 0 ? styles.titleLine1 : styles.titleLine2}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
      {!tag && (
        <div className={styles.experienceTitle}>
          {titleLines.map((line, index) => (
            <div key={index} className={index === 0 ? styles.titleLine1 : styles.titleLine2}>
              {line}
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.tweetArea}>
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
        
        {!loading && !error && !noData && questionId && experiences.map((exp, index) => (
          <TweetCard key={exp.id || index} data={exp} />
        ))}
        
        {!loading && !error && !questionId && tweetCardIds && tweetCardIds.map(id => (
          <TweetCard key={id} cardId={id} />
        ))}
      </div>

      <button className={styles.moreButton} onClick={onMoreClick}>
        <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
        <span>{moreButtonText}</span>
      </button>
    </div>
  );
};

export default ExperienceSection;