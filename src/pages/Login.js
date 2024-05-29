import React, { useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {

    const handleSuccess = async (response) => {
        console.log('Login Success:', response);
        const token = response.credential;

        // Fetch files from the app data folder
        // try {
        //     const res = await axios.get('https://www.googleapis.com/drive/v3/files', {
        //         headers: {
        //             'Authorization': `Bearer ${token}`
        //         },
        //         params: {
        //             spaces: 'appDataFolder'
        //         }
        //     });
        // } catch (error) {
        //     console.error('Error fetching files:', error);
        // }
    };

    const handleError = () => {
        console.log('Login Failed');
    };

    const handleLogout = () => {
        googleLogout();
        console.log('Logged out');
    };

    return (
        <div>
            <h2>Login with Google</h2>
            {/*<GoogleLogin*/}
            {/*    onSuccess={handleSuccess}*/}
            {/*    onError={handleError}*/}
            {/*    useOneTap*/}
            {/*    scope="https://www.googleapis.com/auth/drive.appdata"*/}
            {/*/>*/}
            <button onClick={handleLogout}>Logout</button>

        </div>
    );
};

export default Login;
