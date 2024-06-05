import styles from './styles.module.scss';
import {useState} from "react";
import {useData} from "../core/RXdbProvider";
import {useOAuth} from "../core/OAuthProvider";
import SyncIndicator from "./SyncIndicator";


//  <header className={styles['header']}>


const UserStatus = ({ connection }) => {
    // Define state for open/closed status
    const [isOpen, setIsOpen] = useState(false);
    const {syncStatus, } = useData();
    const {oauthSignOut, profile} = useOAuth();
    const [isOnline] = useState(navigator.onLine);
    // Define function to toggle open/close status
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    // Render content based on open/closed status and connection status
    return (
        <div className={styles["user-status"]} onClick={toggleOpen}>
            {/* Render user icon and synced status when closed */}
            {
                <img className={styles["user-icon"]} src={profile.picture} alt={"UserPic"}/>
            }

            {/* Render user icon and syncing status when closed and connection is false */}
            {(
                <SyncIndicator syncStatus={syncStatus} connected={isOnline}/>
                // <div>
                //     {/* Render user icon here */}
                //     {/*<img className={styles["user-icon"]} href={profile}/>*/}
                //     {/* Render syncing status here */}
                //     <p>{syncStatus}</p>
                // </div>
            )}


            {isOpen && (
                <>
                    <p>{profile.name}</p>
                    <button onClick={()=>{
                        oauthSignOut();
                    }}>Log Out</button>
                </>
            )}
        </div>
    );
};

export default UserStatus;
