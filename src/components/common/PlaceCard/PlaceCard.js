import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PlaceCard.module.css';
import placeCards from '../../../data/placeCards';
import dotline2Image from '../../../assets/images/dotline2.png';

const PlaceCard = ({ cardId, image, tags, title, description }) => {
  // カードIDが指定された場合は、データからカード情報を取得
  let actualCardId = cardId;
  let cityName = '';
  
  // 市町村マッピング（PlacesContentと同じ分配）
  const cityMapping = {
    1: '勝山市',
    2: '福井市',
    3: '福井市',
    4: '大野市',
    5: '福井市',
    6: '坂井市',
    7: '福井市',
    8: '福井市',
    9: '福井市',
    10: '福井市',
    11: '福井市'
  };
  
  if (cardId) {
    const cardData = placeCards.find(card => card.id === cardId);
    if (cardData) {
      image = cardData.image;
      tags = cardData.tags;
      title = cardData.title;
      description = cardData.description;
      cityName = cityMapping[cardId] || '';
    }
  }

  return (
    <Link to={`/places/${actualCardId || 1}`} className={styles.cardLink}>
      <div className={styles.placeCard}>
      <div className={styles.imageContainer} style={{ backgroundImage: `url(${image})` }}>
        {cityName && <div className={styles.locationLabel}>{cityName}</div>}
      </div>

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

export default PlaceCard;
