import React from 'react';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './PostExperienceContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import dotlineImage from '../../../assets/images/dotline.png';

const PostExperienceContent = () => {
  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '体験談を投稿する', path: '/experiences/post' }
  ];

  // GoogleフォームのURLを設定（実際のフォームIDに置き換える必要があります）
  const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf5BLWGJ9D0qhf1QymIG-sMkiaXLGQgCJTI5xn-FC1ZFL9JMQ/viewform?usp=dialog';

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* タイトルセクション */}
      <div className={styles.titleSection}>
        <h1 className={styles.mainTitle}>体験談を投稿する</h1>
        <img src={dotlineImage} alt="" className={styles.dotline} />
        <p className={styles.description}>
          あなたの体験が、誰かの支えになります。<br />
          匿名での投稿も可能です。お気軽にご投稿ください。
        </p>
      </div>

      {/* Googleフォーム埋め込み */}
      <div className={styles.formContainer}>
        <iframe
          src={googleFormUrl}
          width="100%"
          height="1200"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="体験談投稿フォーム"
          className={styles.googleForm}
        >
          読み込んでいます…
        </iframe>
      </div>

      <Footer />
    </div>
  );
};

export default PostExperienceContent;
