"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function Header() {
    const { user, isLoading, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
            <div className="w-full max-w-none mx-0 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 select-none shrink-0 z-10 hover:opacity-90 transition-opacity">
                    <img src="/flag-us.png" alt="ORDER VITAL RECORDS" className="h-6 object-contain" />
                    <span className="text-base font-black tracking-tight text-[#0f172a] hidden sm:inline">
                        ORDER VITAL RECORDS
                    </span>
                </Link>

                {/* NAV BUTTONS */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 absolute left-1/2 -translate-x-1/2">
                    <Link href="/certificates" className="hover:text-[#2563eb] transition-colors">
                        Certificates
                    </Link>
                    <Link href="/#how-it-works" className="hover:text-[#2563eb] transition-colors">How It works</Link>
                    <Link href="/#states" className="hover:text-[#2563eb] transition-colors">Search States</Link>
                    <Link href="/#faq" className="hover:text-[#2563eb] transition-colors">Support</Link>
                    <Link href="/#benefits" className="hover:text-[#2563eb] transition-colors">Pricing</Link>
                    <Link href="/#contact" className="hover:text-[#2563eb] transition-colors">Contact</Link>
                </nav>

                {/* RIGHT BUTTONS / AUTH */}
                <div className="flex items-center gap-4 shrink-0 z-10">
                    <Link href="/form-flow" className="btn-primary py-2 px-4 text-xs font-bold shadow-xs">
                        Start Order &gt;
                    </Link>

                    {!isLoading && (
                        user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 text-xs font-bold text-[#0f172a] hover:text-[#2563eb] transition-colors bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer"
                                >
                                    <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{user.name.split(' ')[0]}</span>
                                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden py-1">
                                        <button 
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                logout();
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="text-xs font-bold text-slate-600 cursor-pointer hover:text-[#2563eb] transition-colors">
                                Log In &gt;
                            </Link>
                        )
                    )}
                </div>

            </div>
        </header>
    );
}
