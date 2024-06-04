import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from "../pages/Login";
import PrivateScope from "./PrivateScope";
import {OAuthProvider} from "./OAuthProvider";
import Callback from "../pages/Callback";
import {RxDBProvider} from "./RXdbProvider";
import Video from "../pages/Video";
import Books from "../pages/Books";

const AppRouter = () => {
  return (
    <Router>
        <OAuthProvider>
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
            <Route exact path="/video" element={
              <PrivateScope>
                  <Video />
              </PrivateScope>
            } />
            <Route exact path="/books" element={
              <PrivateScope>
                  <Books />
              </PrivateScope>
            } />

          </Routes>

        </RxDBProvider>
        </OAuthProvider>
    </Router>
  );
}

export default AppRouter;