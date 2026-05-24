import React, { useContext } from "react";
import { userDataContext } from "../Context/UserContext";
import { authDataContext } from "../Context/AuthContext";
import axios from "axios";
import Nav from "./Nav";
import defaultPP from "../assets/defaultProfile.jpg";

function MyNetwork() {
    const { userData, setUserData } = useContext(userDataContext);
    const { serverUrl } = useContext(authDataContext);

    // ACCEPT REQUEST
    const handleAccept = async (id) => {
        try {
            await axios.put(
                `${serverUrl}/api/user/accept-request/${id}`,
                {},
                { withCredentials: true }
            );
            setUserData((prev) => {
                const acceptedUser = prev.connectionRequests?.find(u => u._id === id);
                return {
                    ...prev,
                    connectionRequests: prev.connectionRequests?.filter((u) => u._id !== id) || [],
                    connections: [...(prev.connections || []), acceptedUser || { _id: id }]
                };
            });
        } catch (error) {
            console.log(error);
        }
    };

    // DECLINE/CANCEL REQUEST
    const handleDeclineOrCancel = async (id, type) => {
        try {
            await axios.put(
                `${serverUrl}/api/user/decline-request/${id}`,
                {},
                { withCredentials: true }
            );
            setUserData((prev) => {
                if (type === "received") {
                    return {
                        ...prev,
                        connectionRequests: prev.connectionRequests?.filter((u) => u._id !== id) || []
                    };
                } else {
                    return {
                        ...prev,
                        sentRequests: prev.sentRequests?.filter((u) => u._id !== id) || []
                    };
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    // REMOVE CONNECTION
    const handleRemove = async (id) => {
        try {
            await axios.put(
                `${serverUrl}/api/user/remove-connection/${id}`,
                {},
                { withCredentials: true }
            );
            setUserData((prev) => ({
                ...prev,
                connections: prev.connections?.filter((u) => u._id !== id) || []
            }));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Nav />

            <div className="w-full min-h-screen bg-[#F4F2EE] px-6 lg:px-40 pt-[100px] pb-10">
                {/* CONNECTIONS */}
                <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">
                        Connections
                    </h1>

                    {userData?.connections?.length === 0 ? (
                        <p className="text-gray-500">No connections yet</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {userData?.connections?.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={user.profileImage || defaultPP}
                                            alt=""
                                            className="w-[60px] h-[60px] rounded-full object-cover border border-gray-200"
                                        />
                                        <div>
                                            <h1 className="font-bold text-lg text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </h1>
                                            <p className="text-gray-500 text-sm line-clamp-1">
                                                {user.headline}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(user._id)}
                                        className="px-4 py-1.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full cursor-pointer transition-all active:scale-95 text-xs font-semibold"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PENDING REQUESTS */}
                <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">
                        Pending Requests
                    </h1>

                    {userData?.connectionRequests?.length === 0 ? (
                        <p className="text-gray-500">No pending requests</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {userData?.connectionRequests?.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={user.profileImage || defaultPP}
                                            alt=""
                                            className="w-[60px] h-[60px] rounded-full object-cover border border-gray-200"
                                        />
                                        <div>
                                            <h1 className="font-bold text-lg text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </h1>
                                            <p className="text-gray-500 text-sm line-clamp-1">
                                                {user.headline}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(user._id)}
                                            className="px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-full cursor-pointer transition-all active:scale-95 text-xs font-semibold shadow-sm"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleDeclineOrCancel(user._id, "received")}
                                            className="px-4 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-full cursor-pointer transition-all active:scale-95 text-xs font-semibold"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SENT REQUESTS */}
                <div className="bg-white rounded-2xl p-6 shadow-md">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">
                        Sent Requests
                    </h1>

                    {userData?.sentRequests?.length === 0 ? (
                        <p className="text-gray-500">No sent requests</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {userData?.sentRequests?.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={user.profileImage || defaultPP}
                                            alt=""
                                            className="w-[60px] h-[60px] rounded-full object-cover border border-gray-200"
                                        />
                                        <div>
                                            <h1 className="font-bold text-lg text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </h1>
                                            <p className="text-gray-500 text-sm line-clamp-1">
                                                {user.headline}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeclineOrCancel(user._id, "sent")}
                                        className="px-4 py-1.5 border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-full cursor-pointer transition-all active:scale-95 text-xs font-semibold"
                                    >
                                        Cancel Request
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default MyNetwork;