import React from 'react';
import { Navigate } from 'react-router-dom';
import {useOAuth} from "./OAuthProvider";

const PrivateScope = ({ children }) => {
    const { isAuthenticated } = useOAuth();
    return (
        <div>
            {!isAuthenticated && <Navigate to="/login" />}
            {children}
        </div>
    );
};

export default PrivateScope;