import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './PlaceDetailPage.module.css';
import placeCards from '../../data/placeCards';
import TweetCard from '../../components/common/TweetCard/TweetCard';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import newwindowIcon from '../../assets/images/newwindow.png';
import vectorRB from '../../assets/images/vectorRB.png';
import { getAllExperiences } from '../../utils/gasApi';

const PlaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const card = placeCards.find(c => String(c.id) === String(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [placeReviews, setPlaceReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '居場所をさがす', path: '/places' },
    { label: `みんなの居場所${id}`, path: `/places/${id}` }
  ];

  // 体験談から居場所の口コミを抽出するヘルパー関数
  const extractPlaceReviews = (experiences, targetPlaceName) => {
    const reviews = [];
    const placeName = targetPlaceName?.trim();
    
    console.log('=== 居場所の口コミ抽出デバッグ ===');
    console.log('1. 対象居場所名:', placeName);
    console.log('2. 取得した体験談数:', experiences.length);
    
    // すべてのサポート名を収集して表示
    const allSupportNames = [];
    experiences.forEach((exp, expIndex) => {
      if (!exp.supports || !Array.isArray(exp.supports)) {
        console.log(`体験談${expIndex + 1} (ID: ${exp.id}): supportsがありません`);
        return;
      }
      
      exp.supports.forEach((support, supportIndex) => {
        const supportName = support.name?.trim();
        const supportFeeling = support.feeling?.trim();
        
        if (supportName) {
          allSupportNames.push(supportName);
          console.log(`体験談${expIndex + 1} (ID: ${exp.id}) - サポート${supportIndex + 1}:`, {
            name: supportName,
            hasFeeling: !!supportFeeling,
            matches: supportName === placeName
          });
        }
        
        if (supportName === placeName && supportFeeling) {
          console.log(`✓ マッチしました！体験談ID: ${exp.id}`);
          reviews.push({
            id: exp.id,
            experienceId: exp.id,
            supportIndex: supportIndex,
            title: supportFeeling.substring(0, 50) + (supportFeeling.length > 50 ? '...' : ''),
            description: supportFeeling,
            text: supportFeeling,
            authorName: exp.authorName || '匿名',
            authorInitial: exp.authorInitial || 'A',
            date: exp.date || '',
            grade: exp.grade || '',
            trigger: exp.trigger || '',
            support: support.type || '',
            placeName: support.name
          });
        }
      });
    });
    
    console.log('3. 見つかったサポート名一覧:', [...new Set(allSupportNames)]);
    console.log('4. マッチした口コミ数:', reviews.length);
    console.log('=====================================');
    
    return reviews;
  };

  // 居場所の口コミを取得
  useEffect(() => {
    const fetchPlaceReviews = async () => {
      if (!card) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setNoData(false);

        console.log('=== GASから体験談を取得中 ===');
        // 全承認済み体験談を取得
        const experiences = await getAllExperiences(100);
        console.log('取得成功: 体験談数 =', experiences.length);
        
        // 現在の居場所名と一致する口コミを抽出
        const reviews = extractPlaceReviews(experiences, card.title);

        if (reviews.length === 0) {
          setNoData(true);
        } else {
          setPlaceReviews(reviews);
        }
      } catch (err) {
        console.error('❌ 居場所の口コミ取得エラー:', err);
        setError('口コミの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceReviews();
  }, [card, id]);

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
          
          {loading && (
            <div className={styles.loadingMessage}>読み込み中...</div>
          )}
          
          {error && (
            <div className={styles.errorMessage}>
              <p>⚠️ 取得エラー: {error}</p>
            </div>
          )}
          
          {noData && !error && !loading && (
            <div className={styles.noDataMessage}>
              <p>この居場所の口コミはまだありません</p>
            </div>
          )}
          
          {!loading && !error && !noData && placeReviews.length > 0 && (
            <>
              <div className={styles.tweetArea}>
                {placeReviews.slice(0, 3).map((review, index) => (
                  <TweetCard 
                    key={`${review.experienceId}-${review.supportIndex}`}
                    data={review}
                    relatedContext={{
                      type: 'place',
                      placeName: card.title,
                      placeId: id
                    }}
                  />
                ))}
              </div>
              <button className={styles.moreButton} onClick={() => navigate('/experiences')}>
                <img src={vectorRB} alt="" className={styles.buttonIcon} />
                <span>もっと体験談を見る</span>
              </button>
            </>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PlaceDetailPage;
