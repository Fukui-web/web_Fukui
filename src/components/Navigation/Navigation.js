import React from 'react';
// useNavigate は不要になったため削除
import styles from '../../styles/Main.module.css';
import NavigationHeader from './NavigationHeader';
import NavigationItem from './NavigationItem';
import NavigationBottom from './NavigationBottom'; // ★追加
import { navigationItems } from '../../data/navigationItems';
// searchItems, commonStyles は NavigationBottom 内で使うのでここでは不要

const Navigation = () => {
  // ナビゲーション項目以外のロジックは NavigationBottom に移動しました

  return (
    <div className={styles.navigation}>
      {/* ナビゲーションヘッダー */}
      <NavigationHeader isHamburger={false} />
      
      {/* ナビゲーション項目 */}
      <div className={styles.navItemsContainer}>
        {navigationItems.map((item, index) => (
          <NavigationItem 
            key={index} 
            title={item.title} 
            subItems={item.subItems} 
            index={index}
            path={item.path} 
          />
        ))}
      </div>

      {/* ★共通コンポーネント: 探してみよう / プロジェクト / 寄付 */}
      <NavigationBottom />
    </div>
  );
};

export default Navigation;