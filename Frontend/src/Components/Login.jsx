import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import { userDataContext } from '../Context/UserContext';
function Login() {
    let [show, setShow] = useState(false);
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [loading, setLoading] = useState(false);
    let navigate = useNavigate();
    const { serverUrl } = useContext(authDataContext);
    let { setUserData } = useContext(userDataContext);
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let result = await axios.post(serverUrl + "/api/auth/login",
                { email, password },
                { withCredentials: true }
            );
            toast.success("Login Successfull");
            setEmail("");
            setPassword("")
            setLoading(false)
            setUserData(result.data);
            navigate("/");
        } catch (error) {
            console.log(error);
            setLoading(false)
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
    return (
        <div className='w-full h-screen flex flex-col items-center'>
            <div className='p-[30px] w-full flex items-center'>
                <img src={logo} alt="" />
            </div>
            <form onSubmit={handleLogin} action="" className='md:shadow-xl w-[90%] max-w-[400px] h-[450px] p-5 flex flex-col items-center justify-center gap-[20px] rounded-xl'>
                <h1 className='text-3xl font-semibold mb-6'>Sign In</h1>
                <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' className='px-3 py-2  w-full outline-none border-[1px] rounded-md focus:ring-1 focus:ring-[#004182] focus:border-none' />
                <div className='w-full relative'>
                    <input type={show ? "text" : "password"} placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} className='px-3 py-2  w-full outline-none border-[1px] rounded-md focus:ring-1 focus:ring-[#004182] focus:border-none' />
                    <span className='absolute right-[20px] top-[10px] hover:cursor-pointer hover:text-blue-700 text-xl' onClick={() => setShow((prev) => !prev)}>{
                        !show ? <FaEye /> : <FaEyeSlash />
                    }</span>
                </div>
                <button disabled={loading} className='px-5 py-2 rounded-3xl bg-[#004182] text-white cursor-pointer active:scale-95 mt-10 flex items-center justify-center hover:bg-blue-700 transition-all'>
                    {
                        loading ? (<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>) : ("Sign In")
                    }
                </button>
                <p className='mt-5'>New to LinkedIn? <span className='cursor-pointer text-[#004182]' onClick={() => navigate("/signup")}>Join Now</span></p>
            </form>
        </div>
    )
}

export default Login
