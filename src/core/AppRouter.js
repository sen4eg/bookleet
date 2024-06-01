import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from "../pages/Login";
import PrivateScope from "./PrivateScope";
import {OAuthProvider} from "./OAuthProvider";
import Callback from "../pages/Callback";
import {RxDBProvider} from "./RXdbProvider";
const clientId = "672173527232-mqr1epni0snc6andsse9t9fhtnunsckg.apps.googleusercontent.com";

const AppRouter = () => {
  return (
    <Router>
        <OAuthProvider clientId={clientId}>
        <RxDBProvider>

          <Routes>
            {/*<Route exact path="/" element={<Home/>} />*/}
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/callback" element={<Callback/>}></Route>
              <Route path="/" element={
                  <PrivateScope>
                    <Home />
                  </PrivateScope>
              } />
              <Route exact path="/" element={
                  <PrivateScope>
                    <Home />
                  </PrivateScope>
              } />

          </Routes>

        </RxDBProvider>
        </OAuthProvider>
    </Router>
  );
}

export default AppRouter;