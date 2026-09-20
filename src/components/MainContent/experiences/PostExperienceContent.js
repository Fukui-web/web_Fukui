import React from 'react';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './PostExperienceContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import dotlineImage from '../../../assets/images/dotline.png';

const PostExperienceContent = () => {
  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '体験談の規約', path: '/experiences/post' }
  ];

  // GoogleフォームのURLを設定（実際のフォームIDに置き換える必要があります）
  const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf5BLWGJ9D0qhf1QymIG-sMkiaXLGQgCJTI5xn-FC1ZFL9JMQ/viewform?usp=header';
  
  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />

      {/* メインコンテンツエリア */}
      <div className={styles.mainContentArea}>
        {/* タイトルセクション */}
        <div className={styles.titleBox}>
          <p className={styles.subtitle}>あなたの経験が、<br />だれかの道しるべになります</p>
          <h1 className={styles.mainTitle}>体験談を投稿する前に</h1>
          <img src={dotlineImage} alt="点線" className={styles.dotline} />
        </div>

        {/* ご案内 */}
        <div className={styles.section}>
          <div className={styles.sectionContent}>
            <ul className={styles.numberedList}>
              <li>①　Googleアカウントを取得の上でご記入ください。</li>
              <li>②　途中でフォームを閉じた場合でも回答内容を保存できます。、ゆっくりご記入ください。</li>
              <li>③　長いアンケートになります。記入したいところだけご記入いただければ大丈夫です。</li>
              <li>④　投稿後も修正が可能です。</li>
              <li>⑤　投稿を削除したい場合はお問い合わせフォームからご依頼ください。</li>
            </ul>
            <p className={styles.closingMessage}>～皆さんの言葉が、同じように悩む方々の力になります～</p>
          </div>
        </div>
      </div>

      {/* Googleフォームへのリンク（ボタンのみ） */}
      <div className={styles.formContainer}>
        <a 
          href={googleFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.formButton}
        >
          体験談投稿フォームを開く
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default PostExperienceContent;
