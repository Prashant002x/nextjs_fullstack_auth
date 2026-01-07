'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [token, setToken] = useState("");
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
            const errorMsg = err.response?.data?.message || "An error occurred during verification";
            toast.error(errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    }, [router]);

    // Sync token from URL to state
    useEffect(() => {
        const tokenFromParams = searchParams.get('token');
        if (tokenFromParams) {
            setToken(tokenFromParams);
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Verify Email</h1>
                    <p className="text-slate-500 mt-2">
                        Check your email for the verification link.
                    </p>
                </div>

                {/* Token Display (Improved Visibility) */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Verification Token
                    </label>
                    <input 
                        type="text" 
                        value={token || ""} 
                        readOnly
                        placeholder="No token detected..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {!token && (
                        <p className="text-xs text-amber-500 mt-2">
                            ⚠️ No token found in the URL.
                        </p>
                    )}
                </div>

                {/* Status Messages */}
                {verified && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                        <p className="text-green-700 font-semibold text-lg flex items-center justify-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Verified Successfully!
                        </p>
                        <p className="text-green-600 text-sm mt-1">Redirecting to login...</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                        <p className="text-red-700 font-semibold">Verification Failed</p>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={() => verifyToken(token)}
                    disabled={loading || !token || verified}
                    className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98]
                        ${loading || !token || verified 
                            ? "bg-slate-300 cursor-not-allowed shadow-none" 
                            : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200"}`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                        </span>
                    ) : "Verify Email"}
                </button>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-50 text-slate-600">Loading verification...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}