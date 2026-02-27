import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import layoutStyles from '../components/MainContent/commonPageLayout.module.css';
import styles from './LoginPage.module.css';
import Layout from '../components/Layout/Layout';
import LoadingScreen from '../components/common/LoadingScreen';
import AuthenticationSuccess from '../components/common/AuthenticationSuccess';
import dotlineImage from '../assets/images/dotline.png';

const LoginPage = () => {
  const { login, isAuthenticated, isVerifying, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loginResult, setLoginResult] = useState(null);

  // ログイン後のリダイレクト先
  const from = location.state?.from?.pathname || '/';

  // 既にログイン済みの場合はリダイレクト（成功画面表示中を除く）
  useEffect(() => {
    if (isAuthenticated && !showSuccess) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, showSuccess]);

  // 管理者権限がない状態でのログイン後、すぐにリダイレクト
  useEffect(() => {
    if (showSuccess && loginResult?.success && isAuthenticated) {
      const isAdminPage = from.includes('/admin');
      // 管理者ページへのアクセスで管理者権限がない場合、すぐにリダイレクト
      if (isAdminPage && !loginResult.isAdmin) {
        // AdminProtectedRouteに処理を任せるため、すぐにリダイレクト
        navigate(from, { replace: true });
      }
    }
  }, [showSuccess, loginResult, isAuthenticated, from, navigate]);

  const handleLoginSuccess = async (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    
    const result = await login(credentialResponse);
    
    if (result.success) {
      // 成功画面を表示
      setLoginResult(result);
      setShowSuccess(true);
    } else {
      alert('ログインに失敗しました。もう一度お試しください。');
    }
  };

  // 成功画面完了後のリダイレクト処理
  const handleSuccessComplete = () => {
    navigate(from, { replace: true });
  };

  const handleLoginError = () => {
    console.log('Login Failed');
    alert('ログインに失敗しました。もう一度お試しください。');
  };

  // 管理者ページへのログインかどうかを判定
  const isAdminLogin = from.includes('/admin');

  // 認証成功画面を表示（管理者権限がある場合、または通常ログインの場合）
  if (showSuccess && loginResult?.success) {
    // 管理者ページへのアクセスで管理者権限がない場合は成功画面を表示しない
    const shouldShowSuccess = !isAdminLogin || loginResult.isAdmin;
    
    if (shouldShowSuccess) {
      return (
        <AuthenticationSuccess
          message="認証に成功しました"
          subMessage={isAdminLogin ? '管理者画面に移動します' : '元のページに戻ります'}
          userName={user?.name}
          isAdmin={loginResult.isAdmin}
          onComplete={handleSuccessComplete}
          duration={2500}
        />
      );
    }
  }

  // 認証検証中はローディング画面を表示
  if (isVerifying) {
    return (
      <LoadingScreen 
        message={isAdminLogin ? '管理者認証を確認中...' : 'ログイン処理中...'}
        subMessage="しばらくお待ちください"
      />
    );
  }

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
