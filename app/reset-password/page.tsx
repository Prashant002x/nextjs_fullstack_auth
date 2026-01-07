'use client';

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react"; // Added Suspense import
import toast from "react-hot-toast";

// 1. I renamed your main logic function to "ResetPasswordContent"
function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        if (password.length >= 6 && password === confirmPassword) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [password, confirmPassword]);

    const onResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Invalid or missing token");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('/api/users/reset-password', { token, password });
            console.log(response);
            toast.success("Password reset successful!");
            router.push('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                
                {/* Header Icon & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Set new password</h1>
                    <p className="text-slate-500 mt-2">
                        Must be at least 6 characters.
                    </p>
                </div>

                <form onSubmit={onResetPassword} className="space-y-5">
                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all text-slate-900"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:bg-white outline-none transition-all text-slate-900 
                                ${confirmPassword && password !== confirmPassword ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'}`}
                            required
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                    </div>

                    {/* Verification Action Button */}
                    <button
                        type="submit"
                        disabled={buttonDisabled || loading || !token}
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98]
                            ${buttonDisabled || loading || !token 
                                ? "bg-slate-300 cursor-not-allowed shadow-none" 
                                : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200"}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </span>
                        ) : "Reset Password"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link 
                        href="/login" 
                        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

// 2. This is the new Wrapper Component that fixes the build error
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}