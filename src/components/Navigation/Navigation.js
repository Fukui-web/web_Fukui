import React from 'react';
import styles from '../../styles/Main.module.css';
import commonStyles from './NavigationCommon.module.css';
import NavigationHeader from './NavigationHeader';
import NavigationItem from './NavigationItem';
import NavigationBottom from './NavigationBottom';
import { navigationItems } from '../../data/navigationItems';

const Navigation = () => {
  return (
    <div className={`${styles.navigation} ${commonStyles.navPanel}`}>
      <NavigationHeader isHamburger={false} />

      <div className={commonStyles.navItemsContainer}>
        <div className={commonStyles.verticalLine} />
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

      <NavigationBottom />
    </div>
  );
};

export default Navigation;