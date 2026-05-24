import React, { useContext, useEffect, useState } from "react";

import axios from "axios";

import { useLocation, useNavigate } from "react-router-dom";

import Nav from "../Pages/Nav";
import defaultPP from "../assets/defaultProfile.jpg";

import { authDataContext } from "../Context/AuthContext";

function SearchResults() {

    const location = useLocation();

    const navigate = useNavigate();

    const { serverUrl } =
        useContext(authDataContext);

    const [users, setUsers] = useState([]);

    const keyword =
        new URLSearchParams(location.search)
            .get("keyword");

    // SEARCH USERS
    const searchUsers = async () => {

        try {

            const res = await axios.get(
                `${serverUrl}/api/user/search?keyword=${keyword}`,
                { withCredentials: true }
            );

            setUsers(res.data);

        } catch (error) {

            console.log(error);

        }
    };

    useEffect(() => {

        if (keyword) {
            searchUsers();
        }

    }, [keyword]);

    return (

        <div className="w-full min-h-screen bg-[#F4F2EE]">

            <Nav />

            <div className="pt-[90px] px-5 lg:px-40">

                <h1 className="text-2xl font-bold mb-5">

                    Search Results for "{keyword}"

                </h1>

                <div className="flex flex-col gap-4">

                    {
                        users.length === 0
                            ? (
                                <div className="bg-white p-6 rounded-xl shadow-md">

                                    No users found

                                </div>
                            )
                            : (
                                users.map((user) => (

                                    <div
                                        key={user._id}
                                        onClick={() =>
                                            navigate(`/profile/${user._id}`)
                                        }
                                        className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4 cursor-pointer hover:bg-gray-50"
                                    >

                                        <img
                                            src={user.profileImage || defaultPP}
                                            alt=""
                                            className="w-16 h-16 rounded-full object-cover"
                                        />

                                        <div>

                                            <h1 className="text-lg font-semibold">

                                                {user.firstName} {user.lastName}

                                            </h1>

                                            <p className="text-gray-600">

                                                {user.headline}

                                            </p>

                                        </div>

                                    </div>

                                ))
                            )
                    }

                </div>

            </div>

        </div>
    );
}

export default SearchResults;