import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGoogleOAuth } from '@react-oauth/google'; // Assuming you have a hook to check authentication status

const PrivateScope = ({ children }) => {
    const { isAuthenticated } = useGoogleOAuth(); // Example hook to check if user is authenticated

    return (
        <div>
            {!isAuthenticated && <Navigate to="/login" />}
            {children}
        </div>
    );
};

export default PrivateScope;