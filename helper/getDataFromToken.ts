import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const getDataFromToken = async (request: NextRequest) => {
    try {
        // 1. Check if token exists
        const token = request.cookies.get('token')?.value || '';
        console.log("1. Token from cookie:", token); 
        
        if (!token) {
            console.log("-> Token is missing!");
            return null;
        }

        // 2. Check if secret exists
        const secretStr = process.env.SECRET_TOKEN;
        if (!secretStr) console.log("-> SECRET_TOKEN is missing in .env file!");
        
        const secret = new TextEncoder().encode(secretStr!);

        // 3. Verify
        const { payload } = await jwtVerify(token, secret);
        console.log("2. Verified Payload:", payload);
        
        return payload;
    }
    catch (error: any) {
        console.log("-> Error during verification:", error.message);
        return null;
    }
}