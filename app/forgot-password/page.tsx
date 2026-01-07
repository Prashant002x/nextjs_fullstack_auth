'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const onSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('/api/users/forgot-password', { email });
            toast.success("Reset link sent to your email!");
            setIsSent(true); // Show a success state UI
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Forgot password?</h1>
                    <p className="text-slate-500 mt-2">
                        {isSent 
                            ? "Check your inbox! We've sent instructions to " + email 
                            : "No worries, we'll send you reset instructions."}
                    </p>
                </div>

                {!isSent ? (
                    <form onSubmit={onSendEmail} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all text-slate-900"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email}
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98]
                                ${loading || !email 
                                    ? "bg-slate-300 cursor-not-allowed shadow-none" 
                                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200"}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending Link...
                                </span>
                            ) : "Reset Password"}
                        </button>
                    </form>
                ) : (
                    <button 
                        onClick={() => setIsSent(false)}
                        className="w-full py-3 rounded-xl font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all"
                    >
                        Try another email
                    </button>
                )}

                {/* Footer Link */}
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