// src/components/common/FlexiCard/FlexiCard.js
// FlexiCard - 柔軟に使える汎用カードコンポーネント
// どんなコンテンツも入れられる自由度の高いカード

import React from 'react';
import styles from './FlexiCard.module.css';
import newwindowIcon from '../../../assets/images/newwindow.png';

const FlexiCard = ({ title, description, buttonText, onButtonClick }) => {
  // タイトル内の\nを改行に変換
  const renderTitle = () => {
    return title.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={styles.flexiCard}>
      <h4 className={styles.flexiCardTitle}>{renderTitle()}</h4>
      <div className={styles.flexiCardDivider}></div>
      <p className={styles.flexiCardDescription}>{description}</p>
      {buttonText && (
        <button className={styles.flexiCardButton} onClick={onButtonClick}>
          <img src={newwindowIcon} alt="" className={styles.buttonIcon} />
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default FlexiCard;
