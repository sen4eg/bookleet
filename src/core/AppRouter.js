import React from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import Login from "../pages/Login";
import {GoogleOAuthProvider} from "@react-oauth/google";
import PrivateScope from "./PrivateScope";
const clientId = "672173527232-mqr1epni0snc6andsse9t9fhtnunsckg.apps.googleusercontent.com";

const AppRouter = () => {
  return (
    <Router>
        {/*<GoogleOAuthProvider clientId={clientId}>*/}
          <Routes>
            <Route exact path="/" component={Home} />
            {/*<Route path="/login" component={Login}></Route>*/}
              {/*<Route path="/" element={*/}
              {/*    <PrivateScope>*/}
              {/*      <Home />*/}
              {/*    </PrivateScope>*/}
              {/*} />*/}

          </Routes>

        {/*</GoogleOAuthProvider>*/}
    </Router>
  );
}

export default AppRouter;