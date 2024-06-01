import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';

const OAuthCallback = () => {
    const location = useLocation();
    const [returnValue, setReturnValue] = useState("Processing...");

    useEffect(() => {
        const hash = location.hash.substring(1);
        console.log("HASH", hash);
        const params = new URLSearchParams(hash);
        const token = params.get('access_token');
        const scope = params.get('scope');
        const scopes = scope ? scope.split(' ') : [];

        if (token) {
            window.opener.postMessage({ token, scopes }, window.location.origin);
        }
        setReturnValue("You need to provide appdata scope access to google drive to use this app. This window will be closed automatically.");
        setTimeout(() => {
            window.close();
        }, 3000);
    }, [location]);

    return <div>{returnValue}</div>;
};

export default OAuthCallback;