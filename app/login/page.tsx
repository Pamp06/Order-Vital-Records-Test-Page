"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import Header from '../../components/Header';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { refreshUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin ? { email, password } : { name, email, password };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                await refreshUser();
                // If successful, redirect to form-flow
                router.push('/form-flow');
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err: any) {
            setError(err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-[#e0ebf8]/40 via-[#f4f8fc]/20 to-[#f4f8fc]/60 text-[#0f172a] font-sans antialiased flex flex-col">
            <Header />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6 relative overflow-hidden">

                    {/* Background glow decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 blur-[40px] rounded-full pointer-events-none" />

                    <div className="text-center space-y-2 relative z-10">
                        <img src="/flag-us.png" alt="US Flag" className="h-8 object-contain mx-auto mb-2" />
                        <h2 className="text-2xl font-black text-[#0b2545] tracking-tight">
                            {isLogin ? 'Welcome Back' : 'Create an Account'}
                        </h2>
                        <p className="text-xs font-semibold text-slate-500">
                            {isLogin
                                ? 'Log in to securely manage your vital record orders.'
                                : 'Sign up to start and track your certified documents.'}
                        </p>
                    </div>

                    <div className="flex bg-slate-100 rounded-lg p-1 relative z-10">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${isLogin ? 'bg-white shadow-xs text-[#2563eb]' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${!isLogin ? 'bg-white shadow-xs text-[#2563eb]' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Register
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg border border-red-100 text-center relative z-10">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 mt-2 disabled:opacity-70 flex justify-center items-center"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-2 border-t border-slate-100 relative z-10">
                        <Link href="/" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                            &lt; Back to Home
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}