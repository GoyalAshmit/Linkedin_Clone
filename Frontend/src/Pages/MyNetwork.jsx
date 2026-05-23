import React, { useContext } from "react";

import { userDataContext } from "../Context/UserContext";

import Nav from "./Nav";

function MyNetwork() {

    const { userData } =
        useContext(userDataContext);

    return (

        <>

            <Nav />

            <div className="w-full min-h-screen bg-[#F4F2EE] px-6 lg:px-40 pt-[100px]">

                {/* CONNECTIONS */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">

                    <h1 className="text-3xl font-bold mb-6">
                        Connections
                    </h1>

                    {
                        userData?.connections?.length === 0
                            ? (
                                <p className="text-gray-500">
                                    No connections yet
                                </p>
                            )
                            : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {
                                        userData?.connections?.map((user) => (

                                            <div
                                                key={user._id}
                                                className="flex items-center gap-4 border rounded-xl p-4"
                                            >

                                                <img
                                                    src={user.profileImage || null}
                                                    alt=""
                                                    className="w-[60px] h-[60px] rounded-full object-cover"
                                                />

                                                <div>

                                                    <h1 className="font-bold text-lg">

                                                        {user.firstName} {user.lastName}

                                                    </h1>

                                                    <p className="text-gray-500">

                                                        {user.headline}

                                                    </p>

                                                </div>

                                            </div>
                                        ))
                                    }

                                </div>
                            )
                    }

                </div>

                {/* PENDING REQUESTS */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">

                    <h1 className="text-3xl font-bold mb-6">
                        Pending Requests
                    </h1>

                    {
                        userData?.connectionRequests?.length === 0
                            ? (
                                <p className="text-gray-500">
                                    No pending requests
                                </p>
                            )
                            : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {
                                        userData?.connectionRequests?.map((user) => (

                                            <div
                                                key={user._id}
                                                className="flex items-center gap-4 border rounded-xl p-4"
                                            >

                                                <img
                                                    src={user.profileImage || null}
                                                    alt=""
                                                    className="w-[60px] h-[60px] rounded-full object-cover"
                                                />

                                                <div>

                                                    <h1 className="font-bold text-lg">

                                                        {user.firstName} {user.lastName}

                                                    </h1>

                                                    <p className="text-gray-500">

                                                        {user.headline}

                                                    </p>

                                                </div>

                                            </div>
                                        ))
                                    }

                                </div>
                            )
                    }

                </div>

                {/* SENT REQUESTS */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">

                    <h1 className="text-3xl font-bold mb-6">
                        Sent Requests
                    </h1>

                    {
                        userData?.sentRequests?.length === 0
                            ? (
                                <p className="text-gray-500">
                                    No sent requests
                                </p>
                            )
                            : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {
                                        userData?.sentRequests?.map((user) => (

                                            <div
                                                key={user._id}
                                                className="flex items-center gap-4 border rounded-xl p-4"
                                            >

                                                <img
                                                    src={user.profileImage || null}
                                                    alt=""
                                                    className="w-[60px] h-[60px] rounded-full object-cover"
                                                />

                                                <div>

                                                    <h1 className="font-bold text-lg">

                                                        {user.firstName} {user.lastName}

                                                    </h1>

                                                    <p className="text-gray-500">

                                                        {user.headline}

                                                    </p>

                                                </div>

                                            </div>
                                        ))
                                    }

                                </div>
                            )
                    }

                </div>

            </div>

        </>
    )
}

export default MyNetwork