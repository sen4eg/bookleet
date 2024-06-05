import {Navigate} from "react-router-dom";
import {useOAuth} from "../core/OAuthProvider";



const Login = () => {

    const {isAuthenticated, oauthSignIn} = useOAuth();

    console.log("isAuthenticated", isAuthenticated);

    return (
        <>
        {isAuthenticated && (<Navigate to="/"></Navigate>)}
        <div>
            <h3>To use our website please:</h3>
            <button onClick={oauthSignIn}>Login with Google</button>


        </div>
        </>
    );
};

export default Login;
