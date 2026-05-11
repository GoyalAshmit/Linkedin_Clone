import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Nav from "../Pages/Nav";

import { authDataContext } from "../Context/AuthContext";

function Profile() {

    const { id } = useParams();

    const { serverUrl } =
        useContext(authDataContext);

    const [user, setUser] = useState(null);

    const [loading, setLoading] =
        useState(true);

    // GET USER
    const getUser = async () => {

        try {

            let res = await axios.get(
                `${serverUrl}/api/user/profile/${id}`,
                { withCredentials: true }
            );

            setUser(res.data);

            setLoading(false);

        } catch (error) {

            console.log(error);

            setLoading(false);
        }
    };

    useEffect(() => {

        getUser();

    }, [id]);

    if (loading) {

        return (
            <div className="w-full h-screen flex items-center justify-center text-2xl font-semibold">
                Loading...
            </div>
        );
    }

    return (

        <div className="w-full min-h-screen bg-[#F4F2EE]">

            <Nav />

            <div className="pt-[90px] px-5 lg:px-40">

                {/* PROFILE CARD */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">

                    {/* COVER */}
                    <div className="w-full h-[220px] bg-gray-300">

                        <img
                            src={user?.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                        />

                    </div>

                    {/* PROFILE */}
                    <div className="relative px-8 pb-8">

                        <div className="absolute -top-[60px] w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-white bg-white">

                            <img
                                src={user?.profileImage}
                                alt=""
                                className="w-full h-full object-cover"
                            />

                        </div>

                        <div className="pt-[75px]">

                            <h1 className="text-3xl font-bold">

                                {user?.firstName} {user?.lastName}

                            </h1>

                            <p className="text-gray-700 mt-2">

                                {user?.headline}

                            </p>

                            <p className="text-gray-500 mt-2">

                                {user?.location}

                            </p>

                            {
                                user?.education?.length > 0 && (

                                    <p className="mt-2 font-medium">

                                        {user.education[0]?.college}

                                    </p>
                                )
                            }

                        </div>

                    </div>

                </div>

                {/* SKILLS */}
                <div className="bg-white rounded-xl shadow-md p-6 mt-5">

                    <h1 className="text-2xl font-semibold mb-4">

                        Skills

                    </h1>

                    <div className="flex flex-wrap gap-3">

                        {
                            user?.skills?.length > 0
                                ? (
                                    user.skills.map((skill, index) => (

                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full"
                                        >

                                            {skill}

                                        </span>

                                    ))
                                )
                                : (
                                    <p className="text-gray-500">
                                        No skills added
                                    </p>
                                )
                        }

                    </div>

                </div>

                {/* EXPERIENCE */}
                <div className="bg-white rounded-xl shadow-md p-6 mt-5">

                    <h1 className="text-2xl font-semibold mb-4">

                        Experience

                    </h1>

                    {
                        user?.experience?.length > 0
                            ? (
                                user.experience.map((exp, index) => (

                                    <div
                                        key={index}
                                        className="mb-5 border-b pb-4"
                                    >

                                        <h2 className="text-xl font-semibold">

                                            {exp.title}

                                        </h2>

                                        <p className="text-gray-600">

                                            {exp.company}

                                        </p>

                                        <p className="mt-2 text-gray-700">

                                            {exp.description}

                                        </p>

                                    </div>

                                ))
                            )
                            : (
                                <p className="text-gray-500">
                                    No experience added
                                </p>
                            )
                    }

                </div>

            </div>

        </div>
    );
}

export default Profile;