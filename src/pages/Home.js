

import {Navigate} from "react-router-dom";
import Login from "./Login";
import {useOAuth} from "../core/OAuthProvider";


const Home = () => {
    const {oauthSignOut} = useOAuth();
    function handleLogout() {
        oauthSignOut();
        return <Navigate to={<Login/>}/>
    }

    return (
    <>
      <h2>Home</h2>
      <p>Welcome to our website!</p>
        <button onClick={handleLogout}>Logout?</button>
    </>
  );
}

export default Home;
