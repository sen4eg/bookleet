import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

const Menu = () => {

    const menuItems = [ { text: "Home", link: "/" }, { text: "My Books", link: "/books" }, { text: "Motivation", link: "/video" } ];

    const currentLocation = window.location.pathname;
    const makeMenuItem = (listItem) => {
        return (
            <ul key={listItem.link.slice(1) + "key"}>
            <li className={`${styles["menu-item"]} ${styles[currentLocation === listItem.link ? "current" : ""]}`}>
                <Link to={listItem.link}>{listItem.text}</Link>
            </li>
            </ul>
        );
    }


    return (
        <nav className={styles["menuContainer"]}>
            {menuItems.map(makeMenuItem)}
        </nav>
    );
};

export default Menu;
