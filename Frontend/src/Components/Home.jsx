import React, { useContext, useRef, useState } from 'react'
import Nav from '../Pages/Nav'
import { userDataContext } from '../Context/UserContext'
import EditProfile from '../Pages/EditProfile'
import { IoPencil } from "react-icons/io5";
import { RxCross1 } from 'react-icons/rx';
import { CiImageOn } from "react-icons/ci";
import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import Post from './Post';

function Home() {

    let { userData, edit, setEdit, posts, getPost } = useContext(userDataContext)

    let { serverUrl } = useContext(authDataContext);

    let [frontendImage, setFrontendImage] = useState("");
    let [backendImage, setBackendImage] = useState("");
    let [description, setDescription] = useState("");
    let [uploadPost, setUploadPost] = useState(false);
    let [posting, setPosting] = useState(false);

    let image = useRef()

    function handleImage(e) {
        let file = e.target.files[0]

        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    async function handleUploadPost() {

        setPosting(true)

        try {

            let formData = new FormData();

            formData.append("description", description);

            if (backendImage) {
                formData.append("image", backendImage)
            }

            let result = await axios.post(
                serverUrl + "/api/post/create",
                formData,
                { withCredentials: true }
            )

            console.log(result)

            // REFRESH POSTS
            await getPost();

            // RESET
            setPosting(false)
            setUploadPost(false);
            setDescription("");
            setBackendImage("");
            setFrontendImage("");

        } catch (error) {

            console.log(error)
            setPosting(false)

        }
    }

    return (

        <div className="w-full min-h-screen bg-[#F4F2EE] relative">

            {edit && <EditProfile />}

            <Nav />

            {/* CREATE POST MODAL */}
            {uploadPost &&

                <div>

                    <div className='w-full h-full bg-black z-[100] absolute opacity-[0.7]'></div>

                    <div className='p-5 bg-white w-[90%] absolute z-[220] shadow-lg top-[150px] left-[35%] rounded-xl h-[600px] max-w-[400px]'>

                        <div className='absolute top-[20px] right-[20px]'>

                            <RxCross1
                                onClick={() => setUploadPost(false)}
                                className='cursor-pointer text-xl font-bold text-gray-700 hover:text-teal-400 active:scale-80'
                            />

                        </div>

                        {/* USER */}
                        <div className='flex items-center gap-[10px] justify-start'>

                            <div className='w-[50px] h-[50px] overflow-hidden rounded-full items-center justify-center flex cursor-pointer'>

                                <img
                                    className='rounded-full object-cover'
                                    src={userData?.profileImage}
                                    alt=""
                                />

                            </div>

                            <div>

                                <h1 className='text-xl font-semibold'>
                                    {userData.firstName} {userData.lastName}
                                </h1>

                            </div>

                        </div>

                        {/* FILE INPUT */}
                        <input
                            type="file"
                            ref={image}
                            hidden
                            onChange={handleImage}
                        />

                        {/* DESCRIPTION */}
                        <div className='mt-[30px]'>

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className='border-[1px] resize-none w-full h-[200px] outline-none p-[10px] text-black rounded-xl overflow-auto'
                                placeholder='What do you want to talk about?'
                            ></textarea>

                            {/* PREVIEW IMAGE */}
                            {frontendImage &&

                                <div className='w-full h-[200px] overflow-hidden border-none outline-none flex justify-center items-center mt-3'>

                                    <img
                                        className='w-full h-[200px] object-contain'
                                        src={frontendImage}
                                        alt=""
                                    />

                                </div>

                            }

                        </div>

                        {/* IMAGE BUTTON */}
                        <CiImageOn
                            onClick={() => image.current.click()}
                            className='absolute bottom-[70px] active:scale-95 hover:text-gray-600 text-2xl cursor-pointer'
                        />

                        <span className='absolute bottom-[60px] w-[350px] rounded-full h-[0.5px] block bg-gray-500'></span>

                        {/* POST BUTTON */}
                        <button
                            onClick={handleUploadPost}
                            className='absolute bottom-[13px] right-[30px] px-6 py-2 cursor-pointer bg-blue-500 text-white rounded-full'
                            disabled={posting}
                        >

                            {
                                posting
                                    ? (
                                        <span className="w-4 h-4 border-1 border-white border-t-transparent rounded-full animate-spin"></span>
                                    )
                                    : (
                                        "Post"
                                    )
                            }

                        </button>

                    </div>

                </div>

            }

            <div className='w-full px-6 lg:px-40 flex gap-[20px]'>

                {/* LEFT SIDEBAR */}
                <div className='fixed h-[230px] w-[200px] mt-16 overflow-hidden rounded-lg shadow-2xl top-10 bg-white'>

                    {/* COVER IMAGE */}
                    <div className='h-[25%] w-full bg-red-900 cursor-pointer overflow-hidden'>

                        <img
                            className='object-cover w-full h-full'
                            src={userData?.coverImage || null}
                            alt=""
                        />

                    </div>

                    {/* EDIT BUTTON */}
                    <IoPencil
                        className='absolute top-[10px] right-[10px] cursor-pointer hover:text-white'
                        onClick={() => setEdit(true)}
                    />

                    {/* PROFILE IMAGE */}
                    <div className='w-[55px] h-[55px] cursor-pointer bg-red-200 rounded-full overflow-hidden absolute top-[35px] left-[20px]'>

                        <img
                            className='w-full h-full object-cover'
                            src={userData?.profileImage || null}
                            alt=""
                        />

                    </div>

                    {/* USER DETAILS */}
                    <h1 className='pt-10 ml-5 text-xl truncate font-semibold cursor-pointer'>

                        {userData?.firstName} {userData?.lastName}

                    </h1>

                    <p className='ml-5 text-gray-800 cursor-pointer line-clamp-2 text-xs pr-4 mt-2'>

                        {userData?.headline}

                    </p>

                    <p className='ml-5 text-gray-600 cursor-pointer line-clamp-2 text-xs mt-2'>

                        {userData?.location}

                    </p>

                    <p className='ml-5 cursor-pointer text-sm'>

                        {userData?.education?.[0]?.college}

                    </p>

                </div>

                {/* FEED */}
                <div className='ml-[220px] mt-[104px] w-full lg:w-[50%] min-h-[200px]'>

                    {/* START POST */}
                    <div className='w-full h-[120px] flex items-center justify-center gap-[20px] bg-white shadow-2xl rounded-lg'>

                        <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer'>

                            <img
                                className='object-cover'
                                src={userData?.profileImage || null}
                                alt=""
                            />

                        </div>

                        <button
                            className='w-[80%] cursor-pointer border-[1px] flex items-start px-5 hover:bg-gray-200 py-2 rounded-full'
                            onClick={() => setUploadPost(true)}
                        >

                            Start a post

                        </button>

                    </div>

                    {/* POSTS */}
                    <div className='mt-5'>

                        {
                            posts?.map((post) => (

                                <Post
                                    key={post._id}
                                    post={post}
                                />

                            ))
                        }

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Home