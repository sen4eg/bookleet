import React, {useContext, useEffect, useState} from 'react';
import Menu from './Menu';
import UserStatus from './UserStatus';
import styles from './styles.module.scss';
import openSoundFile from '../resources/open.mp3';
import closeSoundFile from '../resources/close.mp3';
import {useMenu} from '../core/MenuProvider';

const PageLayout = ({ pageTitle, mainContent }) => {
    const {isMenuOpen, toggleMenu} = useMenu();

    const handleMenuToggle = () => {
        toggleMenu();
        const openSound = new Audio(openSoundFile);
        const closeSound = new Audio(closeSoundFile);
        openSound.volume = 0.17;
        closeSound.volume = 0.17;
        if (isMenuOpen) {
            openSound.play().catch((error) => {
                console.error('Error playing sound:', error);
            });
        } else {
            closeSound.play().catch((error) => {
                console.error('Error playing sound:', error);
            });
        }

        // Clean up the audio instances when the component is unmounted
        return () => {
            openSound.pause();
            closeSound.pause();
        };
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isMenuOpen && !event.target.closest(`.${styles['menu-container']}`)) {
                toggleMenu();
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);


    return (
        <div className={styles['page-layout']}>

            <div className={`${styles['menu-container']} ${isMenuOpen ? styles['open'] : ''}`}>
                <button className={`${styles['menu-toggle']}`}
                        onClick={handleMenuToggle}>
                    {isMenuOpen ? 'Close' : 'Open'} Menu
                </button>
                <Menu/>
            </div>
            <div className={styles['content-container']}>
                <header className={`${styles['header']} ${isMenuOpen ? styles['open'] : ''}`}>
                    <h1>{pageTitle}</h1>
                    <div>
                        <UserStatus/>
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
