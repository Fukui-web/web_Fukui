// src/components/common/FlexiCard/FlexiCard.js
// FlexiCard - 柔軟に使える汎用カードコンポーネント
// どんなコンテンツも入れられる自由度の高いカード

import React from 'react';
import styles from './FlexiCard.module.css';
import newwindowIcon from '../../../assets/images/newwindow.png';

const FlexiCard = ({ title, description, buttonText, onButtonClick, phone, url }) => {
  // タイトル内の\nを改行に変換
  const renderTitle = () => {
    return title.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const handleButtonClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener noreferrer');
    } else if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <div className={styles.flexiCard}>
      <h4 className={styles.flexiCardTitle}>{renderTitle()}</h4>
      <div className={styles.flexiCardDivider}></div>
      <p className={styles.flexiCardDescription}>{description}</p>
      {phone ? (
        <a className={styles.flexiCardButton} href={`tel:${phone}`}>
          <img src={newwindowIcon} alt="" className={styles.buttonIcon} />
          {phone}
        </a>
      ) : (
        buttonText && (
          <button className={styles.flexiCardButton} onClick={handleButtonClick}>
            <img src={newwindowIcon} alt="" className={styles.buttonIcon} />
            {buttonText}
          </button>
        )
      )}
    </div>
  );
};

export default FlexiCard;
