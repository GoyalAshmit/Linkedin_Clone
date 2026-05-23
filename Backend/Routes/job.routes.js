import express from "express";

import {
    addJob,
    getJobs,
    applyJob,
    cancelApplication
} from "../Controller/job.controller.js";

import isAuth from "../Middlewares/isAuth.js";

const router = express.Router();


// ADD JOB
router.post(
    "/add",
    isAuth,
    addJob
);


// GET JOBS
router.get(
    "/all",
    isAuth,
    getJobs
);


// APPLY JOB
router.put(
    "/apply/:id",
    isAuth,
    applyJob
);


// CANCEL APPLICATION
router.put(
    "/cancel/:id",
    isAuth,
    cancelApplication
);

export default router;