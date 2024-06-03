import React, { useState } from 'react';
import Menu from './Menu';
import UserStatus from './UserStatus';
import styles from './styles.module.scss';

const PageLayout = ({ pageTitle, mainContent }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className={styles['page-layout']}>
            <div className={`${styles['menu-container']} ${isMenuOpen ? styles['open'] : ''}`}>
                <Menu />
            </div>
            <div className={styles['content-container']}>
                <header className={styles['header']}>
                    <button className={styles['menu-toggle']} onClick={toggleMenu}>
                        {isMenuOpen ? 'Close' : 'Open'} Menu
                    </button>
                    <h1>{pageTitle}</h1>
                    <div>
                        <UserStatus />
                    </div>
                </header>
                <main className={styles['main-content']}>
                    {mainContent}
                </main>
                <footer className={styles['footer']}>
                    <span>
                        &copy; Ars
                    </span>
                </footer>
            </div>
        </div>
    );
};

export default PageLayout;
