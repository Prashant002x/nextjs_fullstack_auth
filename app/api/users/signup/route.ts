import { connectDB } from "@/dbConf/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import {NextResponse, NextRequest} from  'next/server';
import { signupSchema } from "@/lib/validation";
import {sendEmail} from "@/helper/mailer";

export async function POST(request: NextRequest){
    try{
        await connectDB();
        const reqBody = await request.json();
        const validation = signupSchema.safeParse(reqBody);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.format() }, 
                { status: 400 }
            );
        }
        const {username, email, password}=reqBody;

        console.log(reqBody);
        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({message:"User already exists"},
            {status:400});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
       const newUser = new User({
            username,
            email,
            password:hashedPassword
        });
       const savedUser = await newUser.save();
       const userResponse = savedUser.toObject();
        delete userResponse.password;

        //send Verification Email 
        await sendEmail({
            email: savedUser.email,
            emailType: "VERIFY_EMAIL",
            userId: savedUser._id,
        });


       return NextResponse.json({message:"User registered successfully",
        success:true,
        userResponse
       },
       {status:201});
        
    }
    catch(error:any ){
        return NextResponse.json({error:error.message},
            {status:500});

        }
}