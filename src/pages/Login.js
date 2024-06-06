import {Navigate} from "react-router-dom";
import {useOAuth} from "../core/OAuthProvider";
import {useEffect, useState} from "react";



const Login = () => {

    const {auth_complete, oauthSignIn, isAuthenticated} = useOAuth();
    const [redirect, setRedirect] = useState(auth_complete && isAuthenticated);
    useEffect(() => {
        if (auth_complete && isAuthenticated) {
            setRedirect(true);
        }

    }, [auth_complete, isAuthenticated]);

    return (
        <>
        {redirect && (<Navigate to="/"></Navigate>)}
        <div>
            <h3>To use our website please:</h3>
            <button onClick={oauthSignIn}>Login with Google</button>


        </div>
        </>
    );
};

export default Login;
