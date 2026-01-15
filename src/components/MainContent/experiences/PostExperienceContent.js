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
          <p className={styles.subtitle}>あなたの経験が、だれかの道しるべになります</p>
          <h1 className={styles.mainTitle}>体験談を投稿する前に</h1>
          <img src={dotlineImage} alt="点線" className={styles.dotline} />
        </div>

        {/* セクション01 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>01 |</span> この投稿の目的について
          </h2>
          <div className={styles.sectionDivider}></div>
          <div className={styles.sectionContent}>
            <p>不登校の問題解決法は、100人100通り。</p>
            <p>それぞれのご家庭に合った解決法を見つけるヒントとなるように、「体験談」を掲載しこれからの選択肢を見つけられるようにすることを目的としています。</p>
          </div>
        </div>

        {/* セクション02 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>02 |</span> 投稿にあたってのお願い
          </h2>
          <div className={styles.sectionDivider}></div>
          <div className={styles.sectionContent}>
            <p>安心して読めるサイトにするため、以下の点をご配慮ください。</p>
            <ul className={styles.bulletList}>
              <li>読む人が希望を持てるよう、できる範囲で前向きな視点を含めてください（必ずべてをポジティブにする必要はありません。正直な経験が大切です）</li>
              <li>事実にもとづいた体験を書いてください</li>
              <li>悩みに寄り添うような言葉づかいを心がけてください</li>
              <li>施設名・学校名を出す際は中立的な表現をお願いします（誹謗中傷や断定的な評価は掲載できません）</li>
            </ul>
          </div>
        </div>

        {/* セクション03 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>03 |</span> 禁止事項
          </h2>
          <div className={styles.sectionDivider}></div>
          <div className={styles.sectionContent}>
            <p>以下に該当する投稿は、掲載できません。</p>
            <ul className={styles.bulletList}>
              <li>特定の人物・学校・団体・施設への誹謗中傷、事実と異なる情報、断定的な評価</li>
              <li>個人を特定できる情報の記載（氏名、住所など）</li>
              <li>著作権・プライバシーを侵害する内容</li>
              <li>政治・宗教・営利目的の宣伝行為</li>
              <li>不適切な言葉づかい、攻撃的・差別的な表現</li>
              <li>その他、読者に不利益が生じる可能性がある内容</li>
            </ul>
          </div>
        </div>

        {/* セクション04 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>04 |</span> 掲載に関して（審査・編集）
          </h2>
          <div className={styles.sectionDivider}></div>
          <div className={styles.sectionContent}>
            <ul className={styles.bulletList}>
              <li>投稿内容は、運営側で確認し、掲載が適切と判断したものを掲載します。</li>
              <li>掲載にあたり、内容の一部に修正が必要な場合は、該当部分を削除する、または投稿者の了解を得たうえで編集を行います。<br />（運営側が投稿者の意図を変えて書き換えることはありません）</li>
              <li>掲載まで数日いただくことがあります。</li>
              <li>必ずしもすべての投稿が公開されるわけではありません。</li>
            </ul>
          </div>
        </div>

        {/* セクション05 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>05 |</span> 個人情報の取り扱いについて
          </h2>
          <div className={styles.sectionDivider}></div>
          <div className={styles.sectionContent}>
            <ul className={styles.bulletList}>
              <li>名前・メールアドレスなどの個人情報が公開されることはありません。</li>
              <li>投稿者の連絡先は、掲載可否のご連絡や内容の確認が必要な場合のみ運営側が使用します。</li>
              <li>法令に基づく場合を除き、第三者に提供することはありません。</li>
            </ul>
          </div>
        </div>

        {/* セクション06 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>06 |</span> 投稿者の責任と同意事項
          </h2>
          <div className={styles.sectionDivider}></div>
          <div className={styles.sectionContent}>
            <p>以下に同意いただいた上で、投稿をお願いします。</p>
            <ul className={styles.bulletList}>
              <li>投稿内容が自分の体験・自分の言葉であること</li>
              <li>第三者の権利（プライバシー・著作権など）を侵害していないこと</li>
              <li>運営による掲載可否・編集に同意すること</li>
              <li>反社会的な内容を含まないこと</li>
              <li>投稿後の取り消しや修正を希望する場合は、運営へ連絡すること</li>
            </ul>
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
