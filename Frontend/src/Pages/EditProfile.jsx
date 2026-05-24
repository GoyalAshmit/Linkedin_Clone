import React, { useContext, useRef, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from '../Context/UserContext';
import { FaPlusCircle } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import defaultPP from "../assets/defaultProfile.jpg"
import deafultCP from "../assets/defaultcoverimage.png"
import { authDataContext } from '../Context/AuthContext';
import axios from "axios";
function EditProfile() {
    let { userData, setUserData, setEdit } = useContext(userDataContext)
    let { serverUrl } = useContext(authDataContext)
    let [firstName, setFirstName] = useState(userData?.firstName || "");
    let [lastName, setLastName] = useState(userData?.lastName || "");
    let [userName, setUserName] = useState(userData?.userName || "");
    let [headline, setHeadline] = useState(userData?.headline || "");
    let [location, setLocation] = useState(userData?.location || "");
    let [gender, setGender] = useState(userData?.gender || "");
    let [skills, setSkills] = useState(userData?.skills || [])
    let [skillsInput, setSkillsInput] = useState("")
    let [education, setEducation] = useState(userData?.education || [])
    let [eduInput, setEduInput] = useState({ college: "", degree: "", fieldOfStudy: "" })
    let [experience, setExperience] = useState(userData?.experience || []);
    let [expInput, setExpInput] = useState({ title: "", company: "", description: "" })
    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove))
    }
    const addSkill = (e) => {
        e.preventDefault();
        const skill = skillsInput.trim()
        if (!skill) return
        if (skills.includes(skill)) return
        setSkills([...skills, skill]);
        setSkillsInput("")

    }
    const addEducation = (e) => {
        e.preventDefault();
        if (!eduInput.college && !eduInput.degree && !eduInput.fieldOfStudy) return;
        setEducation([...education, eduInput])
        setEduInput({ college: "", degree: "", fieldOfStudy: "" })
    }
    const addExp = (e) => {
        e.preventDefault();
        if (!expInput.title && !expInput.company && !expInput.description) return;
        setExperience([...experience, expInput]);
        setExpInput({ title: "", company: "", description: "" });
    }
    const removeEducation = (index) => {
        setEducation(education.filter((_, i) => i !== index))
    }
    const removeExperience = (index) => {
        setExperience(experience.filter((_, i) => i !== index))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        handleSaveProfile();
    }
    const profileImage = useRef()
    const coverImage = useRef()
    let [fronendProfileImage, setFrontendProfileImage] = useState(userData.profileImage || defaultPP);
    let [fronendCoverImage, setFrontendCoverImage] = useState(userData.coverImage || deafultCP);
    let [profileFile, setProfileFile] = useState(null)
    let [coverFile, setCoverFile] = useState(null)
    let handleProfileImage = (e) => {
        let file = e.target.files[0];
        setProfileFile(file);
        setFrontendProfileImage(URL.createObjectURL(file))
    }
    let handleCoverImage = (e) => {
        let file = e.target.files[0];
        setCoverFile(file);
        setFrontendCoverImage(URL.createObjectURL(file))
    }
    const handleSaveProfile = async () => {
        try {
            console.log("Saving profile")
            let formdata = new FormData()
            formdata.append("firstName", firstName);
            formdata.append("lastName", lastName);
            formdata.append("userName", userName)
            formdata.append("headline", headline)
            formdata.append("skills", JSON.stringify(skills))
            formdata.append("education", JSON.stringify(education))
            formdata.append("location", location)
            formdata.append("experience", JSON.stringify(experience));
            formdata.append("gender", gender)
            if (profileFile) {
                formdata.append("profileImage", profileFile)
            }
            if (coverFile) {
                formdata.append("coverImage", coverFile)
            }
            let result = await axios.put(serverUrl + "/api/user/updateuser", formdata, { withCredentials: true })
            setUserData(result.data)
            console.log(result)
            setEdit(false)
        } catch (error) {
            console.log("ERROR OBJECT:", error);
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);
            console.log("MESSAGE:", error.message);
        }
    }
    return (


        <div className='w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center '>
            <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfileImage} />
            <input type="file" accept='image/*' hidden ref={coverImage} onChange={handleCoverImage} />

            <div className='w-full h-full bg-black opacity-[0.5] absolute '></div>
            <div className='w-[90%] bg-white max-w-[500px] h-[600px] relative p-[10px] z-[200] overflow-auto rounded-lg shadow-lg'>
                <div className='absolute top-[20px] right-[20px]'>
                    <RxCross1 className='cursor-pointer text-xl font-bold text-gray-700 hover:text-teal-400 active:scale-80' onClick={() => setEdit(false)} />
                </div>
                <div className='relative w-full h-[100px] overflow-hidden bg-blue-950 mt-[42px]'>
                    <img src={fronendCoverImage} className='w-full' alt="" />
                    <IoPencil onClick={() => coverImage.current.click()} className='right-[10px] top-[5px] absolute text-white text-xl cursor-pointer hover:text-gray-500' />
                </div>
                <div className='bg-red-600 rounded-full w-[80px] h-[80px] overflow-hidden absolute top-[115px] left-[30px]'>
                    <img className='w-full h-full' src={fronendProfileImage} alt="" />
                    <FaPlusCircle onClick={() => profileImage.current.click()} className='absolute top-[35px] right-[0px] text-blue-500 cursor-pointer text-xl' />
                </div>
                <div className='w-full'>
                    <form onSubmit={handleSubmit} className='w-full flex flex-col items-center justify-center gap-[10px] mt-[70px] ' action="">
                        <h1 className='text-2xl mb-[10px]'>Edit Profile</h1>
                        <input type="text" placeholder='Enter First Name' className='w-full px-3 py-1 outline-none border-[1px] rounded-md focus:ring-1 focus:ring-blue-400 border-gray-500' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <input type="text" placeholder='Enter Last Name' className='w-full px-3 py-1 outline-none border-[1px] rounded-md focus:ring-1 focus:ring-blue-400 border-gray-500' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <input type="text" placeholder='Enter User Name' className='w-full px-3 py-1 outline-none border-[1px] rounded-md focus:ring-1 focus:ring-blue-400 border-gray-500' value={userName} onChange={(e) => setUserName(e.target.value)} />
                        <input type="text" placeholder='Enter Head Line' className='w-full px-3 py-1 outline-none border-[1px] rounded-md focus:ring-1 focus:ring-blue-400 border-gray-500' value={headline} onChange={(e) => setHeadline(e.target.value)} />
                        <input type="text" placeholder='Enter Location' className='w-full px-3 py-1 outline-none border-[1px] rounded-md focus:ring-1 focus:ring-blue-400 border-gray-500' value={location} onChange={(e) => setLocation(e.target.value)} />
                        <div className="w-full mt-2 border-[1px] p-[5px] rounded-xl border-gray-500">
                            <p className="text-black text-sm mb-2">Gender</p>

                            <div className="flex items-center gap-8 pl-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={gender === "male"}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    <span className="text-gray-800">Male</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={gender === "female"}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    <span className="text-gray-800">Female</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="other"
                                        checked={gender === "other"}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    <span className="text-gray-800">Other</span>
                                </label>
                            </div>
                        </div>
                        <div className='border-[1px] border-gray-700 rounded-xl w-full p-[10px]'>
                            <h1 className='text-lg font-semibold'>Skills</h1>
                            {
                                skills.length > 0 && (
                                    <div className='w-full'>
                                        <div className='flex flex-wrap gap-3'></div>
                                        {skills.map((skill) => (
                                            <div key={skill} className='group relative px-4 py-2 border rounded-xl shadow-sm hover:shadow-md mb-2'>
                                                {skill}
                                                <span onClick={() => removeSkill(skill)} className='absolute top-2.5  right-2 hidden group-hover:flex items-center w-5 h-5 justify-center text-gray-600 text-xl cursor-pointer hover:text-red-700'>
                                                    <RxCross2 />
                                                </span>
                                            </div>
                                        )
                                        )}
                                    </div>
                                )
                            }

                            <input type="text" placeholder='Enter your skill' className='mt-2 w-full px-3 py-2 border-[1px] outline-none focus:ring-1 focus:ring-blue-400 rounded-xl' value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
                            <button type='button' className='px-3 py-1 cursor-pointer rounded-full border-[1px] mt-4 active:scale-95' onClick={addSkill}>Add Skill</button>
                        </div>
                        <div className='border-[1px] rounded-xl p-[5px] flex flex-col w-full gap-[10px] border-gray-700'>
                            <h1 className='text-xl font-semibold '>Education</h1>
                            {education.map((edu, index) => (
                                <div key={index} className='group relative px-4 py-2 border-[1px] rounded-xl shadow-sm relative hover:shadow-md'>
                                    <div>{edu.college} - {edu.degree} - {edu.fieldOfStudy}</div>
                                    <span className='absolute top-2.5 right-2 cursor-pointer hidden group-hover:flex text-xl hover:text-red-600 active:scale-95' onClick={() => removeEducation(index)}><RxCross2 /></span>
                                </div>
                            ))}
                            <input type="text" placeholder='Enter your college' className='mt-2 w-full px-3 py-2 border-[1px] outline-none focus:ring-1 focus:ring-blue-400 rounded-xl' value={eduInput.college} onChange={(e) => setEduInput({ ...eduInput, college: e.target.value })} />
                            <input type="text" placeholder='Enter your degree' className='mt-2 w-full px-3 py-2 border-[1px] outline-none focus:ring-1 focus:ring-blue-400 rounded-xl' value={eduInput.degree} onChange={(e) => setEduInput({ ...eduInput, degree: e.target.value })} />
                            <input type="text" placeholder='Enter field of study' className='mt-2 w-full px-3 py-2 border-[1px] outline-none focus:ring-1 focus:ring-blue-400 rounded-xl' value={eduInput.fieldOfStudy} onChange={(e) => setEduInput({ ...eduInput, fieldOfStudy: e.target.value })} />
                            <button type='button' className='px-3 py-1 cursor-pointer rounded-full border-[1px] mt-4 active:scale-95' onClick={addEducation}>Submit</button>
                        </div>
                        <div className='border-[1px] rounded-xl p-[5px] flex flex-col w-full gap-[10px] border-gray-700'>
                            <h1 className='text-xl font-semibold '>Experience</h1>
                            {experience.map((exp, index) => (
                                <div key={index} className='group relative px-4 py-2 border-[1px] rounded-xl shadow-sm relative hover:shadow-md'>
                                    <div>{exp.title} at {exp.company}</div>
                                    <div className='text-sm text-gray-600'>{exp.description}</div>
                                    <span className='absolute top-4.5 right-2 cursor-pointer hidden group-hover:flex text-xl hover:text-red-600 active:scale-95' onClick={() => removeExperience(index)}><RxCross2 /></span>
                                </div>
                            ))}
                            <input type="text" placeholder='Job Title' className='mt-2 w-full px-3 py-2 border-[1px] outline-none focus:ring-1 focus:ring-blue-400 rounded-xl' value={expInput.title} onChange={(e) => setExpInput({ ...expInput, title: e.target.value })} />
                            <input type="text" placeholder='Enter your Company' className='mt-2 w-full px-3 py-2 border-[1px] outline-none focus:ring-1 focus:ring-blue-400 rounded-xl' value={expInput.company} onChange={(e) => setExpInput({ ...expInput, company: e.target.value })} />
                            <input type="text" placeholder='Enter description' className='mt-2 w-full px-3 py-2 border-[1px] outline-none focus:ring-1 focus:ring-blue-400 rounded-xl' value={expInput.description} onChange={(e) => setExpInput({ ...expInput, description: e.target.value })} />
                            <button type='button' className='px-3 py-1 cursor-pointer rounded-full border-[1px] mt-4 active:scale-95' onClick={addExp}>Submit</button>
                        </div>
                        <button type='submit' className='px-5 py-2 rounded-3xl bg-[#004182] text-white cursor-pointer active:scale-95 mt-10 flex items-center justify-center hover:bg-blue-700 transition-all'>Edit Profile</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default EditProfile
