import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './InterviewCard.module.css';
import interviewCards from '../../../data/interviewCards';

/**
 * インタビューカードコンポーネント
 * @param {number} cardId - 表示するカードのID
 */
const InterviewCard = ({ cardId }) => {
  const navigate = useNavigate();
  const card = interviewCards.find(c => c.id === cardId);

  if (!card) {
    return null;
  }

  const handleClick = () => {
    navigate(`/interviews/${card.id}`);
  };

  return (
    <div className={styles.interviewCard} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img src={card.image} alt={card.title} className={styles.cardImage} />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.mainContent}>
          <h4 className={styles.cardTitle}>{card.title}</h4>
          <p className={styles.cardDescription}>{card.description}</p>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.cardFooter}>
          <div className={styles.authorIcon}>{card.authorInitial}</div>
          <span className={styles.authorName}>{card.authorName}</span>
          <span className={styles.cardDate}>{card.date}</span>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
