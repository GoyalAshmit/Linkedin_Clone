import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./Routes/user.routes.js";
import postRouter from "./Routes/post.routes.js";
dotenv.config()
let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
let port = process.env.PORT;
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)

app.get("/",function(req,res){
    res.send("Hello");
})
app.listen(port,()=>{
    connectDb();
    console.log(`running on ${port}`)
})