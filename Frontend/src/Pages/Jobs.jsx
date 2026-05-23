import React, { useContext, useEffect, useState } from "react";

import Nav from "./Nav";

import axios from "axios";

import { authDataContext } from "../Context/AuthContext";
import { userDataContext } from "../Context/UserContext";

function Jobs() {

    let { serverUrl } =
        useContext(authDataContext);

    let { userData } =
        useContext(userDataContext);

    const [jobs, setJobs] = useState([]);

    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [salary, setSalary] = useState("");

    // GET ALL JOBS
    const getJobs = async () => {

        try {

            let res = await axios.get(
                serverUrl + "/api/job/all",
                { withCredentials: true }
            );

            setJobs(res.data);

        } catch (error) {

            console.log(error);

        }
    };

    useEffect(() => {

        getJobs();

    }, []);

    // ADD JOB
    const addJob = async (e) => {

        e.preventDefault();

        try {

            await axios.post(

                serverUrl + "/api/job/add",

                {
                    title,
                    company,
                    location,
                    description,
                    salary
                },

                { withCredentials: true }

            );

            alert("Job Added Successfully");

            setTitle("");
            setCompany("");
            setLocation("");
            setDescription("");
            setSalary("");

            getJobs();

        } catch (error) {

            console.log(error);

        }
    };

    // APPLY JOB
    const applyJob = async (id) => {

        try {

            let res = await axios.put(

                serverUrl + `/api/job/apply/${id}`,

                {},

                { withCredentials: true }

            );

            alert(res.data.message);

            getJobs();

        } catch (error) {

            alert(error.response.data.message);

        }
    };

    // CANCEL APPLICATION
    const cancelApplication = async (id) => {

        try {

            let res = await axios.put(

                serverUrl + `/api/job/cancel/${id}`,

                {},

                { withCredentials: true }

            );

            alert(res.data.message);

            getJobs();

        } catch (error) {

            alert(error.response.data.message);

        }
    };

    return (

        <>

            <Nav />

            <div className="w-full min-h-screen bg-[#F4F2EE] px-6 lg:px-40 pt-[100px] pb-10">

                {/* ADD JOB FORM */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

                    <h1 className="text-3xl font-bold mb-6">

                        Add Job

                    </h1>

                    <form
                        onSubmit={addJob}
                        className="flex flex-col gap-4"
                    >

                        <input
                            type="text"
                            placeholder="Job Title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            className="border p-3 rounded-xl outline-none"
                            required
                        />

                        <input
                            type="text"
                            placeholder="Company Name"
                            value={company}
                            onChange={(e) =>
                                setCompany(e.target.value)
                            }
                            className="border p-3 rounded-xl outline-none"
                            required
                        />

                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            className="border p-3 rounded-xl outline-none"
                            required
                        />

                        <textarea
                            placeholder="Job Description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="border p-3 rounded-xl outline-none h-[120px]"
                            required
                        />

                        <input
                            type="text"
                            placeholder="Salary"
                            value={salary}
                            onChange={(e) =>
                                setSalary(e.target.value)
                            }
                            className="border p-3 rounded-xl outline-none"
                        />

                        <button
                            type="submit"
                            className="bg-[#0A66C2] text-white py-3 rounded-full hover:bg-[#004182]"
                        >

                            Add Job

                        </button>

                    </form>

                </div>

                {/* JOB LIST */}
                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <h1 className="text-3xl font-bold mb-6">

                        Available Jobs

                    </h1>

                    <div className="flex flex-col gap-5">

                        {
                            jobs.map((job) => {

                                const hasApplied =
                                    job.applicants.some(
                                        (applicant) =>
                                            applicant._id === userData?._id
                                    );

                                return (

                                    <div
                                        key={job._id}
                                        className="border rounded-2xl p-5 hover:shadow-md transition-all"
                                    >

                                        <h1 className="text-2xl font-bold">

                                            {job.title}

                                        </h1>

                                        <p className="text-lg text-gray-700 mt-2">

                                            {job.company}

                                        </p>

                                        <p className="text-gray-500">

                                            {job.location}

                                        </p>

                                        <p className="mt-3 text-gray-700">

                                            {job.description}

                                        </p>

                                        <p className="mt-2 font-semibold text-[#0A66C2]">

                                            Salary: {job.salary}

                                        </p>

                                        <p className="mt-2 text-sm text-gray-500">

                                            Posted By:
                                            {" "}
                                            {job.createdBy?.firstName}
                                            {" "}
                                            {job.createdBy?.lastName}

                                        </p>

                                        {/* APPLY / APPLIED / CANCEL */}
                                        <div className="flex gap-3 mt-4">

                                            {
                                                hasApplied ? (

                                                    <>
                                                    
                                                        <button
                                                            className="px-5 py-2 bg-green-600 text-white rounded-full cursor-default"
                                                        >

                                                            Applied

                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                cancelApplication(job._id)
                                                            }
                                                            className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                                        >

                                                            Cancel Application

                                                        </button>

                                                    </>

                                                ) : (

                                                    <button
                                                        onClick={() =>
                                                            applyJob(job._id)
                                                        }
                                                        className="px-5 py-2 bg-[#0A66C2] text-white rounded-full hover:bg-[#004182]"
                                                    >

                                                        Apply

                                                    </button>

                                                )
                                            }

                                        </div>

                                        {/* SHOW APPLICANTS ONLY TO JOB OWNER */}
                                        {
                                            job.createdBy?._id === userData?._id && (

                                                <div className="mt-6">

                                                    <h1 className="text-xl font-bold mb-3">

                                                        Applicants

                                                    </h1>

                                                    {
                                                        job.applicants.length === 0
                                                            ? (
                                                                <p className="text-gray-500">
                                                                    No Applicants Yet
                                                                </p>
                                                            )
                                                            : (
                                                                <div className="flex flex-col gap-3">

                                                                    {
                                                                        job.applicants.map((user) => (

                                                                            <div
                                                                                key={user._id}
                                                                                className="flex items-center gap-3 border rounded-xl p-3"
                                                                            >

                                                                                <img
                                                                                    src={user.profileImage || null}
                                                                                    alt=""
                                                                                    className="w-[50px] h-[50px] rounded-full object-cover"
                                                                                />

                                                                                <div>

                                                                                    <h1 className="font-bold">

                                                                                        {user.firstName} {user.lastName}

                                                                                    </h1>

                                                                                    <p className="text-sm text-gray-500">

                                                                                        {user.email}

                                                                                    </p>

                                                                                </div>

                                                                            </div>
                                                                        ))
                                                                    }

                                                                </div>
                                                            )
                                                    }

                                                </div>
                                            )
                                        }

                                    </div>
                                )
                            })
                        }

                    </div>

                </div>

            </div>

        </>
    )
}

export default Jobs