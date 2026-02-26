import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './AuthenticationSuccess.module.css';

/**
 * 認証成功画面コンポーネント
 * ログイン成功後に表示され、自動的にリダイレクト
 */
const AuthenticationSuccess = ({ 
  message = '認証に成功しました', 
  subMessage = null,
  userName = null,
  isAdmin = false,
  onComplete = null,
  duration = 2000
}) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [onComplete, duration]);

  return (
    <div className={styles.successContainer}>
      <div className={styles.successContent}>
        {/* チェックマークアニメーション */}
        <div className={styles.checkmarkWrapper}>
          <div className={styles.checkmarkCircle}>
            <div className={styles.checkmark}></div>
          </div>
        </div>

        {/* メッセージ */}
        <h2 className={styles.message}>{message}</h2>
        
        {userName && (
          <p className={styles.userName}>ようこそ、{userName}さん</p>
        )}
        
        {subMessage && (
          <p className={styles.subMessage}>{subMessage}</p>
        )}

        {/* プログレスインジケーター */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
        
        <p className={styles.redirectMessage}>画面を切り替えています...</p>
      </div>
    </div>
  );
};

AuthenticationSuccess.propTypes = {
  message: PropTypes.string,
  subMessage: PropTypes.string,
  userName: PropTypes.string,
  isAdmin: PropTypes.bool,
  onComplete: PropTypes.func,
  duration: PropTypes.number
};

export default AuthenticationSuccess;
