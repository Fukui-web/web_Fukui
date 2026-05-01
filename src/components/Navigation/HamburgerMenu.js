import React, { useState, useEffect, useRef } from 'react';
import styles from './HamburgerMenu.module.css';
import commonStyles from './NavigationCommon.module.css';
import NavigationItem from './NavigationItem';
import NavigationHeader from './NavigationHeader';
import NavigationBottom from './NavigationBottom';
import { navigationItems } from '../../data/navigationItems';

const HamburgerMenu = ({ isOpen: externalIsOpen, onToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const toggleMenu = () => {
    const newState = !isOpen;
    if (onToggle) {
      onToggle(newState);
    } else {
      setInternalIsOpen(newState);
    }
  };
  
  // ★メニューを閉じる処理（NavigationBottomに渡すコールバック）
  const handleCloseMenu = () => {
    if (onToggle) {
      onToggle(false);
    } else {
      setInternalIsOpen(false);
    }
  };
  
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setInternalIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);
  
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        handleCloseMenu();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // メニューが開いたときに背景のスクロールを防止
  useEffect(() => {
    if (isOpen) {
      // 現在のスクロール位置を保存
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // メニューを閉じたときにスクロール位置を復元
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [isOpen]);

  return (
    <>
      <div className={styles.hamburgerMenu} onClick={toggleMenu}>
        <span className={styles.menuText}>{isOpen ? 'CLOSE' : 'MENU'}</span>
        <div className={styles.menuIconContainer}>
          {isOpen ? (
            <span className={styles.closeIconText}>×</span>
          ) : (
            <>
              <div className={styles.menuIcon}></div>
              <div className={styles.menuIcon}></div>
              <div className={styles.menuIcon}></div>
            </>
          )}
        </div>
      </div>

      <nav className={`${styles.navigation} ${commonStyles.navPanel} ${isOpen ? styles.navigationActive : ''}`}>
        <NavigationHeader isHamburger={true} />

        <div className={commonStyles.navItemsContainer}>
          <div className={commonStyles.verticalLine} />
          
          {navigationItems.map((item, index) => (
            <NavigationItem
              key={index}
              title={item.title}
              subItems={item.subItems}
              index={index}
              isHamburger={true}
              path={item.path} 
            />
          ))}
        </div>

        {/* ★共通コンポーネント: 完了時にメニューを閉じる処理を渡す */}
        <NavigationBottom onActionCompleted={handleCloseMenu} />
        
      </nav>
    </>
  );
};

export default HamburgerMenu;