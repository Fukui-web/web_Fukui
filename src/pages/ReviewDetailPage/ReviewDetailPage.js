import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './ReviewDetailPage.module.css';
import reviewCards from '../../data/reviewCards';
import ReviewCard from '../../components/common/ReviewCard/ReviewCard';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';

const ReviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const card = reviewCards.find(c => String(c.id) === String(id));

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '口コミ一覧', path: '/reviews' },
    { label: card ? (card.title || '口コミ').replace(/\n/g, '') : `口コミ${id}`, path: `/reviews/${id}` }
  ];

  if (!card) {
    return (
      <div className={layoutStyles.pageContainer}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className={styles.contentArea}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>戻る</button>
          <p>該当の口コミが見つかりません。</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Related: show other review cards (exclude current)
  const related = reviewCards.filter(c => c.id !== card.id).slice(0, 4);
  const reviewContent = card.body || card.text || '';

  return (
    <div className={layoutStyles.pageContainer}>
      <Helmet>
        <title>{`【口コミ】${card.title ? card.title.replace(/\n/g, '') : '不登校支援について'}｜ぼくらのみち`}</title>
        <meta name="description" content={`当事者による口コミ・評判です。「${reviewContent.slice(0, 80)}...」`} />
        <link rel="canonical" href={`https://bokuranomichi-fukui.com/reviews/${id}`} />
        <meta property="og:title" content={`【口コミ】${card.title ? card.title.replace(/\n/g, '') : '不登校支援について'}｜ぼくらのみち`} />
        <meta property="og:description" content={`当事者による口コミ・評判です。「${reviewContent.slice(0, 80)}...」`} />
        <meta property="og:url" content={`https://bokuranomichi-fukui.com/reviews/${id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://bokuranomichi-fukui.com/title.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Review",
          "headline": card.title || '口コミ',
          "reviewBody": reviewContent,
          "author": {
            "@type": "Person",
            "name": card.authorName || '匿名'
          },
          "reviewRating": card.rating ? {
            "@type": "Rating",
            "ratingValue": card.rating,
            "bestRating": "5"
          } : undefined,
          "itemReviewed": {
            "@type": "Organization",
            "name": "ぼくらのみち 掲載施設・支援"
          }
        })}</script>
      </Helmet>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={styles.contentArea}>
        <main className={styles.main}>
          <section className={styles.titleSection}>
            <h2 className={styles.pageTitle}>{card.title || '口コミタイトル'}</h2>
            <div className={styles.metaInfo}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <span>{card.authorInitial}</span>
                </div>
                <span className={styles.authorName}>{card.authorName}</span>
              </div>
              <span className={styles.date}>{card.date}</span>
            </div>
          </section>

          {card.tags && card.tags.length > 0 && (
            <section className={styles.tagSection}>
              {card.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </section>
          )}

          <section className={styles.bodySection}>
            <p className={styles.bodyText}>{reviewContent}</p>
          </section>

          {card.rating && (
            <section className={styles.ratingSection}>
              <span className={styles.ratingLabel}>評価:</span>
              <span className={styles.ratingValue}>{'★'.repeat(card.rating)}{'☆'.repeat(5 - card.rating)}</span>
            </section>
          )}

          <section className={styles.relatedSection}>
            <h3 className={styles.relatedTitle}>他の口コミ</h3>
            <div className={styles.relatedCards}>
              {related.map(review => (
                <ReviewCard key={review.id} cardId={review.id} />
              ))}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ReviewDetailPage;