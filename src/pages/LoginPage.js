import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import layoutStyles from '../components/MainContent/commonPageLayout.module.css';
import styles from './LoginPage.module.css';
import Layout from '../components/Layout/Layout';
import dotlineImage from '../assets/images/dotline.png';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ログイン後のリダイレクト先
  const from = location.state?.from?.pathname || '/';

  // 既にログイン済みの場合はリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLoginSuccess = async (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    
    const result = await login(credentialResponse);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      alert('ログインに失敗しました。もう一度お試しください。');
    }
  };

  const handleLoginError = () => {
    console.log('Login Failed');
    alert('ログインに失敗しました。もう一度お試しください。');
  };

  // 管理者ページへのログインかどうかを判定
  const isAdminLogin = from.includes('/admin');

  return (
    <Layout>
      <div className={layoutStyles.pageContainer}>
        <div className={styles.loginContainer}>
          {/* タイトルセクション */}
          <div className={styles.titleSection}>
            <h1 className={styles.mainTitle}>
              {isAdminLogin ? '管理者ログイン' : 'ログイン'}
            </h1>
            <img src={dotlineImage} alt="" className={styles.dotline} />
            <p className={styles.description}>
              {isAdminLogin ? (
                <>
                  管理者画面にアクセスするには、<br />
                  登録されたGoogleアカウントでのログインが必要です。
                </>
              ) : (
                <>
                  体験談を投稿するには、<br />
                  Googleアカウントでのログインが必要です。
                </>
              )}
            </p>
          </div>

          {/* ログインボタンセクション */}
          <div className={styles.loginButtonSection}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              useOneTap={!isAdminLogin}
              theme="filled_blue"
              size="large"
              text="continue_with"
              shape="rectangular"
              locale="ja"
            />
          </div>

          {/* 注意事項 */}
          <div className={styles.noticeSection}>
            <h3 className={styles.noticeTitle}>
              {isAdminLogin ? '管理者ログインについて' : 'ログインについて'}
            </h3>
            <ul className={styles.noticeList}>
              {isAdminLogin ? (
                <>
                  <li>管理者として登録されたGoogleアカウントが必要です。</li>
                  <li>未登録のアカウントではログインできません。</li>
                  <li>ログイン情報は安全に管理されます。</li>
                </>
              ) : (
                <>
                  <li>ログインにはGoogleアカウントが必要です。</li>
                  <li>ログイン情報は安全に管理されます。</li>
                  <li>投稿時以外の目的で使用されることはありません。</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
