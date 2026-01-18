import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SchoolCard.module.css'; // ★1. CSSの読み込み先を変える
import schoolCards from '../../../data/schoolCards';
import dotline2Image from '../../../assets/images/dotline2.png';

const SchoolCardCard = ({ cardId, image, tags, title, description }) => {
  // カードIDが指定された場合は、データからカード情報を取得
  let actualCardId = cardId;
  if (cardId) {
    const cardData = schoolCards.find(card => card.id === cardId);
    if (cardData) {
      image = cardData.image;
      tags = cardData.tags;
      title = cardData.title;
      description = cardData.description;
    }
  }

  return (
    <Link to={`/schools/${actualCardId || 1}`} className={styles.cardLink}>
      <div className={styles.schoolCard}>
      <div className={styles.imageContainer} style={{ backgroundImage: `url(${image})` }}></div>

      <div className={styles.contentContainer}>
        {/* タグ表示を一時的に無効化（コメントアウト） */}
        {/*
        <div className={styles.tagArea}>
          {tags.map((tag, index) => (
            <div key={index} className={styles.tag}>
              <span>{tag}</span>
            </div>
          ))}
        </div>
        */}

        <div className={styles.dotline} style={{ backgroundImage: `url(${dotline2Image})` }}></div>
        <div className={styles.placeTitle}>{title}</div>
        <div className={styles.dotline} style={{ backgroundImage: `url(${dotline2Image})` }}></div>
      </div>
    </div>
    </Link>
  );
};

export default SchoolCardCard;
