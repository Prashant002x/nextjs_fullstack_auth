import { getDataFromToken} from "@/helper/getDataFromToken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import User from "@/models/userModel";
import { connectDB } from "@/dbConf/dbConfig";


export async function GET(request:NextRequest){
    await connectDB();
    try{
        const userID = await getDataFromToken(request);
        if(!userID){
            return NextResponse.json({message:"User not authenticated"}, {status:401});
        }
       const user = await  User.findOne({_id:userID?.id}).select('-password');
       if(!user){
        return NextResponse.json({message:"User not found"}, {status:404});
       }
        return NextResponse.json(
            {message:"User data fetched successfully",
             data: user},
            {status:200},
        );
    }
    catch(error:any){
        console.log("Error in fetching user data:",error.message);
        return NextResponse.json({message:"Error in fetching user data"}, {status:500});
    }

}

