'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

// 1. Rename your main logic component to "VerifyEmailContent"
function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [token, setToken] = useState("");
    const [showToken, setShowToken] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [verified, setVerified] = useState(false);

    // Memoized verification function
    const verifyToken = useCallback(async (tokenToVerify: string) => {
        if (!tokenToVerify) return;
        
        setLoading(true);
        setError("");

        try {
            const response = await axios.post('/api/users/verify-email', { token: tokenToVerify });
            
            if (response.data.success) {
                setVerified(true);
                toast.success(response.data.message);
                setTimeout(() => router.push('/login'), 2000);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "An error occurred during verification");
            setError(err.response?.data?.message || "An error occurred during verification");
        } finally {
            setLoading(false);
        }
    }, [router]);

    // Sync token from URL to state
    useEffect(() => {
        const tokenFromParams = searchParams.get('token');
        if (tokenFromParams) {
            setToken(tokenFromParams);
        } else {
            setError("No token found in URL");
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Email Verification</h1>
            
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md border border-gray-200">
                {/* Token Display Section */}
                <div className="mb-6">
                    <button 
                        onClick={() => setShowToken(!showToken)}
                        className="text-sm text-blue-600 underline mb-2 block"
                    >
                        {showToken ? "Hide Token" : "Show Token"}
                    </button>
                    
                    {showToken && (
                        <div className="p-2 bg-gray-100 rounded break-all text-xs font-mono border">
                            {token || "No token detected"}
                        </div>
                    )}
                </div>

                {/* Status Messages */}
                {loading && <p className="text-blue-500 mb-4 text-center">Verifying your email, please wait...</p>}
                
                {verified && (
                    <p className="text-green-600 mb-4 text-center font-medium">
                        ✅ Email verified successfully! Redirecting...
                    </p>
                )}

                {error && (
                    <div className="text-red-500 bg-red-50 p-3 rounded border border-red-200 mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Verification Action Button */}
                <button
                    onClick={() => verifyToken(token)}
                    disabled={loading || !token || verified}
                    className={`w-full py-2 px-4 rounded font-semibold transition-colors
                        ${loading || !token || verified 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                    {loading ? "Processing..." : "Verify Token"}
                </button>
            </div>
        </div>
    );
}

// 2. Create the default export that wraps the content in Suspense
export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading verification...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}