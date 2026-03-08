// src/components/common/Breadcrumbs/Breadcrumbs.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ sectionNumber, sectionTitle, items }) => {
  // itemsが渡された場合は汎用的なパンくずリスト
  if (items && items.length > 0) {
    // 構造化データ (JSON-LD) の生成
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": index === items.length - 1 
          ? undefined 
          : `https://bokuranomichi-fukui.com${item.path}`
      }))
    };

    return (
      <>
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>
        <nav className={styles.breadcrumbs}>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className={styles.separator}> &gt; </span>}
              {index === items.length - 1 ? (
                <span className={styles.current}>{item.label}</span>
              ) : (
                <Link to={item.path} className={styles.link}>{item.label}</Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </>
    );
  }

  // 従来のセクション番号とタイトルを使用するパターンの構造化データ
  const jsonLdTraditional = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "TOP",
        "item": "https://bokuranomichi-fukui.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${sectionNumber} ${sectionTitle}`
      }
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLdTraditional)}</script>
      </Helmet>
      <nav className={styles.breadcrumbs}>
        <Link to="/" className={styles.link}>TOP</Link>
        <span className={styles.separator}> &gt; </span>
        <span className={styles.current}>{sectionNumber} {sectionTitle}</span>
      </nav>
    </>
  );
};

export default Breadcrumbs;