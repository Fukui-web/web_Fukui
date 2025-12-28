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
  const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf5BLWGJ9D0qhf1QymIG-sMkiaXLGQgCJTI5xn-FC1ZFL9JMQ/viewform?usp=header';
  
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

      {/* Googleフォームへのリンク */}
      <div className={styles.formContainer}>
        <div className={styles.formLinkSection}>
          <p className={styles.formDescription}>
            以下のボタンからGoogleフォームにアクセスして、体験談を投稿してください。<br />
            ※Googleアカウントでのログインが必要です。
          </p>
          <a 
            href={googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.formButton}
          >
            体験談投稿フォームを開く
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PostExperienceContent;
