import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './AdminPage.module.css';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import TweetCard from '../../components/common/TweetCard/TweetCard';
import { getPendingExperiences, getApprovedExperiences, getOnHoldExperiences } from '../../utils/gasApi';
import { useAuth } from '../../contexts/AuthContext';

const AdminPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'onHold', or 'approved'
  const [pendingExperiences, setPendingExperiences] = useState([]);
  const [onHoldExperiences, setOnHoldExperiences] = useState([]);
  const [approvedExperiences, setApprovedExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ログアウト処理
  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      logout();
      navigate('/');
    }
  };

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '管理者画面', path: '/admin' }
  ];

  // データ取得
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pending, onHold, approved] = await Promise.all([
        getPendingExperiences(),
        getOnHoldExperiences(),
        getApprovedExperiences()
      ]);
      setPendingExperiences(pending);
      setOnHoldExperiences(onHold);
      setApprovedExperiences(approved);
    } catch (error) {
      console.error('データ取得エラー:', error);
      setError('データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 体験談詳細ページへ遷移
  const handleOpenDetail = (experienceId) => {
    navigate(`/admin/experience/${experienceId}`, {
      state: { 
        isPending: activeTab === 'pending',
        isOnHold: activeTab === 'onHold',
        isApproved: activeTab === 'approved'
      }
    });
  };

  let currentExperiences;
  if (activeTab === 'pending') {
    currentExperiences = pendingExperiences;
  } else if (activeTab === 'onHold') {
    currentExperiences = onHoldExperiences;
  } else {
    currentExperiences = approvedExperiences;
  }

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={layoutStyles.mainContent}>
        <div className={styles.adminHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>管理者画面</h1>
            <p className={styles.subtitle}>体験談の承認・管理</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || user?.email}</span>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        </div>

        {/* タブ切り替え */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'pending' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            未承認体験談 ({pendingExperiences.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'onHold' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('onHold')}
          >
            保留中体験談 ({onHoldExperiences.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'approved' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            承認済み体験談 ({approvedExperiences.length})
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className={styles.contentArea}>
          {isLoading && (
            <div className={styles.loadingMessage}>読み込み中...</div>
          )}
          {!isLoading && error && (
            <div className={styles.errorMessage}>{error}</div>
          )}
          {!isLoading && !error && currentExperiences.length === 0 && (
            <div className={styles.emptyMessage}>
              {activeTab === 'pending' && '未承認の体験談はありません'}
              {activeTab === 'onHold' && '保留中の体験談はありません'}
              {activeTab === 'approved' && '承認済みの体験談はありません'}
            </div>
          )}
          {!isLoading && !error && currentExperiences.length > 0 && (
            <div className={styles.experiencesList}>
              {currentExperiences.map((experience) => (
                <div key={experience.id} className={styles.experienceItem}>
                  <button 
                    className={styles.cardButton}
                    onClick={() => handleOpenDetail(experience.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenDetail(experience.id);
                      }
                    }}
                  >
                    <div className={styles.cardWrapper}>
                      {/* バッジ表示 */}
                      <div className={styles.badgeContainer}>
                        {experience.submissionState === '新規投稿' && (
                          <span className={`${styles.badge} ${styles.badgeNew}`}>NEW</span>
                        )}
                        {experience.submissionState === '再編集' && (
                          <span className={`${styles.badge} ${styles.badgeResubmit}`}>再編集</span>
                        )}
                        {experience.editCount > 0 && (
                          <span className={`${styles.badge} ${styles.badgeEditCount}`}>
                            編集{experience.editCount}回
                          </span>
                        )}
                      </div>
                      <TweetCard
                        cardId={experience.id}
                        data={experience}
                      />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPage;
