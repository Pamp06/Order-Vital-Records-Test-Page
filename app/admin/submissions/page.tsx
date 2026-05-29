"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Submission {
    id: string;
    userInfo: {
        applicantName: string;
        applicantEmail: string;
        applicantPhone: string;
        relationship: string;
        subjectName: string;
        fatherName?: string;
        motherName?: string;
    };
    certType: string;
    shippingDetails: {
        shipStreet: string;
        shipCity: string;
        shipState: string;
        shipZip: string;
        shipCountry: string;
        shippingMethod: string;
        processingSpeed: string;
    };
    additionalDetails: {
        reason: string;
        eventDay: string;
        eventMonth: string;
        eventYear: string;
        eventCity: string;
        eventState: string;
        fees: {
            stateFee: number;
            platformFee: number;
            shippingCost: number;
            processingCost: number;
            total: number;
        };
    };
    pdfPath: string;
    createdAt: string;
}

export default function AdminSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [certFilter, setCertFilter] = useState('All');
    const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

    // Fetch submissions with search & filter parameters
    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (searchTerm) queryParams.set('q', searchTerm);
            if (certFilter && certFilter !== 'All') queryParams.set('certType', certFilter);

            const response = await fetch(`/api/submissions?${queryParams.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setSubmissions(data.submissions || []);
            }
        } catch (error) {
            console.error("Failed to load submissions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchSubmissions();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, certFilter]);

    // Format Dates
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Quick Stats Calculation
    const stats = {
        total: submissions.length,
        birth: submissions.filter(s => s.certType === 'Birth').length,
        marriage: submissions.filter(s => s.certType === 'Marriage').length,
        divorce: submissions.filter(s => s.certType === 'Divorce').length,
        death: submissions.filter(s => s.certType === 'Death').length,
    };

    // Styling helpers for Certificate Type Badges
    const getBadgeStyle = (type: string) => {
        switch (type) {
            case 'Birth':
                return 'bg-blue-50 text-blue-700 border-blue-200/60';
            case 'Marriage':
                return 'bg-purple-50 text-purple-700 border-purple-200/60';
            case 'Divorce':
                return 'bg-amber-50 text-amber-700 border-amber-200/60';
            case 'Death':
                return 'bg-slate-100 text-slate-700 border-slate-300/60';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-200/60';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-[#0f172a] font-sans antialiased pb-20">
            {/* TOP DECORATIVE BANNER */}
            <div className="w-full bg-linear-to-r from-slate-900 via-slate-800 to-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
                                SECURE ADMIN DATABASE
                            </span>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[11px] text-slate-300 font-semibold">SQLite Online</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight font-sans">
                            Vital Records Submissions
                        </h1>
                        <p className="text-slate-300 text-xs mt-1">
                            Browse, inspect, and manage mock payment checkouts and generated receipts securely.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/form-flow" className="bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold py-2.5 px-4 rounded-xl transition-all hover:scale-[1.02] flex items-center gap-2">
                            &lt; Return to Form Flow
                        </Link>
                        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/10 hover:scale-[1.02]">
                            Home Page
                        </Link>
                    </div>
                </div>
            </div>

            {/* DASHBOARD BODY */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">

                {/* QUICK STATS CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all hover:shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Submissions</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-black text-slate-800">{stats.total}</span>
                            <span className="text-xs font-semibold text-slate-400">records</span>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all hover:shadow-sm border-l-4 border-l-blue-500">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Birth Certificates</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-black text-blue-600">{stats.birth}</span>
                            <span className="text-xs font-semibold text-slate-400">saved</span>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all hover:shadow-sm border-l-4 border-l-purple-500">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Marriage Records</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-black text-purple-600">{stats.marriage}</span>
                            <span className="text-xs font-semibold text-slate-400">saved</span>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all hover:shadow-sm border-l-4 border-l-amber-500">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Divorce Decrees</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-black text-amber-600">{stats.divorce}</span>
                            <span className="text-xs font-semibold text-slate-400">saved</span>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all hover:shadow-sm border-l-4 border-l-slate-400 col-span-2 lg:col-span-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Death Records</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-black text-slate-700">{stats.death}</span>
                            <span className="text-xs font-semibold text-slate-400">saved</span>
                        </div>
                    </div>
                </div>

                {/* FILTERS & SEARCH */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search bar */}
                    <div className="relative grow max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by ID, Applicant, or Zip..."
                            className="block w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-slate-400"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-slate-400 hover:text-slate-600"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
                        {['All', 'Birth', 'Marriage', 'Divorce', 'Death'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setCertFilter(filter)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${certFilter === filter
                                    ? 'bg-white text-blue-600 shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* RESULTS CONTAINER */}
                <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                    {loading ? (
                        <div className="py-20 text-center space-y-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Querying SQLite Database...</p>
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="py-20 text-center max-w-sm mx-auto space-y-3">
                            <div className="w-12 h-12 bg-slate-100 border border-slate-200/60 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                📭
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">No Submissions Found</h3>
                                <p className="text-slate-500 text-xs mt-1">
                                    No records match your filters, or no form flow submissions have been processed yet.
                                </p>
                            </div>
                            <Link href="/form-flow" className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-md shadow-blue-500/10">
                                Launch Checkout &gt;
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-200">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Submission ID</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Certificate Type</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Applicant Info</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Subject & Location</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Submission Date</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {submissions.map((sub) => (
                                        <tr
                                            key={sub.id}
                                            className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedSub?.id === sub.id ? 'bg-blue-50/20' : ''}`}
                                            onClick={() => setSelectedSub(sub)}
                                        >
                                            {/* ID */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-2.5 py-1">
                                                    {sub.id}
                                                </span>
                                            </td>
                                            {/* Cert type */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-[10px] font-extrabold border rounded-full px-3 py-0.5 select-none ${getBadgeStyle(sub.certType)}`}>
                                                    {sub.certType}
                                                </span>
                                            </td>
                                            {/* Applicant Info */}
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-bold text-slate-800">{sub.userInfo.applicantName}</div>
                                                <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{sub.userInfo.applicantEmail}</div>
                                            </td>
                                            {/* Subject & State */}
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-semibold text-slate-700">{sub.userInfo.subjectName}</div>
                                                <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                                                    {sub.additionalDetails.eventCity}, {sub.additionalDetails.eventState}
                                                </div>
                                            </td>
                                            {/* Date */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-xs font-semibold text-slate-500">
                                                    {formatDate(sub.createdAt)}
                                                </span>
                                            </td>
                                            {/* Actions */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedSub(sub)}
                                                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all"
                                                    >
                                                        Details
                                                    </button>
                                                    {sub.pdfPath ? (
                                                        <a
                                                            href={sub.pdfPath}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all flex items-center gap-1.5"
                                                        >
                                                            <span>PDF</span>
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                        </a>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400 font-semibold italic py-1.5 px-3">No PDF</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* DETAIL SLIDE-OUT DRAWER */}
            {selectedSub && (
                <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Overlay backdrop */}
                        <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                            onClick={() => setSelectedSub(null)}
                        ></div>

                        {/* Drawer body */}
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="pointer-events-auto w-screen max-w-xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-200">

                                {/* Drawer Header */}
                                <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[9px] font-extrabold border rounded-full px-2.5 py-0.2 select-none ${getBadgeStyle(selectedSub.certType)}`}>
                                                {selectedSub.certType}
                                            </span>
                                            <span className="text-slate-400 text-xs font-semibold">Ordered: {formatDate(selectedSub.createdAt)}</span>
                                        </div>
                                        <h2 className="text-lg font-black tracking-tight flex items-center gap-1.5">
                                            Record Detail: <span className="text-blue-400">{selectedSub.id}</span>
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedSub(null)}
                                        className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer text-lg font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Drawer Content Scroll */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">

                                    {/* APPLICANT CONTACT */}
                                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                                            Applicant Contact & Relationship
                                        </h3>
                                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Applicant Name</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSub.userInfo.applicantName}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Relationship to Holder</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSub.userInfo.relationship}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Email Address</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSub.userInfo.applicantEmail}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Mobile Phone</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSub.userInfo.applicantPhone}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RECORD DETAILS */}
                                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                                            Certificate Subject & Event Details
                                        </h3>
                                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                            <div className="col-span-2">
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Subject Full Name</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSub.userInfo.subjectName}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Event State</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSub.additionalDetails.eventState}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Event City / County</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSub.additionalDetails.eventCity}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Date of Event</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">
                                                    {selectedSub.additionalDetails.eventMonth} {selectedSub.additionalDetails.eventDay}, {selectedSub.additionalDetails.eventYear}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Reason for Request</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSub.additionalDetails.reason}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Father's Full Name</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSub.userInfo.fatherName || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Mother's Maiden Name</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSub.userInfo.motherName || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SHIPPING & METHODS */}
                                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                                            Shipping & Delivery Location
                                        </h3>
                                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                            <div className="col-span-2">
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Street Address</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSub.shippingDetails.shipStreet}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">City, State & Zip</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">
                                                    {selectedSub.shippingDetails.shipCity}, {selectedSub.shippingDetails.shipState} {selectedSub.shippingDetails.shipZip}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Country</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSub.shippingDetails.shipCountry}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Shipping Speed Method</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5 capitalize">{selectedSub.shippingDetails.shippingMethod} Delivery</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400 font-semibold text-[10px] uppercase">Processing Speed</div>
                                                <div className="text-xs font-bold text-slate-800 mt-0.5 capitalize">{selectedSub.shippingDetails.processingSpeed} Speed</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COST BREAKDOWN */}
                                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                                            Order Cost Breakdown
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between font-medium">
                                                <span className="text-slate-500">{selectedSub.certType} State Certificate Fee:</span>
                                                <span className="text-slate-800 font-bold">${selectedSub.additionalDetails.fees?.stateFee.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between font-medium">
                                                <span className="text-slate-500">Document Prep & Management Fee:</span>
                                                <span className="text-slate-800 font-bold">${selectedSub.additionalDetails.fees?.platformFee.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between font-medium">
                                                <span className="text-slate-500">Shipping Delivery Fee:</span>
                                                <span className="text-slate-800 font-bold">${selectedSub.additionalDetails.fees?.shippingCost.toFixed(2)}</span>
                                            </div>
                                            {selectedSub.additionalDetails.fees?.processingCost > 0 && (
                                                <div className="flex justify-between font-medium">
                                                    <span className="text-slate-500">Expedited Fast-Track Processing speed:</span>
                                                    <span className="text-slate-800 font-bold">${selectedSub.additionalDetails.fees?.processingCost.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-black">
                                                <span className="text-[#0b2545] uppercase">Total Charged Amount</span>
                                                <span className="text-blue-600 text-base">${selectedSub.additionalDetails.fees?.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Drawer Footer Actions */}
                                <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-200">
                                    {selectedSub.pdfPath && (
                                        <a
                                            href={selectedSub.pdfPath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl text-center shadow-md shadow-blue-500/10 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download / Open Receipt PDF
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setSelectedSub(null)}
                                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-5 py-3 rounded-xl transition-all cursor-pointer"
                                    >
                                        Close Details
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
