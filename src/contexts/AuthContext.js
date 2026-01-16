import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { verifyAdmin } from '../utils/gasApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // ローカルストレージから認証情報を復元
  useEffect(() => {
    const storedUser = localStorage.getItem('googleUser');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAdmin(storedIsAdmin === 'true');
      } catch (error) {
        console.error('ユーザー情報の復元に失敗しました:', error);
        localStorage.removeItem('googleUser');
        localStorage.removeItem('isAdmin');
      }
    }
    setIsLoading(false);
  }, []);

  // ログイン成功時の処理（管理者検証を含む）
  const login = async (credentialResponse) => {
    setIsVerifying(true);
    
    try {
      // JWTトークンをデコード
      const decoded = parseJwt(credentialResponse.credential);
      
      const userData = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        credential: credentialResponse.credential
      };

      // GAS側で管理者かどうかを検証
      const adminCheckResult = await verifyAdmin(credentialResponse.credential);
      
      setUser(userData);
      setIsAdmin(adminCheckResult.isAdmin);
      
      localStorage.setItem('googleUser', JSON.stringify(userData));
      localStorage.setItem('isAdmin', adminCheckResult.isAdmin.toString());
      
      console.log('Login successful:', {
        email: userData.email,
        isAdmin: adminCheckResult.isAdmin
      });
      
      return {
        success: true,
        isAdmin: adminCheckResult.isAdmin
      };
      
    } catch (error) {
      console.error('ログイン処理中にエラーが発生しました:', error);
      return {
        success: false,
        isAdmin: false,
        error: error.message
      };
    } finally {
      setIsVerifying(false);
    }
  };

  // ログアウト処理
  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('googleUser');
    localStorage.removeItem('isAdmin');
  };

  // JWTトークンをデコードする関数
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.codePointAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('トークンのデコードに失敗しました:', error);
      return null;
    }
  };

  const value = useMemo(() => ({
    user,
    isLoading,
    isAdmin,
    isVerifying,
    login,
    logout,
    isAuthenticated: !!user
  }), [user, isLoading, isAdmin, isVerifying]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// カスタムフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
