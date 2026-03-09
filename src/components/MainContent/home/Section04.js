import React from 'react';
import styles from './Section04.module.css';
import roadNumberImage from '../../../assets/icons/04_0.png';
import InterviewCard from '../../common/InterviewCard/InterviewCard';
import SectionTitle from '../../common/SectionTitle';
import ContentFrame from '../../common/ContentFrame';

const Section04 = () => {
    return (
        <div className={styles.section04}>
            <SectionTitle 
                roadNumber="04" 
                title="インタビュー
不登校とぼくら" 
                roadNumberImage={roadNumberImage} 
            />

            <ContentFrame
                title="大丈夫。あなただけじゃない。"
            >
                <div className={styles.contentText}>
                    <p>福井県内で不登校を身近に経験した方々にインタビューをしました。当時のこと、今のこと、今だから言えること…<br />なにかヒントが見つかるかもしれません。</p>
                </div>
            </ContentFrame>

            {/* インタビューセクション - 体験者 */}
            <div className={styles.interviewSection}>
                <div className={styles.interviewHeader}>
                    <span className={styles.interviewTag}>自分と同じ気持ちの人はいるのかな。</span>
                    <h3 className={styles.interviewTitle}>不登校を体験したみんなのインタビューを見てみよう！</h3>
                </div>
                <div className={styles.interviewCardArea}>
                    <InterviewCard cardId={1} />
                </div>
            </div>

            {/* 区切り */}
            <div className={styles.dividerLine}></div>

            {/* インタビューセクション - 支援者 */}
            <div className={styles.interviewSection}>
                <div className={styles.interviewHeader}>
                    <h3 className={styles.interviewTitle}>支援者のみなさんからのメッセージ</h3>
                </div>
                <div className={styles.interviewCardArea}>
                    <InterviewCard cardId={2} />
                </div>

                <button className={styles.moreButton}>
                    <div className={styles.playIcon}></div>
                    <span>インタビューをもっと見る</span>
                </button>
            </div>
        </div>
    );
};

export default Section04;
