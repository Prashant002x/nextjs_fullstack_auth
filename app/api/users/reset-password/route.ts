import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { connectDB } from "@/dbConf/dbConfig";
import { NextResponse,  NextRequest } from "next/server";
import crypto from "crypto";

export  async function POST(request:NextRequest){
    try{
        await connectDB();
        const reqBody = await request.json();
        const {token, password} = reqBody;
        console.log(reqBody);
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({forgotPasswordToken:hashedToken, forgotPasswordExpiry:{$gt:Date.now()}})
        console.log(user);
        if(!user){
            return NextResponse.json({message:"Invalid or expired token"}, {status:400})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();
        return NextResponse.json({message:"Password reset successfully",success:true}, {status:200})
    }
    catch(error:any){
        console.log("Error in resetting password:",error.message);
        return NextResponse.json({message:"Error in resetting password"}, {status:500})
    }
}




