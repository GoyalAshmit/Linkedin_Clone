import React, { useContext, useEffect, useState } from 'react'
import logo1 from "../assets/linkedin.png"

import { FaHome, FaSearch } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { BsBriefcaseFill } from "react-icons/bs";
import { BsChatLeftDots } from "react-icons/bs";
import { IoIosNotifications } from "react-icons/io";

import { userDataContext } from '../Context/UserContext';
import { authDataContext } from '../Context/AuthContext';

import { useLocation, useNavigate } from 'react-router-dom';

import axios from "axios";

function Nav() {

    let navigate = useNavigate();

    let location = useLocation();

    const [active, setActive] = useState("home");

    let [search, setSearch] = useState(false);

    let [searchText, setSearchText] = useState("");

    let [searchUsers, setSearchUsers] = useState([]);

    let { userData, setUserData } =
        useContext(userDataContext);

    let { serverUrl } =
        useContext(authDataContext);

    let [showMenu, setShowMenu] =
        useState(false);

    // NOTIFICATIONS
    let [notifications, setNotifications] =
        useState([]);

    let [showNotifications, setShowNotifications] =
        useState(false);

    // ACTIVE NAVBAR
    useEffect(() => {

        if (location.pathname === "/") {

            setActive("home");

        }

        else if (location.pathname === "/mynetwork") {

            setActive("network");

        }

        else if (location.pathname === "/jobs") {

            setActive("jobs");

        }

    }, [location.pathname]);

    // GET NOTIFICATIONS
    const getNotifications = async () => {

        try {

            let res = await axios.get(
                serverUrl + "/api/notification/get",
                { withCredentials: true }
            )

            setNotifications(res.data)

        } catch (error) {

            console.log(error)

        }
    }

    useEffect(() => {

        getNotifications()

        const interval = setInterval(() => {

            getNotifications()

        }, 5000)

        return () => clearInterval(interval)

    }, [])

    // MARK AS READ
    const markAsRead = async () => {

        try {

            await axios.put(
                serverUrl + "/api/notification/read",
                {},
                { withCredentials: true }
            )

            setNotifications((prev) =>
                prev.map((n) => ({
                    ...n,
                    isRead: true
                }))
            )

        } catch (error) {

            console.log(error)

        }
    }

    // SEARCH USERS
    const handleSearch = async (value) => {

        setSearchText(value)

        if (value.trim() === "") {

            setSearchUsers([])

            return

        }

        try {

            const res = await axios.get(
                serverUrl + "/api/user/allusers",
                { withCredentials: true }
            )

            const filteredUsers = res.data.filter((user) =>

                `${user.firstName} ${user.lastName}`
                    .toLowerCase()
                    .includes(value.toLowerCase())
            )

            setSearchUsers(filteredUsers)

        } catch (error) {

            console.log(error)

        }
    }

    // LOGOUT
    const handleLogOut = async () => {

        try {

            await axios.get(
                serverUrl + "/api/auth/logout",
                { withCredentials: true }
            )

            setUserData(null)

            navigate("/login")

        } catch (error) {

            console.log(error)

        }
    }

    const navItemClass = (name) => {

        return `flex w-[42px] lg:w-[80px] flex-col items-center justify-center pb-1 cursor-pointer hover:text-black transition-all duration-200
        ${active === name
                ? "border-b-2 border-b-black text-black"
                : "border-b-2 border-transparent text-gray-600"
            }`
    }

    // UNREAD COUNT
    const unreadCount =
        notifications.filter(
            (n) => n.isRead === false
        ).length

    return (

        <div className='w-full bg-white h-[65px] fixed top-0 flex justify-between items-center gap-[3px] px-6 lg:px-40 z-[999]'>

            {/* LEFT */}
            <div className='flex lg:gap-[14px] relative'>

                {/* LOGO */}
                <div
                    className='mr-[20px] lg:mr-0 cursor-pointer'
                    onClick={() => {

                        navigate("/")

                    }}
                >

                    <img
                        className='w-[35px]'
                        src={logo1}
                        alt=""
                    />

                </div>

                {/* MOBILE SEARCH ICON */}
                <div
                    className='text-sm mt-2 lg:hidden'
                    onClick={() => setSearch(prev => !prev)}
                >

                    <FaSearch />

                </div>

                {/* SEARCH */}
                <div className='relative'>

                    <form
                        className={`${!search ? "hidden" : ""}
                        lg:flex h-[35px] w-[100px] lg:w-[250px]
                        transition-all focus-within:border-[1.5px]
                        focus-within:border-black lg:focus-within:w-[400px]
                        border-[1px] border-gray-400 rounded-2xl px-3 bg-white`}
                    >

                        <span className='hidden lg:block font-medium mr-3 mt-2'>

                            <FaSearch />

                        </span>

                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) =>
                                handleSearch(e.target.value)
                            }
                            className='flex-1 h-full w-[80%] outline-none'
                            placeholder='Search users'
                        />

                    </form>

                    {/* SEARCH RESULTS */}
                    {
                        searchUsers.length > 0 && (

                            <div className='absolute top-[45px] left-0 w-[350px] bg-white rounded-xl shadow-2xl max-h-[400px] overflow-y-auto z-[999]'>

                                {
                                    searchUsers.map((user) => (

                                        <div
                                            key={user._id}
                                            onClick={() => {

                                                navigate(`/profile/${user._id}`)

                                                setSearchUsers([])

                                                setSearchText("")

                                            }}
                                            className='flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b'
                                        >

                                            <img
                                                src={user.profileImage || null}
                                                alt=""
                                                className='w-[45px] h-[45px] rounded-full object-cover'
                                            />

                                            <div>

                                                <h1 className='font-semibold'>

                                                    {user.firstName} {user.lastName}

                                                </h1>

                                                <p className='text-sm text-gray-500'>

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

            {/* RIGHT */}
            <div className='flex gap-[7px] lg:gap-[20px] relative'>

                {/* PROFILE MENU */}
                {
                    showMenu && (

                        <div className='w-[300px] top-[65px] flex flex-col items-center justify-center rounded-xl right-[0px] bg-white shadow-lg absolute p-[20px] gap-[20px]'>

                            <div>

                                <img
                                    className='h-[60px] w-[60px] rounded-full object-cover overflow-hidden'
                                    src={userData?.profileImage || null}
                                    alt=""
                                />

                            </div>

                            <div>

                                <h1 className='text-[18px] font-semibold text-gray-700'>

                                    {userData?.firstName} {userData?.lastName}

                                </h1>

                            </div>

                            <button
                                onClick={() =>
                                    navigate(`/profile/${userData?._id}`)
                                }
                                className='px-3 py-1 border-[#004182] text-[#004182] active:scale-95 hover:bg-[#004182] hover:text-white w-full border-[1px] cursor-pointer rounded-full'
                            >

                                View Profile

                            </button>

                            <span className='w-full h-[1px] bg-gray-400'></span>

                            <button
                                onClick={handleLogOut}
                                className='px-3 py-2 border-red-600 border-[1px] text-red-600 hover:bg-red-600 hover:text-white active:scale-95 cursor-pointer rounded-full w-full'
                            >

                                Sign Out

                            </button>

                        </div>
                    )
                }

                {/* HOME */}
                <div
                    className={`${navItemClass("home")} hidden lg:flex flex-col`}
                    onClick={() => {

                        navigate("/")

                    }}
                >

                    <FaHome className='text-xl' />

                    <div className='text-xs font-medium'>
                        Home
                    </div>

                </div>

                {/* MY NETWORK */}
                <div
                    className={`${navItemClass("network")} hidden lg:flex`}
                    onClick={() => {

                        navigate("/mynetwork")

                    }}
                >

                    <MdGroups2 className='text-xl' />

                    <div className='text-xs font-medium'>
                        My Network
                    </div>

                </div>

                {/* JOBS */}
                <div
                    className={`${navItemClass("jobs")} hidden lg:flex`}
                    onClick={() => {

                        navigate("/jobs")

                    }}
                >

                    <BsBriefcaseFill className='text-xl' />

                    <div className='text-xs font-medium'>
                        Jobs
                    </div>

                </div>

                {/* MESSAGING */}
                <div
                    className={`${navItemClass("messaging")}`}
                    onClick={() => {

                        setActive("messaging")

                    }}
                >

                    <BsChatLeftDots className='text-xl' />

                    <div className='hidden md:block text-xs font-medium'>
                        Messaging
                    </div>

                </div>

                {/* NOTIFICATIONS */}
                <div
                    className={`${navItemClass("notifications")} relative`}
                    onClick={async () => {

                        if (!showNotifications) {

                            await markAsRead()

                        }

                        setShowNotifications((prev) => !prev)

                    }}
                >

                    <IoIosNotifications className='text-xl' />

                    {
                        unreadCount > 0 && (

                            <div className='absolute top-0 right-3 bg-red-600 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold'>

                                {unreadCount}

                            </div>
                        )
                    }

                    <div className='text-xs font-medium hidden md:block'>
                        Notifications
                    </div>

                </div>

                {/* NOTIFICATION POPUP */}
                {
                    showNotifications && (

                        <div className='absolute top-[70px] right-[60px] w-[380px] max-h-[500px] overflow-y-auto bg-white rounded-2xl shadow-2xl p-5 z-[999]'>

                            <h1 className='text-3xl font-bold mb-5'>

                                Notifications

                            </h1>

                            {
                                notifications.length === 0
                                    ? (
                                        <p className='text-gray-500'>
                                            No notifications
                                        </p>
                                    )
                                    : (
                                        notifications.map((item) => (

                                            <div
                                                key={item._id}
                                                className='border-b py-4'
                                            >

                                                <div className='flex items-start gap-4'>

                                                    <img
                                                        src={item.sender?.profileImage || null}
                                                        alt=""
                                                        className='w-[60px] h-[60px] rounded-full object-cover'
                                                    />

                                                    <div className='flex-1'>

                                                        <p className='text-[16px] text-gray-800 leading-6'>

                                                            <span className='font-bold text-black'>

                                                                {item.sender?.firstName}{" "}
                                                                {item.sender?.lastName}

                                                            </span>

                                                            {" "}

                                                            {item.text}

                                                        </p>

                                                        <p className='text-sm text-gray-500 mt-2'>

                                                            {
                                                                new Date(
                                                                    item.createdAt
                                                                ).toLocaleString()
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        ))
                                    )
                            }

                        </div>
                    )
                }

                {/* PROFILE IMAGE */}
                <div>

                    <img
                        onClick={() =>
                            setShowMenu(!showMenu)
                        }
                        className='cursor-pointer h-[43px] w-[43px] rounded-full object-cover overflow-hidden'
                        src={userData?.profileImage || null}
                        alt=""
                    />

                </div>

            </div>

        </div>
    )
}

export default Nav