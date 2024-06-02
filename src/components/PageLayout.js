import React, { useState } from 'react';
import Menu from './Menu';
import UserStatus from './UserStatus';
import styles from './styles.sass';

const PageLayout = ({ pageTitle, mainContent }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className={styles.pageLayout}>
            <div className={`${styles.menuContainer} ${isMenuOpen ? styles.open : ''}`}>
                <Menu />
            </div>
            <div className={styles.contentContainer}>
                <header className={styles.header}>
                    <button className={styles.menuToggle} onClick={toggleMenu}>
                        {isMenuOpen ? 'Close' : 'Open'} Menu
                    </button>
                    <div className={styles.userStatus}>
                        <UserStatus />
                    </div>
                    <h1>{pageTitle}</h1>
                </header>
                <main className={styles.mainContent}>
                    {mainContent}
                </main>
                <footer className={styles.footer}>
                    <p>Footer content</p>
                </footer>
            </div>
        </div>
    );
};

export default PageLayout;