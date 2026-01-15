import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './TweetCard.module.css';
import tweetCards from '../../../data/tweetCards';

const TweetCard = ({ 
  cardId, 
  data, // 検索結果データ
  relatedContext, // 関連記事のコンテキスト情報
  text, 
  tags = ['#小学生', '#学校活用術', '#学校活用術'], 
  authorName = 'ひろまま', 
  authorInitial = 'R', 
  date = '2025.07.03'
}) => {
  // 検索結果データが渡された場合
  if (data) {
    // タイトルを優先、なければdescriptionの最初の100文字を使用
    text = data.title || (data.description ? data.description.substring(0, 100) + '...' : '');
    authorName = data.authorName || '匿名';
    authorInitial = data.authorInitial || 'A';
    date = data.date || '';
    
    // タグを生成（学年、きっかけ、サポートから）
    tags = [];
    if (data.grade) tags.push(`#${data.grade}`);
    if (data.trigger) tags.push(`#${data.trigger}`);
    if (data.support) tags.push(`#${data.support}`);
  }
  // カードIDが指定された場合は、データからカード情報を取得
  else if (cardId) {
    const cardData = tweetCards.find(card => card.id === cardId);
    if (cardData) {
      text = cardData.text;
      // eslint-disable-next-line no-unused-vars
      tags = cardData.tags;
      authorName = cardData.authorName;
      authorInitial = cardData.authorInitial;
      date = cardData.date;
    }
  }

  return (
    <Link 
      to={`/experiences/${data?.id || cardId || 1}`} 
      state={{ 
        experienceData: data,
        relatedContext: relatedContext
      }} 
      className={styles.cardLink}
    >
      <div className={styles.tweetCard}>
        <p className={styles.tweetText}>{text}</p>
        <div className={styles.tweetDivider}></div>
{/*       <div className={styles.tagArea}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
  */}
        <div className={styles.tweetFooter}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              <span>{authorInitial}</span>
            </div>
            <span className={styles.authorName}>{authorName}</span>
          </div>
          <span className={styles.tweetDate}>{date}</span>
        </div>
      </div>
    </Link>
  );
};

TweetCard.propTypes = {
  cardId: PropTypes.number,
  data: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    authorName: PropTypes.string,
    authorInitial: PropTypes.string,
    date: PropTypes.string,
    grade: PropTypes.string,
    trigger: PropTypes.string,
    situation: PropTypes.string,
    support: PropTypes.string
  }),
  relatedContext: PropTypes.shape({
    type: PropTypes.string, // 'pickup', 'question', 'search', 'section'
    questionId: PropTypes.string,
    sectionName: PropTypes.string,
    searchFilters: PropTypes.object,
    relatedExperiences: PropTypes.array
  }),
  text: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  authorName: PropTypes.string,
  authorInitial: PropTypes.string,
  date: PropTypes.string
};

export default TweetCard;
