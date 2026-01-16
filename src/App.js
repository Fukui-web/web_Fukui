import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage/AdminPage';
import AdminExperienceDetail from './pages/AdminPage/AdminExperienceDetail';
import Layout from './components/Layout/Layout';
import { navigationItems } from './data/navigationItems';
import ScrollToTop from './components/ScrollToTop';
import ExperiencesContent, { PostExperienceContent } from './components/MainContent/experiences';
import ExperiencesSearchResultsContent from './components/MainContent/experiences/ExperiencesSearchResultsContent';
import PlacesContent from './components/MainContent/places';
import PathsContent from './components/MainContent/paths';
import TweetDetailPage from './pages/TweetDetailPage/TweetDetailPage';
import PlaceSearchResults from './pages/PlaceSearchResults/PlaceSearchResults';
import PlaceDetailPage from './pages/PlaceDetailPage/PlaceDetailPage';
import PlaceReviewPage from './pages/PlaceReviewPage/PlaceReviewPage';
import ReviewsPage from './pages/ReviewsPage/ReviewsPage';
import ReviewDetailPage from './pages/ReviewDetailPage/ReviewDetailPage';
import InterviewDetailPage from './pages/InterviewDetailPage/InterviewDetailPage';

function App() {
  return (
    <Router basename="/web_Fukui">
      <ScrollToTop />
      <Routes>
        {/* ホーム画面用のルート */}
        <Route path="/" element={<HomePage />} />

        {/* 管理者画面ページ */}
        <Route path="/admin" element={
          <Layout>
            <AdminPage />
          </Layout>
        } />

            {/* 管理者用体験談詳細ページ */}
            <Route path="/admin/experience/:id" element={
              <Layout>
                <AdminExperienceDetail />
              </Layout>
            } />

            {/* 体験談を探すページ */}
            <Route path="/experiences" element={
              <Layout>
                <ExperiencesContent />
              </Layout>
            } />

            {/* 体験談検索結果ページ */}
            <Route path="/experiences/search" element={
              <Layout>
                <ExperiencesSearchResultsContent />
              </Layout>
            } />

            {/* 体験談を投稿するページ */}
            <Route path="/experiences/post" element={
              <Layout>
                <PostExperienceContent />
              </Layout>
            } />

            {/* 体験談詳細ページ */}
            <Route path="/experiences/:id" element={
              <Layout>
                <TweetDetailPage />
              </Layout>
            } />

            {/* 居場所を探すページ */}
            <Route path="/places" element={
              <Layout>
                <PlacesContent />
              </Layout>
            } />

            {/* 居場所の検索結果と詳細ページ */}
            <Route path="/places/search" element={
              <Layout>
                <PlaceSearchResults />
              </Layout>
            } />
            
            <Route path="/places/:id" element={
              <Layout>
                <PlaceDetailPage />
              </Layout>
            } />
            
            <Route path="/places/:id/reviews" element={
              <Layout>
                <PlaceReviewPage />
              </Layout>
            } />

            {/* 口コミ一覧ページと詳細ページ */}
            <Route path="/reviews" element={
              <Layout>
                <ReviewsPage />
              </Layout>
            } />
            
            <Route path="/reviews/:id" element={
              <Layout>
                <ReviewDetailPage />
              </Layout>
            } />

            {/* インタビュー詳細ページ */}
            <Route path="/interviews/:id" element={
              <Layout>
                <InterviewDetailPage />
              </Layout>
            } />

            {/* 卒業後の進路を探すページ */}
            <Route path="/paths" element={
              <Layout>
                <PathsContent />
              </Layout>
            } />

            {/* ナビゲーション項目から動的にルートを生成 */}
            {navigationItems.map((item, index) => {
              // コンポーネントとパスが存在しない項目はスキップ
              if (!item.component || !item.path) {
                return null;
              }
              
              const PageComponent = item.component;
              
              return (
                <Route 
                  key={index}
                  path={item.path} 
                  element={
                    // 各ページを Layout でラップして表示
                    <Layout>
                      <PageComponent />
                    </Layout>
                  } 
                />
              );
            })}
          </Routes>
        </Router>
  );
}

export default App;