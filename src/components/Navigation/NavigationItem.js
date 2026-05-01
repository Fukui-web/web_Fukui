import React from 'react';
import { useNavigate } from 'react-router-dom';
import commonStyles from './NavigationCommon.module.css';
import NavIcon from '../../assets/icons/NavIcon';

/**
 * 共通NavigationItemコンポーネント
 * * @param {string} title - タイトル
 * @param {Array} subItems - サブ項目
 * @param {number} index - インデックス
 * @param {boolean} isHamburger - ハンバーガーメニューか
 * @param {string} path - (追加) 遷移先のパス
 */
const NavigationItem = ({ title, subItems = [], index, isHamburger = false, path }) => {
  const navigate = useNavigate();

  // subItemsがオブジェクト形式（パス付き）かどうかで挙動を分岐
  const hasSubPaths = subItems.length > 0 && typeof subItems[0] === 'object';

  // タイトルの処理（ハンバーガーメニューでは改行なし、通常ナビでは改行あり）
  const formattedTitle = title
    .replace(/\\n/g, '\n')
    .split('\n')
    .map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));

  // 全体クリック（文字列subItems / 03以外）
  const handleItemClick = () => {
    if (!hasSubPaths && path) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // タイトルクリック（オブジェクトsubItems / 03）
  const handleTitleClick = (e) => {
    e.stopPropagation();
    if (path) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // サブアイテムクリック（オブジェクトsubItems / 03）
  const handleSubItemClick = (e, subItem) => {
    e.stopPropagation();
    const subPath = typeof subItem === 'object' ? subItem.path : null;
    const targetPath = subPath || path;
    if (targetPath) {
      const [pagePath, hash] = targetPath.split('#');
      navigate(targetPath);
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className={`${commonStyles.navItem} ${!hasSubPaths ? commonStyles.navItemClickable : ''}`}
      onClick={handleItemClick}
    >
      <div
        className={`${commonStyles.navItemHeader} ${hasSubPaths ? commonStyles.navItemHeaderClickable : ''}`}
        onClick={hasSubPaths ? handleTitleClick : undefined}
      >
        <div className={commonStyles.navIcon}>
          <NavIcon index={index} />
        </div>
        <div className={commonStyles.navTitle}>{formattedTitle}</div>
      </div>
      {subItems.length > 0 && (
        <div className={commonStyles.navSubItems}>
          {subItems.map((item, idx) => (
            <div
              key={idx}
              className={`${commonStyles.navSubItem} ${hasSubPaths ? commonStyles.navSubItemClickable : ''}`}
              onClick={hasSubPaths ? (e) => handleSubItemClick(e, item) : undefined}
            >
              {typeof item === 'object' ? item.label : item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavigationItem;