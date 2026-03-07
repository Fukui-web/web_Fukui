import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout/Layout';
import { MainContent } from '../components/MainContent';

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "ぼくらのみち",
      "url": "https://bokuranomichi-fukui.com/",
      "description": "当事者たちによる当事者たちのための不登校情報サイト"
    },
    {
      "@type": "Organization",
      "name": "ぼくらのみち",
      "url": "https://bokuranomichi-fukui.com/",
      "logo": "https://bokuranomichi-fukui.com/title.png"
    }
  ]
};

const HomePage = () => {
  return (
    <Layout>
      <Helmet>
        <title>ぼくらのみち｜当事者たちでつくる、不登校情報サイト</title>
        <meta name="description" content="このサイトは当事者たちによる当事者たちのための本当に欲しい情報を集めたウェブサイトです。それぞれのご家庭に合った解決法を見つけるヒントとなるように、専門家のご意見と共に発信しています。" />
        <link rel="canonical" href="https://bokuranomichi-fukui.com/" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <MainContent />
    </Layout>
  );
};

export default HomePage;
