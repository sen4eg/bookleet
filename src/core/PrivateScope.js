import React from 'react';
import { Navigate } from 'react-router-dom';
import {useOAuth} from "./OAuthProvider";

const PrivateScope = ({ children }) => {
    const { auth_complete, refreshToken } = useOAuth();
    console.log("isAuthenticated", auth_complete);
    return (
        <div>
            {!(auth_complete || !!refreshToken) && <Navigate to="/login" />}
            {children}
        </div>
    );
};

export default PrivateScope;