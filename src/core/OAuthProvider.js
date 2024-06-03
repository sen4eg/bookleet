import { createContext, useContext, useEffect, useState } from "react";
import {signIn, handleRefresh, fetchUserProfile} from "./googleAPI";

const OAuthContext = createContext({});

const OAuthProvider = ({ children, clientId }) => {
    const [token, setToken] = useState(localStorage.getItem('oauth_token'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('oauth_refresh_token'));
    const [scopes, setScopes] = useState(localStorage.getItem('oauth_scopes')?.split(' ') || []);
    const [profile, setProfile] = useState({ email: "user" });

    useEffect(() => {
        refreshAuthToken().then(()=>
            fetchUserProfile(token, setProfile).then()
        );
    }, []);

    const handleSignInResult = (data) => {
        console.log("Token data:", data);
        const { access_token, refresh_token, scope } = data;
        setToken(access_token);
        setRefreshToken(refresh_token);
        setScopes(scope.split(' '));
        localStorage.setItem('oauth_token', access_token);
        localStorage.setItem('oauth_refresh_token', refresh_token);
        localStorage.setItem('oauth_scopes', scope);
    }

    const handleOAuthSignIn = async () => {
        await signIn(clientId, handleSignInResult);
    };

    const refreshAuthToken = async () => {
        if (!refreshToken) {
            console.error("No refresh token available");
            oauthSignOut();
            return;
        }

        try {
            handleRefresh(refreshToken, setToken, clientId);

        } catch (error) {
            console.error("Error refreshing token:", error);
            oauthSignOut();
        }
    };

    const oauthSignOut = () => {
        setToken(null);
        setRefreshToken(null);
        setScopes([]);
        setProfile({ email: "user" });
        localStorage.removeItem('oauth_token');
        localStorage.removeItem('oauth_refresh_token');
        localStorage.removeItem('oauth_scopes');
    };

    const isAuthenticated = !!token;

    return (
        <OAuthContext.Provider value={{ token, refreshToken, scopes, isAuthenticated, oauthSignIn: handleOAuthSignIn, oauthSignOut, clientId, profile }}>
            {children}
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
