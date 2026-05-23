import Job from "../Models/job.model.js";


// ADD JOB
export const addJob = async (req, res) => {

    try {

        let { title, company, location, description, salary } = req.body;

        let job = await Job.create({

            title,
            company,
            location,
            description,
            salary,

            createdBy: req.userId

        });

        res.status(201).json(job);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// GET ALL JOBS
export const getJobs = async (req, res) => {

    try {

        let jobs = await Job.find()
            .populate("createdBy", "firstName lastName profileImage")
            .populate("applicants", "firstName lastName profileImage email");

        res.json(jobs);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// APPLY JOB
export const applyJob = async (req, res) => {

    try {

        let job = await Job.findById(req.params.id);

        if (!job) {

            return res.status(404).json({
                message: "Job not found"
            });

        }

        // ALREADY APPLIED
        if (job.applicants.includes(req.userId)) {

            return res.status(400).json({
                message: "Already Applied"
            });

        }

        job.applicants.push(req.userId);

        await job.save();

        res.json({
            message: "Applied Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// CANCEL APPLICATION
export const cancelApplication = async (req, res) => {

    try {

        let job = await Job.findById(req.params.id);

        if (!job) {

            return res.status(404).json({
                message: "Job not found"
            });

        }

        job.applicants = job.applicants.filter(

            (user) => user.toString() !== req.userId

        );

        await job.save();

        res.json({
            message: "Application Cancelled"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};