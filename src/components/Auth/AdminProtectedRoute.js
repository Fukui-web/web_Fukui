import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PropTypes from 'prop-types';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading, isVerifying } = useAuth();
  const location = useLocation();

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
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', color: '#e74c3c' }}>アクセス権限がありません</h1>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>
          このページは管理者のみがアクセスできます。<br />
          管理者権限が必要な場合は、システム管理者にお問い合わせください。
        </p>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '0.8rem 2rem',
            fontSize: '1rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          前のページに戻る
        </button>
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
