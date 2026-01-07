'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault(); 
        try {
            setLoading(true);
            const response = await axios.post('/api/users/login', user);
            console.log('Login success', response.data);
            
            router.push('/profile/'); 
            
        } catch (error: any) {
            console.log('Login failed', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    {loading ? "Logging in..." : "Login"}
                </h1>
                
                <hr className="mb-6 border-gray-200" />

                <form onSubmit={onLogin} className="flex flex-col gap-4">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder="name@company.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            {/* Updated: Forgot Password Link */}
                            <Link 
                                href="/forgot-password" 
                                className="text-xs text-blue-600 hover:underline transition-all"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            required
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={buttonDisabled || loading}
                        className={`w-full mt-4 py-2 rounded-lg font-semibold transition-colors
                        ${buttonDisabled || loading 
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}`}
                    >
                        {loading ? "Processing..." : "Login"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                            Sign up now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}