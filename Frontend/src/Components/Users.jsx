import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { authDataContext } from "../Context/AuthContext";
import { userDataContext } from "../Context/UserContext";

function Users() {

  const { serverUrl } = useContext(authDataContext);

  const {
    userData,
    setUserData
  } = useContext(userDataContext);

  const [users, setUsers] = useState([]);

  // GET USERS
  const getUsers = async () => {

    try {

      const res = await axios.get(
        serverUrl + "/api/user/allusers",
        { withCredentials: true }
      );

      setUsers(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    getUsers();

  }, []);

  // SEND REQUEST
  const handleConnect = async (id) => {

    try {

      await axios.put(
        `${serverUrl}/api/user/send-request/${id}`,
        {},
        { withCredentials: true }
      );

      // INSTANT UI UPDATE
      setUserData((prev) => ({
        ...prev,
        sentRequests: [...(prev.sentRequests || []), { _id: id }]
      }));

    } catch (error) {

      console.log(error);

    }
  };

  // ACCEPT REQUEST
  const handleAccept = async (id) => {

    try {

      await axios.put(
        `${serverUrl}/api/user/accept-request/${id}`,
        {},
        { withCredentials: true }
      );

      // INSTANT UI UPDATE
      setUserData((prev) => ({
        ...prev,

        connectionRequests:
          prev.connectionRequests.filter(
            (u) => u._id !== id
          ),

        connections: [
          ...(prev.connections || []),
          { _id: id }
        ]
      }));

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

      // INSTANT UI UPDATE
      setUserData((prev) => ({
        ...prev,

        connections:
          prev.connections.filter(
            (u) => u._id !== id
          )
      }));

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="w-full mt-5">

      <h1 className="text-2xl font-bold mb-5">
        People You May Know
      </h1>

      <div className="flex flex-col gap-4">

        {
          users
            ?.filter((user) => user._id !== userData?._id)
            ?.map((user) => {

              const isConnected =
                userData?.connections?.some(
                  (u) => u._id === user._id
                );

              const requestReceived =
                userData?.connectionRequests?.some(
                  (u) => u._id === user._id
                );

              const requestSent =
                userData?.sentRequests?.some(
                  (u) => u._id === user._id
                );

              return (

                <div
                  key={user._id}
                  className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between"
                >

                  {/* USER INFO */}
                  <div className="flex items-center gap-3">

                    <img
                      src={user.profileImage}
                      alt=""
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <div>

                      <h1 className="font-semibold">
                        {user.firstName} {user.lastName}
                      </h1>

                      <p className="text-sm text-gray-500 line-clamp-1">
                        {user.headline}
                      </p>

                    </div>

                  </div>

                  {/* BUTTONS */}
                  {
                    isConnected ? (

                      <button
                        onClick={() => handleRemove(user._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-full cursor-pointer"
                      >
                        Remove
                      </button>

                    ) : requestReceived ? (

                      <button
                        onClick={() => handleAccept(user._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-full cursor-pointer"
                      >
                        Accept
                      </button>

                    ) : requestSent ? (

                      <button
                        className="px-4 py-2 bg-gray-400 text-white rounded-full"
                      >
                        Pending
                      </button>

                    ) : (

                      <button
                        onClick={() => handleConnect(user._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700"
                      >
                        Connect
                      </button>

                    )
                  }

                </div>
              );
            })
        }

      </div>

    </div>
  );
}

export default Users;