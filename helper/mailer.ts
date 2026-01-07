import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
interface SendEmailParams {
    email: string;
    emailType: "VERIFY_EMAIL" | "FORGOT_PASSWORD";
    userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
    try {
        // 1. Generate a secure token
        const token = crypto.randomBytes(32).toString("hex");
        
        // Before Saving this token in DB, hash it first
        const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

        // 2. Update Database based on email type
        const expiryDate = Date.now() + 3600000; // 1 hour from now

        if (emailType === "VERIFY_EMAIL") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: expiryDate,
            });
        } else if (emailType === "FORGOT_PASSWORD") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordExpiry: expiryDate,
            });
        }

        // 3. Configure Transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // 4. Define dynamic values
        const isVerify = emailType === "VERIFY_EMAIL";
        const subject = isVerify ? "Verify your email" : "Reset your password";
        const actionPath = isVerify ? "verify-email" : "reset-password";
        const actionUrl = `${process.env.FRONTEND_URL}/${actionPath}?token=${token}`;
        console.log(actionUrl);
        // 5. Build the Email HTML with Copy-Paste Support
        const mailOptions = {
            from: '"NextAuth Support" <support@yourapp.com>',
            to: email,
            subject: subject,
            html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2>${subject}</h2>
                <p>Hello,</p>
                <p>Please click the button below to ${isVerify ? 'verify your account' : 'reset your password'}. This link is valid for 1 hour.</p>
                
                <a href="${actionUrl}" 
                   style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                   ${isVerify ? 'Verify Email' : 'Reset Password'}
                </a>

                <p style="margin-top: 30px;">If the button doesn't work, copy and paste the following link into your browser:</p>
                <p style="background: #f4f4f4; padding: 10px; border: 1px solid #ddd; word-break: break-all;">
                    ${actionUrl}
                </p>
                
                <p>If you did not request this, please ignore this email.</p>
            </div>
            `,
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
};