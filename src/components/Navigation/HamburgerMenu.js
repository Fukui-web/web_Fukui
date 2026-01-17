import React, { useState, useEffect, useRef } from 'react';
// useNavigate は不要
import styles from './HamburgerMenu.module.css';
import NavigationItem from './NavigationItem';
import NavigationHeader from './NavigationHeader';
import NavigationBottom from './NavigationBottom'; // ★追加
import { navigationItems } from '../../data/navigationItems';
// searchItems, commonStyles は不要

const HamburgerMenu = ({ isOpen: externalIsOpen, onToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [lineHeight, setLineHeight] = useState(0);
  const navRef = useRef(null);
  const navItemsRef = useRef(null);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const toggleMenu = () => {
    const newState = !isOpen;
    if (onToggle) {
      onToggle(newState);
    } else {
      setInternalIsOpen(newState);
    }
    if (!isOpen) {
      setTimeout(() => {
        if (navItemsRef.current) {
          setLineHeight(navItemsRef.current.offsetHeight);
        }
      }, 350);
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
    if (isOpen && navRef.current && navItemsRef.current) {
      const calculateLineHeight = () => {
        const navItemsHeight = navItemsRef.current.offsetHeight;
        setLineHeight(navItemsHeight);
      };
      const timer = setTimeout(calculateLineHeight, 350);
      window.addEventListener('resize', calculateLineHeight);
      return () => {
        window.removeEventListener('resize', calculateLineHeight);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

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

      <nav ref={navRef} className={`${styles.navigation} ${isOpen ? styles.navigationActive : ''}`}>
        <NavigationHeader isHamburger={true} />
        
        <div ref={navItemsRef} className={styles.navItemsContainer}>
          <div className={styles.verticalLine} style={{ height: `${lineHeight}px` }} />
          
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