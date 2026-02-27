import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingScreen.module.css';

/**
 * ローディング画面コンポーネント
 * 管理者認証時やページ遷移時に表示される
 */
const LoadingScreen = ({ message = '認証を確認中...', subMessage = null }) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        {/* ローディングアニメーション */}
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner}></div>
          <div className={styles.spinnerInner}></div>
        </div>

        {/* メッセージ */}
        <h2 className={styles.message}>{message}</h2>
        
        {subMessage && (
          <p className={styles.subMessage}>{subMessage}</p>
        )}

        {/* ドットアニメーション */}
        <div className={styles.dots}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string,
  subMessage: PropTypes.string
};

export default LoadingScreen;
