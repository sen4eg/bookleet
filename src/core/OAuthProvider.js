import {createContext, useContext, useEffect, useState} from "react";


const OAuthContext = createContext({});

const OAuthProvider = ({children, clientId}) => {

    const [token, setToken] = useState(localStorage.getItem('oauth_token'));
    const [scopes, setScopes] = useState(localStorage.getItem('oauth_scopes')?.split(' ') || []);
    const [credentials, setCredentials] = useState(null); // Store additional credentials if needed

    useEffect(() => {
        const storedToken = localStorage.getItem('oauth_token');
        const storedScopes = localStorage.getItem('oauth_scopes')?.split(' ') || [];
        if (storedToken) {
            setToken(storedToken);
            setScopes(storedScopes);
        }
    }, []);


    const oauthSignIn = () => {
        const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
        const params = {
            'client_id': clientId,
            'redirect_uri': 'http://localhost:3000/callback',
            'response_type': 'token',
            'scope': 'https://www.googleapis.com/auth/drive.appdata',
            'include_granted_scopes': 'true',
            'state': encodeURIComponent('pass-through value')
        };

        const urlParams = new URLSearchParams(params).toString();
        const oauthUrl = `${oauth2Endpoint}?${urlParams}`;

        const oauthWindow = window.open(oauthUrl, 'oauthWindow', 'width=600,height=700');

        const handleMessage = (event) => {

            if (event.origin === window.location.origin && !!event.data.token) {
                const { token, scopes } = event.data;
                setToken(token);
                setScopes(scopes);
                localStorage.setItem('oauth_token', token);
                localStorage.setItem('oauth_scopes', scopes.join(' '));
                oauthWindow.close();
            }
        };

        window.addEventListener('message', handleMessage, { once: true });
    };
    const oauthSignOut = () => {
        setToken(null);
        setScopes([]);
        setCredentials(null);
        localStorage.removeItem('oauth_token');
        localStorage.removeItem('oauth_scopes');
    };
    const isAuthenticated = !!token;

    return (
        <OAuthContext.Provider value={{token, scopes, credentials, isAuthenticated, oauthSignIn, oauthSignOut}}>
            {children}
        </OAuthContext.Provider>
    );
}

const useOAuth = () => {
    const context = useContext(OAuthContext);
    if (!context) {
        throw new Error('useOAuth must be used within an OAuthProvider');
    }
    return context;
}

export {OAuthProvider, useOAuth};