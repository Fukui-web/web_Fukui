import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './InterviewDetailPage.module.css';
import interviewCards from '../../data/interviewCards';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import dotlineImage from '../../assets/images/dotline.png';
import ellipseImage from '../../assets/images/Ellipse.png';
import nakataniImage from '../../assets/images/nakatani.png';

const InterviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const card = interviewCards.find(c => String(c.id) === String(id));

  // 目次のスクロール処理
  const scrollToSection = (sectionIndex) => {
    const element = document.getElementById(`section-${sectionIndex}`);
    if (element) {
      const yOffset = -80; // ヘッダーの高さ分オフセット
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '不登校とぼくら', path: '/04' },
    { label: card ? card.title : `インタビュー${id}`, path: `/interviews/${id}` }
  ];

  if (!card) {
    return (
      <div className={layoutStyles.pageContainer}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className={styles.contentArea}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>戻る</button>
          <p>該当のインタビューが見つかりません。</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`${layoutStyles.pageContainer} ${styles.pageWrapper}`}>
      <Helmet>
        <title>{card ? `【インタビュー】${card.title}｜ぼくらのみち` : 'インタビュー | ぼくらのみち'}</title>
        <meta name="description" content={card?.description?.slice(0, 120) || '不登校を経験した当事者のインタビューです。'} />
        <link rel="canonical" href={`https://bokuranomichi-fukui.com/interviews/${id}`} />
        <meta property="og:title" content={card ? `【インタビュー】${card.title}｜ぼくらのみち` : 'インタビュー | ぼくらのみち'} />
        <meta property="og:description" content={card?.description?.slice(0, 120) || '不登校を経験した当事者のインタビューです。'} />
        <meta property="og:url" content={`https://bokuranomichi-fukui.com/interviews/${id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://bokuranomichi-fukui.com/title.png" />
        <meta name="twitter:card" content="summary_large_image" />
        {card && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": card.title,
            "description": card.description?.slice(0, 120) || '',
            "datePublished": card.date || '',
            "url": `https://bokuranomichi-fukui.com/interviews/${id}`,
            "publisher": {
              "@type": "Organization", 
              "name": "ぼくらのみち",
              "logo": {
                "@type": "ImageObject",
                "url": "https://bokuranomichi-fukui.com/title.png"
              }
            }
          })}</script>
        )}
      </Helmet>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={styles.contentArea}>
        {/* タイトル部分 */}
        <div className={styles.titleSection}>
          <p className={styles.subTitle}>インタビュー</p>
          <h1 className={styles.mainTitle}>不登校とぼくら</h1>
          <img src={dotlineImage} alt="点線" className={styles.dotline} />
        </div>

        {/* プロフィール部分 */}
        <div className={styles.profileSection}>
          <div className={styles.profileIcon}>
            <img src={ellipseImage} alt="プロフィール" className={styles.iconImage} />
          </div>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>
              {card.fullName}さん（{card.profile}）
            </p>
            <p className={styles.profileDate}>
              インタビュー時期：{card.interviewDate}
            </p>
          </div>
        </div>

        {/* 本文 */}
        <div className={styles.contentText}>
          {card.introduction && card.introduction.map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>{paragraph}</p>
          ))}
        </div>

        {/* インタビュー画像 */}
        <div className={styles.interviewImageContainer}>
          <img src={nakataniImage} alt="インタビュー" className={styles.interviewImage} />
        </div>

        {/* 目次セクション */}
        {card.tableOfContents && (
          <div className={styles.tocSection}>
            <h3 className={styles.tocTitle}>目次</h3>
            <ul className={styles.tocList}>
              {card.tableOfContents.map((item, index) => (
                <li 
                  key={index} 
                  className={styles.tocItem}
                  onClick={() => scrollToSection(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* セクション */}
        {card.sections && card.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles.section} id={`section-${sectionIndex}`}>
            <h2 className={styles.sectionHeading}>{section.heading}</h2>
            <div className={styles.sectionDivider}></div>
            
            {section.qaList && section.qaList.map((qa, qaIndex) => (
              <div key={qaIndex} className={styles.qaBlock}>
                <p className={styles.question}>{qa.question}</p>
                <p className={styles.answer}>{qa.answer}</p>
              </div>
            ))}
          </div>
        ))}

        {/* ライター紹介 */}
        {card.writer && (
          <div className={styles.writerSection}>
            <div className={styles.writerIcon}>
              <img src={ellipseImage} alt="ライター" className={styles.writerIconImage} />
            </div>
            <div className={styles.writerInfo}>
              <p className={styles.writerText}>
                ライター：{card.writer.name}<br />
                {card.writer.description}
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default InterviewDetailPage;