import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './TweetDetailPage.module.css';
import tweetCards from '../../data/tweetCards';
import TweetCard from '../../components/common/TweetCard/TweetCard';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import { searchExperiences, getExperienceById } from '../../utils/gasApi';

const TweetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [experienceData, setExperienceData] = useState(null);
  const [relatedExperiences, setRelatedExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [error, setError] = useState(false);
  const [relatedError, setRelatedError] = useState(null);
  const [noRelatedData, setNoRelatedData] = useState(false);

  // locationのstateから渡されたデータとコンテキストを取得
  const passedData = location.state?.experienceData;
  const relatedContext = location.state?.relatedContext;

  useEffect(() => {
    const loadExperienceData = async () => {
      setIsLoading(true);
      setError(false);
      // 常にGASから完全なデータを取得
      try {
        const data = await getExperienceById(id);
        setExperienceData(data);
        loadRelatedExperiences(data);
      } catch (error) {
        console.error('体験談の取得エラー:', error);
        // エラー時は渡されたデータまたはtweetCardsから取得（フォールバック）
        if (passedData) {
          setExperienceData(passedData);
        } else {
          const card = tweetCards.find(c => String(c.id) === String(id));
          if (card) {
            setExperienceData(card);
          } else {
            setError(true);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadExperienceData();
  }, [id, passedData]);

  // 関連する体験談を取得
  const loadRelatedExperiences = async (currentData) => {
    setIsLoadingRelated(true);
    setRelatedError(null);
    setNoRelatedData(false);
    
    try {
      // relatedContextがあればそれを使用（遷移元から渡された関連記事）
      if (relatedContext && relatedContext.relatedExperiences) {
        // 現在の体験談を除外して最大4件取得
        const related = relatedContext.relatedExperiences
          .filter(item => String(item.id) !== String(id))
          .slice(0, 4);
        
        if (related.length === 0) {
          setNoRelatedData(true);
        } else {
          setRelatedExperiences(related);
        }
        setIsLoadingRelated(false);
        return;
      }
      
      // relatedContextがない場合は従来通り学年やきっかけで検索
      const filters = {};
      if (currentData.grade) {
        filters.grade = [currentData.grade];
      }
      
      const results = await searchExperiences('*', filters);
      // 現在の体験談を除外して最大4件取得
      const related = results.filter(item => String(item.id) !== String(id)).slice(0, 4);
      
      if (related.length === 0) {
        setNoRelatedData(true);
      } else {
        setRelatedExperiences(related);
      }
    } catch (error) {
      console.error('関連体験談の取得エラー:', error);
      setRelatedError('関連記事の取得に失敗しました');
    } finally {
      setIsLoadingRelated(false);
    }
  };

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '体験談をさがす', path: '/experiences' },
    { label: `体験談${id}`, path: `/experiences/${id}` }
  ];

  // 読み込み中の表示
  if (isLoading) {
    return (
      <div className={layoutStyles.pageContainer}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className={styles.contentArea}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>読み込み中...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // データが読み込まれていない場合（エラー時）
  if (error || !experienceData) {
    return (
      <div className={layoutStyles.pageContainer}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className={styles.contentArea}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>戻る</button>
          <p>該当の体験談が見つかりません。</p>
        </div>
        <Footer />
      </div>
    );
  }

  // データの整形（検索結果とtweetCardsの両方に対応）
  const displayData = {
    // 基本情報
    title: experienceData.title || experienceData.text || 'タイトルなし',
    authorName: experienceData.authorName || 'ひろまま',
    authorInitial: experienceData.authorInitial || 'H',
    date: experienceData.date || '2025.07.03',
    grade: experienceData.grade || '',
    family: experienceData.family || '',
    
    // セクション2: 不登校のきっかけ
    trigger: experienceData.trigger || '',
    detail: experienceData.detail || experienceData.description || experienceData.text || '',
    
    // セクション2の続き: 初動と経過
    parentInitialAction: experienceData.parentInitialAction || '',
    childReaction: experienceData.childReaction || '',
    schoolResponse: experienceData.schoolResponse || '',
    initialReflection: experienceData.initialReflection || '',
    firstMonthLife: experienceData.firstMonthLife || '',
    hardestTime: experienceData.hardestTime || '',
    dailyLifeOverMonth: experienceData.dailyLifeOverMonth || '',
    improvementTrigger: experienceData.improvementTrigger || '',
    schoolConnection: experienceData.schoolConnection || '',
    
    // セクション3: 子どもの成長過程
    elementarySchool: experienceData.elementarySchool || '',
    juniorHighSchool: experienceData.juniorHighSchool || '',
    highSchool: experienceData.highSchool || '',
    alternativeSchool: experienceData.alternativeSchool || '',
    
    // セクション4: 通信制・定時制の学校情報
    schools: experienceData.schools || [],
    
    // セクション5: 行政・民間サポートの有無
    supportUsed: experienceData.supportUsed || '',
    
    // セクション6: 利用したサポート
    supports: experienceData.supports || [],
    support: experienceData.support || '',
    
    // セクション7: その他のサポートと今の想い
    otherSupport: experienceData.otherSupport || '',
    currentThoughts: experienceData.currentThoughts || '',
    message: experienceData.message || ''
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={styles.contentArea}>
        <header className={styles.hero}>
          <p className={styles.heroLead}>子どもが不登校に・・・</p>
          <h1 className={styles.heroTitle}>みんなの体験</h1>
          <div className={styles.heroDots} />
        </header>

        <main className={styles.main}>
          <section className={styles.titleSection}>
            <h2 className={styles.pageTitle}>{displayData.title}</h2>
            <div className={styles.titleDivider}></div>
          </section>

          <section className={styles.tocAndMeta}>
            <aside className={styles.tocBox}>
              <strong>体験談の目次</strong>
              <ul>
                {displayData.grade && <li>▼ 1. 基本情報</li>}
                {(displayData.detail || displayData.parentInitialAction || displayData.childReaction || 
                  displayData.schoolResponse || displayData.initialReflection || displayData.firstMonthLife || 
                  displayData.hardestTime || displayData.dailyLifeOverMonth || displayData.improvementTrigger || 
                  displayData.schoolConnection) && 
                  <li>▼ 2. 不登校のきっかけと経過</li>}
                {(displayData.elementarySchool || displayData.juniorHighSchool || 
                  displayData.highSchool || displayData.alternativeSchool) && 
                  <li>▼ 3. 子どもの成長過程</li>}
                {displayData.schools.length > 0 && <li>▼ 4. 通信制・定時制の学校情報</li>}
                {displayData.supportUsed && <li>▼ 5. 行政・民間サポート</li>}
                {displayData.supports.length > 0 && <li>▼ 6. 利用したサポート</li>}
                {(displayData.otherSupport || displayData.currentThoughts) && 
                  <li>▼ 7. その他のサポートと今の想い</li>}
              </ul>
            </aside>

            <div className={styles.metaArea}>
              <div className={styles.metaRow}>
                <span>記載日</span>
                <span>{displayData.date}</span>
              </div>
              <div className={styles.metaRow}>
                <span>投稿者</span>
                <span>{displayData.authorName}</span>
              </div>
              <div className={styles.metaRow}>
                <span>不登校時の学年</span>
                <span>{displayData.grade}</span>
              </div>
              {displayData.family && (
                <div className={styles.metaRow}>
                  <span>家族構成</span>
                  <span>{displayData.family}</span>
                </div>
              )}
              {displayData.trigger && (
                <div className={styles.metaRow}>
                  <span>きっかけ</span>
                  <span>{displayData.trigger}</span>
                </div>
              )}
            </div>
          </section>

          {/* セクション2: 不登校のきっかけと経過 */}
          {displayData.detail && (
            <section className={styles.bodySection}>
              <h3 className={styles.sectionHeading}>2. 不登校のきっかけと経過</h3>
              <div className={styles.sectionDivider}></div>
              
              {displayData.trigger && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>2-1. 不登校になったきっかけ</h4>
                  <div className={styles.articleBody}>
                    <p>{displayData.trigger}</p>
                  </div>
                </div>
              )}
              
              <div className={styles.subsection}>
                <h4 className={styles.subsectionTitle}>2-2. 詳しい状況</h4>
                <div className={styles.articleBody}>
                  {displayData.detail.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              
              {displayData.parentInitialAction && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>2-3. 保護者の初動</h4>
                  <div className={styles.articleBody}>
                    {displayData.parentInitialAction.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.childReaction && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>2-4. 子どもの反応</h4>
                  <div className={styles.articleBody}>
                    {displayData.childReaction.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.schoolResponse && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>2-5. 学校の反応・対応</h4>
                  <div className={styles.articleBody}>
                    {displayData.schoolResponse.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.initialReflection && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>2-6. 初動の振り返り</h4>
                  <div className={styles.articleBody}>
                    {displayData.initialReflection.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.firstMonthLife && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>2-7. 不登校になって1か月の生活</h4>
                  <div className={styles.articleBody}>
                    {displayData.firstMonthLife.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.hardestTime && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>2-8. 一番つらかった時期</h4>
                  <div className={styles.articleBody}>
                    {displayData.hardestTime.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.dailyLifeOverMonth && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>2-9. 不登校が1ヶ月以上続いた方に質問です。お子さんと保護者は、日々をどのように過ごしていましたか？</h4>
                  <div className={styles.articleBody}>
                    {displayData.dailyLifeOverMonth.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.improvementTrigger && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>2-10. 改善のきっかけ</h4>
                  <div className={styles.articleBody}>
                    {displayData.improvementTrigger.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.schoolConnection && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>2-11. お子さんや保護者の方は、学校とはどのように繋がっていましたか？</h4>
                  <div className={styles.articleBody}>
                    {displayData.schoolConnection.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* セクション3: 子どもの成長過程 */}
          {(displayData.elementarySchool || displayData.juniorHighSchool || displayData.highSchool || displayData.alternativeSchool) && (
            <section className={styles.bodySection}>
              <h3 className={styles.sectionHeading}>3. 子どもの成長過程</h3>
              <div className={styles.sectionDivider}></div>
              
              {displayData.elementarySchool && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>3-1. 小学生のころ</h4>
                  <div className={styles.articleBody}>
                    {displayData.elementarySchool.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.juniorHighSchool && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>3-2. 中学生のころ</h4>
                  <div className={styles.articleBody}>
                    {displayData.juniorHighSchool.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.highSchool && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>3-3. 高校生のころ</h4>
                  <div className={styles.articleBody}>
                    {displayData.highSchool.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.alternativeSchool && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>3-4. 中学卒業後の通信制・定時制</h4>
                  <div className={styles.articleBody}>
                    {displayData.alternativeSchool.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* セクション4: 通信制・定時制の学校情報 */}
          {displayData.schools.length > 0 && (
            <section className={styles.bodySection}>
              <h3 className={styles.sectionHeading}>4. 通信制・定時制の学校情報</h3>
              <div className={styles.sectionDivider}></div>
              
              {displayData.schools.map((school, index) => (
                <div key={index} className={styles.subsection} style={{ marginBottom: '40px' }}>
                  <h4 className={styles.subsectionTitle}>4-{index + 1}. {school.name}</h4>
                  
                  {school.period && (
                    <div style={{ marginBottom: '20px' }}>
                      <h5 className={styles.subsectionTitle} style={{ fontSize: '14px', marginBottom: '8px' }}>4-{index + 1}-1. 通学期間</h5>
                      <div className={styles.articleBody}>
                        {school.period.split('\n').map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {school.reason && (
                    <div style={{ marginBottom: '20px' }}>
                      <h5 className={styles.subsectionTitle} style={{ fontSize: '14px', marginBottom: '8px' }}>4-{index + 1}-2. 選んだ理由</h5>
                      <div className={styles.articleBody}>
                        {school.reason.split('\n').map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {school.review && (
                    <div style={{ marginBottom: '20px' }}>
                      <h5 className={styles.subsectionTitle} style={{ fontSize: '14px', marginBottom: '8px' }}>4-{index + 1}-3. 感想（良かった点・もう少しこうだったら良かった点）</h5>
                      <div className={styles.articleBody}>
                        {school.review.split('\n').map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {school.cost && (
                    <div style={{ marginBottom: '20px' }}>
                      <h5 className={styles.subsectionTitle} style={{ fontSize: '14px', marginBottom: '8px' }}>4-{index + 1}-4. 費用</h5>
                      <div className={styles.articleBody}>
                        {school.cost.split('\n').map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* セクション5: 行政・民間サポートの有無 */}
          {displayData.supportUsed && (
            <section className={styles.bodySection}>
              <h3 className={styles.sectionHeading}>5. 行政・民間サポート</h3>
              <div className={styles.sectionDivider}></div>
              
              <div className={styles.subsection}>
                <h4 className={styles.subsectionTitle}>5-1. 利用した行政サポート・民間サポート</h4>
                <div className={styles.articleBody}>
                  {displayData.supportUsed.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* セクション6: 利用したサポート */}
          {displayData.supports.length > 0 && (
            <section className={styles.bodySection}>
              <h3 className={styles.sectionHeading}>6. 利用したサポート</h3>
              <div className={styles.sectionDivider}></div>
              
              {displayData.supports.map((support, idx) => (
                <div key={idx} className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>6-{idx + 1}. {support.type}</h4>
                  
                  {support.name && (
                    <div className={styles.articleBody}>
                      <p><strong>6-{idx + 1}-1. 具体的な名称:</strong> {support.name}</p>
                    </div>
                  )}
                  
                  {support.frequency && (
                    <div className={styles.articleBody}>
                      <p><strong>6-{idx + 1}-2. 利用期間・回数:</strong></p>
                      {support.frequency.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  
                  {support.reason && (
                    <div className={styles.articleBody}>
                      <p><strong>6-{idx + 1}-3. 利用したきっかけ:</strong></p>
                      {support.reason.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  
                  {support.feeling && (
                    <div className={styles.articleBody}>
                      <p><strong>6-{idx + 1}-4. 利用した感想:</strong></p>
                      {support.feeling.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* セクション7: その他のサポートと今の想い */}
          {(displayData.otherSupport || displayData.currentThoughts) && (
            <section className={styles.bodySection}>
              <h3 className={styles.sectionHeading}>7. その他のサポートと今の想い</h3>
              <div className={styles.sectionDivider}></div>
              
              {displayData.otherSupport && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>7-1. その他のサポート・活動</h4>
                  <div className={styles.articleBody}>
                    {displayData.otherSupport.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {displayData.currentThoughts && (
                <div className={styles.subsection}>
                  <h4 className={styles.subsectionTitle}>7-2. 不登校に対する考え・想い</h4>
                  <div className={styles.articleBody}>
                    {displayData.currentThoughts.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          <section className={styles.relatedSection}>
            <h4 className={styles.relatedTitle}>
              {relatedContext ? (
                relatedContext.type === 'pickup' ? '最新の体験談' :
                relatedContext.type === 'question' ? `${relatedContext.sectionName}` :
                relatedContext.type === 'section' ? `${relatedContext.sectionName}` :
                relatedContext.type === 'search' ? '検索結果の体験談' :
                '関連記事'
              ) : '関連記事'}
            </h4>
            <div className={styles.relatedDivider}></div>
            {isLoadingRelated ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>関連記事を読み込み中...</p>
              </div>
            ) : relatedError ? (
              <div className={styles.errorContainer}>
                <p className={styles.errorText}>⚠️ {relatedError}</p>
                <p className={styles.errorSubText}>関連記事の取得中にエラーが発生しました。</p>
              </div>
            ) : noRelatedData ? (
              <div className={styles.noDataContainer}>
                <p className={styles.noDataText}>該当する関連記事がまだありません</p>
                <p className={styles.noDataSubText}>他の体験談を探してみてください。</p>
              </div>
            ) : (
              <div className={styles.relatedGrid}>
                {relatedExperiences.map((item, index) => (
                  <TweetCard 
                    key={item.id || index} 
                    data={item}
                    relatedContext={relatedContext}
                  />
                ))}
              </div>
            )}
          </section>

          <div className={styles.backToTopContainer}>
            <button 
              className={styles.backToTopButton}
              onClick={() => navigate('/experiences')}
            >
              体験談を探すTOPへ戻る
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default TweetDetailPage;
