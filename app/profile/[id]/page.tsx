import React from 'react';

type Props= {
    params:Promise<{
        id:string;
    }>;
}
export default async function UserProfilePage({params}:Props){
    const {id}= await params;
    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
            <h1 className='text-2xl font-bold mb-4'>User Profile</h1>
            <p>{id}</p>
        </div>
    );
}