import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Section05.module.css';
import roadNumberImage from '../../../assets/icons/05_0.png';
import SchoolCard from '../../common/SchoolCard/SchoolCard';
import SectionTitle from '../../common/SectionTitle';
import ExperienceSection from '../../common/ExperienceSection/ExperienceSection';

const Section05 = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.section05}>
            <SectionTitle 
                roadNumber="05" 
                title="中学卒業後のこと" 
                roadNumberImage={roadNumberImage} 
            />

            {/* 説明テキスト */}
            <div className={styles.description}>
                <p className={styles.descriptionTitle1}>ここにことばをいれる</p>
                <p className={styles.descriptionTitle2}>ここにことばをいれるここにことば</p>
                <p className={styles.descriptionText}>
                    ここに卒業後の内容をいれる。ここに卒業後の内容をいれる。ここに卒業後の内容をいれる。ここに卒業後の内容をいれる。ここに卒業後の内容をいれる。
                </p>
            </div>

            {/* 学校・フリースクール紹介セクション */}
            <div className={styles.placeSection}>
                <div className={styles.placeHeader}>
                    <span className={styles.placeTag}>選択肢はいろいろあります</span>
                    <h3 className={styles.placeTitle}>学校・フリースクールの紹介</h3>
                </div>
                <div className={styles.placeCardArea}>
                    <SchoolCard cardId={7} />
                    <SchoolCard cardId={8} />
                    <SchoolCard cardId={3} />
                </div>

                <button 
                    className={styles.moreButton}
                    onClick={() => navigate('/schools')}
                >
                    <div className={styles.buttonIconContainer}>
                        <div className={styles.playIcon}></div>
                    </div>
                    <span>中学校卒業後の進路をさがす</span>
                </button>
            </div>

            {/* 10pxの余白 */}
            <div style={{ height: '10px' }} />

            {/* 体験談セクション追加 */}
            <ExperienceSection 
                title={"みんなの体験談を見てみよう！\n卒業後の進路をどう選んだ？"}
                questionId="4-1-3"
                limit={6}
                moreButtonText="卒業後の進路の体験談を見る"
                customClass={styles.experience05}
                onMoreClick={() => navigate('/experiences?questionId=4-1-3')}
                sectionName="卒業後の進路に関する体験談"
            />
        </div>
    );
};

export default Section05;