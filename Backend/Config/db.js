import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Db connected successfully!");
    } catch (error) {
        console.log("MongoDB Connection Error -> ", error.message);
        throw error;
    }
};

export default connectDb;