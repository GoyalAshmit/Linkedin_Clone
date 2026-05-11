import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import Login from './Components/Login'
import Signup from './Components/Signup'
import { useContext } from 'react'
import { userDataContext } from './Context/UserContext'
import Profile from "./Components/Profile";
import SearchResults from "./Components/SearchResults";

function App() {
    let {userData} = useContext(userDataContext);
  return (
    <Routes>
        <Route path='/' element={ userData?<Home />:<Navigate to="/login" />} />
        <Route path='/login' element={userData?<Navigate to="/" />:<Login />} />
        <Route path='/signup' element= {userData?<Navigate to="/" />:<Signup />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/search" element={<SearchResults />} />
    </Routes>
  )
}

export default App
