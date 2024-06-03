import styles from './styles.module.scss';
import {useState} from "react";
import {useData} from "../core/RXdbProvider";
import {Navigate} from "react-router-dom";
import {useOAuth} from "../core/OAuthProvider";


//  <header className={styles['header']}>

const UserStatus = ({ connection }) => {
    // Define state for open/closed status
    const [isOpen, setIsOpen] = useState(false);
    const {syncStatus, } = useData();
    const {oauthSignOut, profile} = useOAuth();
    // Define function to toggle open/close status
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    // Render content based on open/closed status and connection status
    return (
        <div className={styles["user-status"]}>
            {/* Render user icon and synced status when closed */}
            {!isOpen && syncStatus === 'synced' && connection && (
                <div onClick={toggleOpen}>
                    {/* Render user icon here */}
                    <p>User Icon</p>
                    {/* Render synced status here */}
                    <p>Synced</p>
                </div>
            )}

            {/* Render user icon and syncing status when closed and connection is false */}
            {(
                <div onClick={toggleOpen}>
                    {/* Render user icon here */}
                    {/*<img className={styles["user-icon"]} href={profile}/>*/}
                    {/* Render syncing status here */}
                    <p>{syncStatus}</p>
                </div>
            )}


            {isOpen && (
                <div>
                    <p>{profile.name}</p>
                    <button onClick={()=>{
                        oauthSignOut();
                    }}>Log Out</button>
                </div>
            )}
        </div>
    );
};

export default UserStatus;
