import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';


// This component is used to handle the OAuth callback from Google
const OAuthCallback = () => {
    const location = useLocation();
    const [returnValue, setReturnValue] = useState("Processing...");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (code) {
            window.opener.postMessage({ code, state }, window.location.origin);
        }
        setReturnValue("You need to provide appdata scope access to google drive to use this app. This window will be closed automatically.");
        setTimeout(() => {
            // window.close();
        }, 3000);
    }, [location]);

    return <div>{returnValue}</div>;
};

export default OAuthCallback;