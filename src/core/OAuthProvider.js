import { createContext, useContext, useEffect, useState } from "react";
import {signIn, handleRefresh, fetchUserProfile} from "./googleAPI";
import {debugLog} from "./utils";

const OAuthContext = createContext({});

const OAuthProvider = ({ children }) => {
    const clientId = process.env.REACT_APP_GAPI_CLIENT_ID;
    const [token, setToken] = useState(localStorage.getItem('oauth_token'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('oauth_refresh_token'));
    const [profile, setProfile] = useState(null);
    const [auth_complete, setAuthComplete] = useState(false);



    const handleSignInResult = (data) => {
        if (!data) {
            console.error("No token data received");
            return;
        }
        const { access_token, refresh_token } = data;
        if (!access_token || !refresh_token) {
            console.error("No access or refresh token received");
            return;
        }
        setToken(access_token);
        setRefreshToken(refresh_token);
        localStorage.setItem('oauth_token', access_token);
        localStorage.setItem('oauth_refresh_token', refresh_token);

        fetchUserProfile(access_token, setProfile).then( () => {
            setAuthComplete(true);
        })
    }

    const handleOAuthSignIn = async () => {
        await signIn(clientId, handleSignInResult);
    };

    const refreshAuthToken = async () => {
        setAuthComplete(false);
        debugLog("Refreshing token");
        if (!refreshToken) {
            console.error("No refresh token available");
            oauthSignOut();
            return;
        }

        try {
            handleRefresh(refreshToken, setToken, clientId, setAuthComplete);

        } catch (error) {
            console.error("Error refreshing token:", error);
            oauthSignOut();
        }
    };

    const oauthSignOut = () => {
        setToken(null);
        setRefreshToken(null);
        setProfile(null);
        localStorage.removeItem('oauth_token');
        localStorage.removeItem('oauth_refresh_token');
        localStorage.removeItem('oauth_scopes');
        setAuthComplete(false);
    };

    useEffect(() => {
        if (auth_complete) return;

        refreshAuthToken().then(

        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // For current stage of development it's good enough to use such one-time effect, more convenient way is to use refs as in syncing in case of rxdb provider

    useEffect(() => {
        if (!auth_complete || !!profile) return;
        fetchUserProfile(token, setProfile).then(
            () => debugLog("Profile fetched successfully"),
            (error) => console.error("Error fetching profile:", error)
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth_complete]);

    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnlineStatusChange = (status) => {
            setIsOnline(status.type === 'online');
        }

        window.addEventListener('online', handleOnlineStatusChange);
        window.addEventListener('offline', handleOnlineStatusChange);

        return () => {
            window.removeEventListener('online', handleOnlineStatusChange);
            window.removeEventListener('offline', handleOnlineStatusChange);
        };
    }, []);


    return (
        <OAuthContext.Provider value={{ token, refreshToken, isAuthenticated:!!token, oauthSignIn: handleOAuthSignIn, oauthSignOut, clientId, profile, auth_complete, isOnline }}>
            {(isOnline || profile)?children:<h1>This page is network dependant</h1>}
        </OAuthContext.Provider>
    );
};

const useOAuth = () => {
    const context = useContext(OAuthContext);
    if (!context) {
        throw new Error('useOAuth must be used within an OAuthProvider');
    }
    return context;
};

export { OAuthProvider, useOAuth };
