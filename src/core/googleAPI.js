const handleCodeReceived = (code, handleSignInResult, clientId) => {
    try {
        console.log("Code received:", code);
        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('code', code);
        params.append('grant_type', 'authorization_code');
        params.append('redirect_uri', process.env.REACT_APP_HOSTNAME + "/callback");
        params.append('client_secret', process.env.REACT_APP_GAPI_CLIENT_SECRET);

        const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/token';
        fetch(oauth2Endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        }).then((response) => {
            console.log("Response:", response);
            response.json().then((data) => {
                handleSignInResult(data);
            });
        });
    } catch (error) {
        console.error("Error fetching token or user profile:", error);
    }
}

const fetchUserProfile = async (token, setProfile) => {
    fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Use access_token here
        },
    }).then((response) => {response.json().then((data) => {
        setProfile(data);
    })});
}

const signIn = async (clientId, handleSignInResult) => {
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = {
        'client_id': clientId,
        'redirect_uri': 'http://localhost:3000/callback',
        'response_type': 'code',
        'scope': 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.profile',
        'access_type': 'offline',
        'include_granted_scopes': 'true',
        'state': encodeURIComponent('shaky-shaky')
    };

    const urlParams = new URLSearchParams(params).toString();
    const oauthUrl = `${oauth2Endpoint}?${urlParams}`;

    const oauthWindow = window.open(oauthUrl, 'oauthWindow', 'width=600,height=700');

    const handleMessage = (event) => {
        if (event.origin === window.location.origin ) {
            if (!!event.data.code){
                const { code } = event.data;
                console.log("Received code:", event.data);
                oauthWindow.close();
                handleCodeReceived(code,handleSignInResult, clientId);
            }
            oauthWindow.close();
        }
    };


    // window.addEventListener('message', handleMessage, {once: true});
    window.addEventListener('message', handleMessage, );
}

const handleRefresh = (refreshToken, setToken, clientId) => {
    fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: clientId,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            client_secret: process.env.REACT_APP_GAPI_CLIENT_SECRET
        })
    }).then((response) => {response.json().then((data) => {
        const { id_token } = data;
        setToken(id_token);
        localStorage.setItem('oauth_token', id_token);
    })});
}


export { signIn, handleRefresh, fetchUserProfile };