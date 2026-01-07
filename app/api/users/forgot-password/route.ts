import { connectDB } from "@/dbConf/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helper/mailer"; 

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const reqBody = await request.json();
        const { email } = reqBody;

        // 1. Find the user by the provided email
        const user = await User.findOne({ email });

        if (!user) {
            // Safety tip: Sometimes it's better to say "Check your email" 
            // even if user isn't found to prevent email harvesting.
            return NextResponse.json(
                { message: "User with this email does not exist" },
                { status: 400 }
            );
        }

        // 2. Now you have the userId! Pass it to your helper.
        await sendEmail({
            email,
            emailType: "FORGOT_PASSWORD",
            userId: user._id
        });

        return NextResponse.json({
            message: "Reset link sent to your email",
            success: true
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}