import {NextResponse} from 'next/server';

export async function POST(){

    try{
        const response = NextResponse.json({
            message: "Logout successful",
            success: true,
        });
        response.cookies.set("token","",
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                expires: new Date(0),
                sameSite: 'strict', 
            }
        )
        return response;
    }
    catch(error:any){
        return NextResponse.json({error:error.message},
            {status:500});
    }
}