
import genToken from "../Config/token.js";
import User from "../Models/user.model.js";
import bcrypt from "bcryptjs"
export const  signUp = async (req,res)=>{
    try {
        let {firstName,lastName,userName,email,password} = req.body;
        let emailUser = await User.findOne({email})
        if(emailUser){
            return res.status(400).json({message:"email already exist! "})
        }
        let userNameUser = await User.findOne({userName})
        if(userNameUser){
            return res.status(400).json({message:"UserName already exist! "});
        }
        if(password.length<8){
            return res.status(400).json({message:"Password must be minimum 8 letters"})
        }

        let hashedPass = await bcrypt.hash(password,10);
        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password:hashedPass
        })
        let token = await genToken(user._id)
        res.cookie("token",token,{ // store jwt token in browser as cookie
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:process.env.NODE_ENVIORNMENT==="production"
        })

        return res.status(201).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error})
    }   
}

export const login = async (req,res)=>{
    try {
        let {email,password} = req.body;
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Username does not exists!"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Incorrect Password"});
        }
        let token = await genToken(user._id);
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:process.env.NODE_ENVIORNMENT==="production"
        })
        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error})
    }
}
export const logout = async (req,res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({message:"log out successfully!"})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error})
    }
}