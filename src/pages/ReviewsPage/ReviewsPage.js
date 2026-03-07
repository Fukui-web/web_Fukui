import React from 'react';
import { Helmet } from 'react-helmet-async';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';

const ReviewsPage = () => {
  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '口コミ一覧', path: '/reviews' }
  ];

  return (
    <div className={layoutStyles.pageContainer}>
      <Helmet>
        <title>口コミ一覧｜ぼくらのみち</title>
        <meta name="description" content="不登校に関わる施設や支援についての口コミ一覧です。" />
        <link rel="canonical" href="https://bokuranomichi-fukui.com/reviews" />
        <meta property="og:title" content="口コミ一覧｜ぼくらのみち" />
        <meta property="og:description" content="不登校に関わる施設や支援についての口コミ一覧です。" />
        <meta property="og:url" content="https://bokuranomichi-fukui.com/reviews" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://bokuranomichi-fukui.com/title.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={layoutStyles.contentArea}>
        {/* メインコンテンツ（真っ白） */}
      </div>

      <Footer />
    </div>
  );
};

export default ReviewsPage;
