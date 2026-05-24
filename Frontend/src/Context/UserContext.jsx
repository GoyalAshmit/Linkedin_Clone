import React, { useContext, createContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()

function UserContext({ children }) {

    let [userData, setUserData] = useState(null)
    let [loading, setLoading] = useState(true)

    let { serverUrl } =
        useContext(authDataContext)

    let [edit, setEdit] = useState(false)

    let [posts, setPosts] = useState([])

    // GET CURRENT USER
    let getCurrentUser = async () => {

        try {

            let result = await axios.get(
                serverUrl + "/api/user/currentuser",
                { withCredentials: true }
            )

            setUserData(result.data)

        } catch (error) {

            console.log(error)

            setUserData(null)
        } finally {
            setLoading(false)
        }
    }

    // GET POSTS
    let getPost = async () => {

        try {

            let result = await axios.get(
                serverUrl + "/api/post/getpost",
                { withCredentials: true }
            )

            setPosts(result.data)

        } catch (error) {

            console.log(error)
        }
    }

    // REFRESH USER DATA
    let refreshUser = async () => {
        await getCurrentUser()
    }

    useEffect(() => {

        getCurrentUser()
        getPost()

    }, [])

    let value = {

        userData,
        setUserData,
        loading,

        edit,
        setEdit,

        posts,
        getPost,

        refreshUser
    }

    return (

        <userDataContext.Provider value={value}>

            {children}

        </userDataContext.Provider>
    )
}

export default UserContext