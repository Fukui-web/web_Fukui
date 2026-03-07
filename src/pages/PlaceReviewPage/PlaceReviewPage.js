import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './PlaceReviewPage.module.css';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import newwindowIcon from '../../assets/images/newwindow.png';

const PlaceReviewPage = () => {
  const { id } = useParams();

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '居場所をさがす', path: '/places' },
    { label: `みんなの居場所${id}`, path: `/places/${id}` }
  ];

  return (
    <div className={layoutStyles.pageContainer}>
      <Helmet>
        <title>口コミ | 居場所詳細 | ぼくらのみち</title>
        <meta name="description" content="居場所に寍せられた口コミを確認できます。" />
        <link rel="canonical" href={`https://bokuranomichi-fukui.com/places/${id}/reviews`} />
      </Helmet>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={styles.contentArea}>
        {/* タブナビゲーション */}
        <div className={styles.tabNav}>
          <Link to={`/places/${id}`} className={styles.tab}>
            <img src={newwindowIcon} alt="" className={styles.tabIcon} />
            居場所情報
          </Link>
          <div className={`${styles.tab} ${styles.tabActive}`}>
            <img src={newwindowIcon} alt="" className={styles.tabIcon} />
            口コミ
          </div>
        </div>

        <main className={styles.main}>
          <p className={styles.placeholder}>口コミを入力するページ</p>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default PlaceReviewPage;
