"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import React, { useState } from "react";

export default function ProfilePage() {
    const router = useRouter();
    // 1. Define the type for the data state (string)
    const [data, setData] = useState<string>("nothing");
    // 2. Define the type for loading state (boolean)
    const [loading, setLoading] = useState<boolean>(false);

    const getUserDetails = async () => {
        try {
            const response = await axios.get('/api/users/me');
            console.log("User data:", response.data);
            // Typescript will infer data as any from axios unless typed, 
            // but we expect a string ID here.
            setData(response.data.data._id); 
        } catch (error: any) {
            // In TS, error is 'unknown' by default. We cast to 'any' 
            // to access .message safely without complex type guards.
            console.log(error.message);
            toast.error("Failed to get user details");
        }
    }

    const logout = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/users/logout');
            toast.success(response.data.message);
            router.push('/login');
        } catch (error: any) {
            console.log("Logout failed", error.message);
            toast.error("Logout failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
            <h1 className='text-2xl font-bold mb-4'>User Profile</h1>
            <hr />
            
            <p className="p-4">Profile Data: 
                {data === "nothing" ? (
                    "Nothing"
                ) : (
                    <Link 
                        className="text-blue-500 font-bold ml-2 hover:underline" 
                        href={`/profile/${data}`}
                    >
                        {data}
                    </Link>
                )}
            </p>

            <hr />

            <button 
                onClick={getUserDetails}
                className="bg-green-800 mt-4 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Get User Details
            </button>

            <button 
                onClick={logout} 
                disabled={loading} 
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-bold"
            >
                {loading ? "Logging out..." : "Logout"}
            </button>
        </div>
    );
}