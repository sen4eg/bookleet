import styles from './styles.module.scss';

const Menu = () => {
    return (
        <nav>
            <ul>
                <li className={styles["menu-item"]}><a href="/">Home</a></li>
            </ul>
            <ul>
                <li className = {styles["menu-item"]} ><a href="/">Home</a></li>
            </ul>
            <ul>
                <li className = {styles["menu-item"]} ><a href="/">Home</a></li>
            </ul>
            <ul>
                <li className = {styles["menu-item"]} ><a href="/">Home</a></li>
            </ul>
            <ul>
                <li className = {styles["menu-item"]} ><a href="/">Home</a></li>
            </ul>
        </nav>
    );
};

export default Menu;