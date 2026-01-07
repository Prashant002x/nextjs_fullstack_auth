import {NextResponse , NextRequest} from 'next/server';
import { connectDB } from '@/dbConf/dbConfig';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});
export async function POST(request: NextRequest){
    try{
        await connectDB();
        const reqBody = await request.json();
        const parseResult = LoginSchema.safeParse(reqBody);
        if (!parseResult.success) {
            
            return NextResponse.json({ message: "Validation errors" }, { status: 400 });
        }
        const {email, password} = reqBody;
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return NextResponse.json({message:"User not found"},{status:400});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return NextResponse.json({message:"Invalid Email or password"},{status:400});
        }
        // create token data 
        const tokenData={
            id:user._id,
            email:user.email,
            username:user.username,
        }
        const token = jwt.sign(tokenData, process.env.SECRET_TOKEN!, {expiresIn:'1h'});
        const response= NextResponse.json({
            message:"Login successful",
            success:true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60, 
            path: "/",
        });
        return response;
    }
    catch (error) {
        console.log("Error logging in user:", error);
        return NextResponse.json({message:"Error logging in user"},{status:500});
    }
}