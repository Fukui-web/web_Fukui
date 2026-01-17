import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './PlaceDetailPage.module.css';
import placeCards from '../../data/placeCards';
import ReviewCard from '../../components/common/ReviewCard/ReviewCard';
import reviewCards from '../../data/reviewCards';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import newwindowIcon from '../../assets/images/newwindow.png';
import vectorRB from '../../assets/images/vectorRB.png';

const PlaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const card = placeCards.find(c => String(c.id) === String(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '居場所をさがす', path: '/places' },
    { label: `みんなの居場所${id}`, path: `/places/${id}` }
  ];

  if (!card) {
    return (
      <div className={layoutStyles.pageContainer}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className={styles.contentArea}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>戻る</button>
          <p>該当の居場所が見つかりません。</p>
        </div>
        <Footer />
      </div>
    );
  }

  // 画像スライダー用の関数
  const images = card.images || [card.image];
  const totalImages = images.length;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={styles.contentArea}>
        {/* タブナビゲーション */}
        <div className={styles.tabNav}>
          <div className={`${styles.tab} ${styles.tabActive}`}>
            <img src={newwindowIcon} alt="" className={styles.tabIcon} />
            居場所情報
          </div>
        </div>

        {/* タイトルとタグ */}
        <section className={styles.titleSection}>
          <h1 className={styles.pageTitle}>
            {card.title ? card.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < card.title.split('\n').length - 1 && <br />}
              </React.Fragment>
            )) : 'タイトル'}
          </h1>
          <div className={styles.tagArea}>
            {card.tags && card.tags.map((tag, index) => (
              <div key={index} className={styles.tag}>
                {tag}
              </div>
            ))}
          </div>
        </section>

        {/* 画像スライダー */}
        <section className={styles.imageSlider}>
          <div className={styles.imageContainer}>
            <img src={images[currentImageIndex]} alt={`${card.title} ${currentImageIndex + 1}`} className={styles.image} />
          </div>
          <div className={styles.pagination}>
            <button onClick={handlePrevImage} className={styles.paginationBtn}>←</button>
            <span className={styles.paginationText}>{currentImageIndex + 1} / {totalImages}</span>
            <button onClick={handleNextImage} className={styles.paginationBtn}>→</button>
          </div>
        </section>

        {/* こんなところです */}
        <section className={styles.aboutSection}>
          <div className={styles.aboutTitle}>＼こんなところです／</div>
          <p className={styles.aboutText}>{card.body}</p>
        </section>

        {/* 詳細情報 */}
        {card.detailInfo && (
          <section className={styles.detailInfo}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>所在地</span>
              <span className={styles.detailValue}>{card.detailInfo.location}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>電話番号</span>
              <span className={styles.detailValue}>{card.detailInfo.phone}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>メール</span>
              <span className={styles.detailValue}>{card.detailInfo.email}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>公式サイト</span>
              <span className={styles.detailValue}>{card.detailInfo.website}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>対象</span>
              <span className={styles.detailValue}>{card.detailInfo.target}</span>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel} style={{ display: 'flex', flexDirection: 'column' }}>
                <span>こんな方に</span>
                <span>おすすめ</span>
              </div>
              <span className={styles.detailValue}>{card.detailInfo.recommended}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>一般的に？</span>
              <span className={styles.detailValue}>{card.detailInfo.suggestion}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>開催日時</span>
              <span className={styles.detailValue}>{card.detailInfo.schedule}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>料金</span>
              <span className={styles.detailValue}>{card.detailInfo.fee}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>その他</span>
              <span className={styles.detailValue}>{card.detailInfo.other}</span>
            </div>
          </section>
        )}

        {/* 利用者の口コミ */}
        <section className={styles.reviewSection}>
          <div className={styles.reviewTitle}>
            <div className={styles.titleLine1}>みんなの体験談を見てみよう!</div>
            <div className={styles.titleLine2}>利用者の口コミ</div>
          </div>
          <div className={styles.tweetArea}>
            {reviewCards.slice(0, 3).map(review => (
              <ReviewCard key={review.id} cardId={review.id} />
            ))}
          </div>
          <button className={styles.moreButton} onClick={() => navigate('/reviews')}>
            <img src={vectorRB} alt="" className={styles.buttonIcon} />
            <span>みんなの居場所の検索ページ</span>
          </button>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PlaceDetailPage;
