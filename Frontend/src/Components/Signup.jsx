import { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {useNavigate} from "react-router-dom"
import { authDataContext } from "../Context/AuthContext";
import { toast } from "react-toastify";

import axios from "axios";
import { userDataContext } from "../Context/UserContext";
function Signup() {
    let [show,setShow] = useState(false);
    let navigate = useNavigate()
    let {serverUrl} = useContext(authDataContext);
    let [firstName,setFirstName] = useState("");
    let [lastName,setLastName] = useState("");
    let [userName,setUserName] = useState("");
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    let [loading,setLoading] = useState(false);
    let {setUserData} = useContext(userDataContext);

    const handleSignup = async (e)=>{
        e.preventDefault()
        setLoading(true)
        try {
            let result= await axios.post(serverUrl+"/api/auth/signup",{
                firstName,
                lastName,
                userName,
                email,
                password
            },{withCredentials:true})
            //console.log(result);
            toast.success("Account created successfully 🎉");
            setLoading(false)
            setFirstName("");
            setLastName("");
            setUserName("");
            setEmail("");
            setPassword("");
            setUserData(result.data);
           navigate("/")

        } catch (error) {
            setLoading(false)
            // console.log(error)
            toast.error(error.response?.data?.message || "Signup failed");
        }
    }
  return (
    <div className='w-full h-screen flex flex-col items-center justify-start gap-[10px]'>
      <div className='p-[30px] lg:p-[35px] w-full flex items-center'>
        <img src={logo} alt="" />
      </div>
      <form className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl rounded-xl flex flex-col items-center justify-center p-[15px] gap-[20px]' onSubmit={handleSignup} action="">
        <h1 className='text-3xl font-semibold mb-10'>Sign Up</h1>
        <input type="text" required placeholder='Enter your First Name' value={firstName} onChange={e=>setFirstName(e.target.value)} className='w-full px-3 py-1 outline-none border-[1px] rounded-md focus:ring-1 focus:ring-blue-400' />
        <input type="text" required placeholder='Enter your Last Name' value={lastName} onChange={(e)=>setLastName(e.target.value)} className='w-full px-3 py-1 outline-none border-[1px] rounded-md focus:ring-1 focus:ring-blue-400' />
        <input type="text" required placeholder='Enter Username' value={userName} onChange={(e)=>setUserName(e.target.value)} className='w-full px-3 py-1 outline-none border-[1px] rounded-md focus:ring-1 focus:ring-blue-400' />
        <input type="email" required placeholder='Enter your email' value={email} onChange={(e)=>setEmail(e.target.value)} className='w-full px-3 py-1 outline-none border-[1px] rounded-md focus:ring-1 focus:ring-blue-400' />
        <div className="w-full relative">
            <input type={show?"text":"password"} required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your Password' className='w-full px-3 py-1 outline-none border-[1px] rounded-md focus:ring-1 focus:ring-blue-400' />
            <span className="absolute right-[20px] top-[5px] hover:cursor-pointer hover:text-blue-700 text-xl" onClick={()=>setShow((prev)=>{return !prev})}>{!show?<FaEye /> : <FaEyeSlash />}</span>
        </div>
        <button disabled={loading} className='px-5 py-2 rounded-3xl bg-blue-500 text-white cursor-pointer active:scale-95 mt-10 flex items-center justify-center hover:bg-blue-700 transition-all'>{
                loading ? (<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>):("Sign Up")
            }</button>

        <p>Already have an account? <span className="text-blue-500 cursor-pointer" onClick={()=>navigate("/login")}>Sign In</span></p>
      </form>
    </div>
  )
}

export default Signup
