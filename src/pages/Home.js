

import {Navigate} from "react-router-dom";
import Login from "./Login";
import {useOAuth} from "../core/OAuthProvider";
import PageLayout from "../components/PageLayout";


const Home = () => {
    return (
    <PageLayout pageTitle={"Home page"} mainContent={
        <div>
            <p>This is the home page</p>
        </div>
    }/>
  );
}

export default Home;
