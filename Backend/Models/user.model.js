import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    profileImage: {
        type: String,
        default: ""
    },

    coverImage: {
        type: String,
        default: ""
    },

    headline: {
        type: String,
        default: "Engineering Student at Chitkara University | Learning Full-Stack Development"
    },

    skills: [
        { type: String }
    ],

    education: [
        {
            college: { type: String },
            degree: { type: String },
            fieldOfStudy: { type: String }
        }
    ],

    location: {
        type: String,
        default: "Mandi Dabwali"
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },

    experience: [
        {
            title: { type: String },
            company: { type: String },
            description: { type: String }
        }
    ],

    // CONNECTIONS
    connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    // RECEIVED REQUESTS
    connectionRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    // SENT REQUESTS
    sentRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;