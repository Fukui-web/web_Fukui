import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PropTypes from 'prop-types';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading, isVerifying, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 別のアカウントでログインする処理
  const handleSwitchAccount = () => {
    logout();
    navigate('/login', { state: { from: location }, replace: true });
  };

  // ロード中またはGAS検証中
  if (isLoading || isVerifying) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <p>認証を確認中...</p>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  // 未ログインの場合、ログインページへリダイレクト
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ログイン済みだが管理者権限がない場合
  if (!isAdmin) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{
          maxWidth: '600px',
          backgroundColor: 'white',
          padding: '3rem 2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>🔒</div>
          <h1 style={{ 
            fontSize: '1.8rem', 
            color: '#e74c3c',
            marginBottom: '1rem',
            fontFamily: "'Zen Kaku Gothic New', sans-serif"
          }}>管理者権限がありません</h1>
          
          <p style={{ 
            fontSize: '1rem', 
            color: '#666',
            marginBottom: '0.5rem',
            lineHeight: '1.6'
          }}>
            現在ログイン中のアカウント:<br />
            <strong style={{ color: '#333', fontSize: '1.1rem' }}>{user?.email}</strong>
          </p>
          
          <p style={{ 
            fontSize: '1rem', 
            color: '#666',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            このページは管理者権限を持つアカウントのみアクセスできます。<br />
            管理者アカウントでログインし直すか、前のページに戻ってください。
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={handleSwitchAccount}
              style={{
                padding: '0.8rem 2rem',
                fontSize: '1rem',
                backgroundColor: '#EF9F94',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontFamily: "'Zen Kaku Gothic New', sans-serif",
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(239, 159, 148, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#E88E83';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(239, 159, 148, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#EF9F94';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(239, 159, 148, 0.3)';
              }}
            >
              別のアカウントでログイン
            </button>
            <button 
              onClick={() => navigate('/')}
              style={{
                padding: '0.8rem 2rem',
                fontSize: '1rem',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontFamily: "'Zen Kaku Gothic New', sans-serif",
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(149, 165, 166, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#7f8c8d';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(149, 165, 166, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#95a5a6';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(149, 165, 166, 0.3)';
              }}
            >
              トップページへ戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 認証済み & 管理者権限あり
  return children;
};

AdminProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default AdminProtectedRoute;
