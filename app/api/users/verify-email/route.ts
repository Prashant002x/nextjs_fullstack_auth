import { connectDB } from "@/dbConf/dbConfig";
import { NextRequest , NextResponse } from "next/server"
import User from "@/models/userModel";
import crypto from "crypto";


export async function POST(request:NextRequest){
    connectDB();
    try{
        const reqBody = await request.json();
        const {token} = reqBody;
        const hashedToken=crypto.createHash('sha256').update(token).digest('hex');
        const user =await User.findOne({verifyToken:hashedToken, verifyTokenExpiry:{$gt:Date.now()}})
        if(!user){
            return NextResponse.json({message:"Invalid or expired token"}, {status:400});
        }
        user.isVerified = true; 
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();



        return NextResponse.json({message:"Email verified successfully",success:true}, {status:200});
       

    }
    catch(error:any){
        console.log("Error in verifying email:",error.message);
        return NextResponse.json({message:"Error in verifying email"}, {status:500});
    }

}