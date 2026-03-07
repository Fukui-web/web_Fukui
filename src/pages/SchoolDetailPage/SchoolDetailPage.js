import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './SchoolDetailPage.module.css';
import placeCards from '../../data/schoolCards';
import TweetCard from '../../components/common/TweetCard/TweetCard';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import vectorRB from '../../assets/images/vectorRB.png';
import { getAllExperiences } from '../../utils/gasApi';

const SchoolDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const card = placeCards.find(c => String(c.id) === String(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [schoolReviews, setSchoolReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '卒業後の進路をさがす', path: '/schools' },
    { label: `詳細${id}`, path: `/schools/${id}` }
  ];

  // 体験談から進路の口コミを抽出するヘルパー関数
  const extractSchoolReviews = (experiences, targetSchoolName) => {
    const reviews = [];
    const schoolName = targetSchoolName?.trim();
    
    console.log('=== 進路の口コミ抽出デバッグ ===');
    console.log('1. 対象進路名:', schoolName);
    console.log('2. 取得した体験談数:', experiences.length);
    
    // すべての学校名を収集して表示
    const allSchoolNames = [];
    experiences.forEach((exp, expIndex) => {
      if (!exp.schools || !Array.isArray(exp.schools)) {
        console.log(`体験談${expIndex + 1} (ID: ${exp.id}): schoolsがありません`);
        return;
      }
      
      exp.schools.forEach((school, schoolIndex) => {
        const schoolNameValue = school.name?.trim();
        const schoolReview = school.review?.trim();
        
        if (schoolNameValue) {
          allSchoolNames.push(schoolNameValue);
          console.log(`体験談${expIndex + 1} (ID: ${exp.id}) - 学校${schoolIndex + 1}:`, {
            name: schoolNameValue,
            hasReview: !!schoolReview,
            matches: schoolNameValue === schoolName
          });
        }
        
        if (schoolNameValue === schoolName && schoolReview) {
          console.log(`✓ マッチしました！体験談ID: ${exp.id}`);
          reviews.push({
            id: exp.id,
            experienceId: exp.id,
            schoolIndex: schoolIndex,
            title: schoolReview.substring(0, 50) + (schoolReview.length > 50 ? '...' : ''),
            description: schoolReview,
            text: schoolReview,
            authorName: exp.authorName || '匿名',
            authorInitial: exp.authorInitial || 'A',
            date: exp.date || '',
            grade: exp.grade || '',
            trigger: exp.trigger || '',
            schoolName: school.name
          });
        }
      });
    });
    
    console.log('3. 見つかった学校名一覧:', [...new Set(allSchoolNames)]);
    console.log('4. マッチした口コミ数:', reviews.length);
    console.log('=====================================');
    
    return reviews;
  };

  // 進路の口コミを取得
  useEffect(() => {
    const fetchSchoolReviews = async () => {
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
        
        // 現在の進路名と一致する口コミを抽出
        const reviews = extractSchoolReviews(experiences, card.title);

        if (reviews.length === 0) {
          setNoData(true);
        } else {
          setSchoolReviews(reviews);
        }
      } catch (err) {
        console.error('❌ 進路の口コミ取得エラー:', err);
        setError('口コミの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolReviews();
  }, [card, id]);

  if (!card) {
    return (
      <div className={layoutStyles.pageContainer}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className={styles.contentArea}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>戻る</button>
          <p>該当の進路が見つかりません。</p>
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

          {card.hpUrl && (
            <div className={styles.urlContainer}>
              <div className={styles.urlLabel}>公式サイト・お問い合わせ窓口</div>
              <a 
                href={card.hpUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.urlLink}
              >
                {card.hpUrl}
              </a>
            </div>
            )}
        
        </section>

        {/* 詳細情報 */}
        {card.detailInfo && (
          <section className={styles.detailInfo}>
            
            {/* 授業スタイル */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>授業スタイル</div>
              <div className={styles.detailValue}>
                {card.detailInfo.style || 'ー'}
              </div>
            </div>

            {/* 登校頻度 */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>登校頻度</div>
              <div className={styles.detailValue}>
                {card.detailInfo.frequency || 'ー'}
              </div>
            </div>

            {/* 学費 */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>学費</div>
              <div className={styles.detailValue}>
                {card.detailInfo.fee || 'ー'}
              </div>
            </div>

            {/* 制服 */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>制服</div>
              <div className={styles.detailValue}>
                {card.detailInfo.uniform || 'なし'}
              </div>
            </div>

            {/* 入試 */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>入試</div>
              <div className={styles.detailValue}>
                {card.detailInfo.exam || 'ー'}
              </div>
            </div>

            {/* 本校所在地 (既存) */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>本校所在地</div>
              <div className={styles.detailValue}>
                {card.detailInfo.location || 'ー'}
              </div>
            </div>

            {/* ▼▼▼ ここから追加 ▼▼▼ */}

            {/* 福井キャンパス */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>福井キャンパス</div>
              <div className={styles.detailValue}>
                {card.detailInfo.campus || 'ー'}
              </div>
            </div>

            {/* 開催される校内イベント */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>開催される校内イベント</div>
              <div className={styles.detailValue}>
                {card.detailInfo.events || 'ー'}
              </div>
            </div>

            {/* 校則 */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>校則</div>
              <div className={styles.detailValue}>
                {card.detailInfo.rules || 'ー'}
              </div>
            </div>

            {/* 在校生徒数 */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>在校生徒数</div>
              <div className={styles.detailValue}>
                {card.detailInfo.studentCount || 'ー'}
              </div>
            </div>

            {/* 在校生と男女比 */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>在校生と男女比</div>
              <div className={styles.detailValue}>
                {card.detailInfo.genderRatio || 'ー'}
              </div>
            </div>

            {/* 進路実績 */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>進路実績（最大5校）</div>
              <div className={styles.detailValue}>
                {card.detailInfo.graduates || 'ー'}
              </div>
            </div>

            {/* 取得資格実績 */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>取得資格実績（最大5個）</div>
              <div className={styles.detailValue}>
                {card.detailInfo.qualifications || 'ー'}
              </div>
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
              <p>この進路の口コミはまだありません</p>
            </div>
          )}
          
          {!loading && !error && !noData && schoolReviews.length > 0 && (
            <>
              <div className={styles.tweetArea}>
                {schoolReviews.slice(0, 3).map((review, index) => (
                  <TweetCard 
                    key={`${review.experienceId}-${review.schoolIndex}`}
                    data={review}
                    relatedContext={{
                      type: 'school',
                      schoolName: card.title,
                      schoolId: id
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

        {/* Topページに戻るボタン */}
        <section className={styles.backToTopSection}>
          <button className={styles.backToTopButton} onClick={() => navigate('/schools')}>
            <img src={vectorRB} alt="" className={styles.buttonIcon} />
            <span>卒業後の進路をさがすページに戻る</span>
          </button>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default SchoolDetailPage;
