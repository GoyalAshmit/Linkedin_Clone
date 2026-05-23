import React, { useContext } from "react";

import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Profile from "./Components/Profile";
import SearchResults from "./Components/SearchResults";
import Jobs from "./Pages/Jobs";

import MyNetwork from "./Pages/MyNetwork";

import { userDataContext } from "./Context/UserContext";

function App() {

    let { userData } =
        useContext(userDataContext);

    return (

        <Routes>

            {/* HOME */}
            <Route
                path="/"
                element={
                    userData
                        ? <Home />
                        : <Navigate to="/login" />
                }
            />

            {/* LOGIN */}
            <Route
                path="/login"
                element={
                    userData
                        ? <Navigate to="/" />
                        : <Login />
                }
            />

            {/* SIGNUP */}
            <Route
                path="/signup"
                element={
                    userData
                        ? <Navigate to="/" />
                        : <Signup />
                }
            />

            {/* PROFILE */}
            <Route
                path="/profile/:id"
                element={
                    userData
                        ? <Profile />
                        : <Navigate to="/login" />
                }
            />

            {/* SEARCH */}
            <Route
                path="/search"
                element={
                    userData
                        ? <SearchResults />
                        : <Navigate to="/login" />
                }
            />

            {/* MY NETWORK */}
            <Route
                path="/mynetwork"
                element={
                    userData
                        ? <MyNetwork />
                        : <Navigate to="/login" />
                }
            />
            <Route
                path="/jobs"
                element={
                    userData
                        ? <Jobs />
                        : <Navigate to="/login" />
                }
            />

        </Routes>
    );
}

export default App;