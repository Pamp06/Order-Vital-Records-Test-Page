"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { useAuth } from '../../components/AuthProvider';

export default function BirthFlowPage() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionDetails, setSubmissionDetails] = useState<{
        id: string;
        date: string;
        pdfBlobUrl: string | null;
    } | null>(null);

    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    // FORM STATE
    const [formData, setFormData] = useState({
        certType: "Birth",
        eventState: "TN",
        reason: "Passport",
        applicantName: "",
        applicantEmail: "",
        applicantPhone: "",

        relationship: "Self",
        subjectName: "",
        eventDay: "15",
        eventMonth: "May",
        eventYear: "1995",
        eventCity: "",
        fatherName: "",
        motherName: "",

        shipStreet: "",
        shipCity: "",
        shipState: "TN",
        shipZip: "",
        shipCountry: "United States",
        shippingMethod: "standard",
        processingSpeed: "standard",

        cardName: "",
        cardNumber: "",
        cardExpiry: "",
        cardCvc: "",
        agreedToTerms: false
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const type = params.get("type");
            const state = params.get("state");

            if (type) {
                const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
                if (["Birth", "Marriage", "Divorce", "Death"].includes(formattedType)) {
                    setFormData(prev => ({ ...prev, certType: formattedType }));
                }
            }
            if (state) {
                setFormData(prev => ({ ...prev, eventState: state.toUpperCase() }));
            }
        }
    }, []);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    // COST CALCULATOR
    const stateCertificateFee = 20.00;
    const platformFee = 19.99;

    const getShippingCost = () => {
        return formData.shippingMethod === "express" ? 45.00 : 15.00;
    };

    const getProcessingCost = () => {
        return formData.processingSpeed === "expedited" ? 25.00 : 0.00;
    };

    const totalFee = stateCertificateFee + platformFee + getShippingCost() + getProcessingCost();

    const getCertTypeName = () => {
        if (formData.certType === "Birth") return "Birth Certificate";
        if (formData.certType === "Marriage") return "Marriage Record";
        if (formData.certType === "Divorce") return "Divorce Decree";
        if (formData.certType === "Death") return "Death Record";
        return "Vital Record";
    };

    const getStepTitle = () => {
        if (step === 1) return "Applicant & Request";
        if (step === 2) return "Record Details";
        if (step === 3) return "Shipping & Speed";
        if (step === 4) return "Checkout";
        return "Order Confirmed";
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // 1. Generate unique submission ID
            const randomId = Math.floor(10000 + Math.random() * 90000);
            const subId = `OVR-2026-${randomId}`;

            // 2. Format submission date
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            const subDate = new Date().toLocaleDateString('en-US', options);

            // 3. Request PDF generation
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submissionId: subId,
                    submissionDate: subDate,
                    ...formData,
                    fees: {
                        stateFee: stateCertificateFee,
                        platformFee: platformFee,
                        shippingCost: getShippingCost(),
                        processingCost: getProcessingCost(),
                        total: totalFee
                    }
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate receipt PDF");
            }

            // 4. Get response blob and create temporary download URL
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            // 5. Trigger download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `Receipt-${subId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 6. Set submission details and move to success step
            setSubmissionDetails({
                id: subId,
                date: subDate,
                pdfBlobUrl: blobUrl
            });

            setStep(5);
        } catch (error) {
            console.error("Submission error:", error);
            alert("There was an error processing your order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReDownload = () => {
        if (submissionDetails?.pdfBlobUrl) {
            const link = document.createElement('a');
            link.href = submissionDetails.pdfBlobUrl;
            link.download = `Receipt-${submissionDetails.id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-500 animate-pulse">Checking credentials...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-[#e0ebf8]/40 via-[#f4f8fc]/20 to-[#f4f8fc]/60 text-[#0f172a] font-sans antialiased pb-20">

            {/* HEADER/NAVBAR */}
            <Header />

            {/* FLOW CONTENT AREA */}
            <div className="max-w-4xl mx-auto px-4 pt-12 space-y-8 relative z-10">
                {step < 5 && (
                    <div className="max-w-xl mx-auto flex items-center justify-between relative px-2">
                        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0">
                            <div
                                className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
                                style={{ width: `${Math.min((step - 1) * 33.33, 100)}%` }}
                            />
                        </div>

                        {[
                            { id: 1, label: "Applicant & Request" },
                            { id: 2, label: "Record Details" },
                            { id: 3, label: "Shipping & Speed" },
                            { id: 4, label: "Review & Checkout" }
                        ].map((s) => {
                            const isCompleted = step > s.id;
                            const isActive = step === s.id;

                            return (
                                <div key={s.id} className="relative z-10 flex items-center">
                                    {isActive ? (
                                        <div className="bg-white border-2 border-blue-500 rounded-full shadow-md py-1.5 px-3 flex items-center gap-2 transition-all duration-300">
                                            <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-black">
                                                {s.id}
                                            </span>
                                            <span className="text-xs font-black text-blue-500 whitespace-nowrap hidden sm:inline">
                                                {s.label}
                                            </span>
                                            <span className="text-xs font-black text-blue-500 whitespace-nowrap sm:hidden">
                                                Active
                                            </span>
                                        </div>
                                    ) : isCompleted ? (
                                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md font-bold text-sm cursor-pointer transition-all hover:scale-105" onClick={() => setStep(s.id)}>
                                            ✓
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs shadow-xs">
                                            {s.id}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* SLIDING FORM CONTAINER */}
                <div className="overflow-hidden w-full bg-transparent">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${(step - 1) * 20}%)`, width: '500%' }}
                    >

                        {/* STEP 1 APPLICANT INFO & REQUEST TYPE */}
                        <div className={`w-1/5 shrink-0 px-2 sm:px-4 space-y-8 transition-all duration-500 delay-100 ${step === 1 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
                            <div className="text-center space-y-1">
                                <h2 className="text-2xl font-black text-[#0b2545] tracking-tight">Applicant Info & Request Type</h2>
                                <p className="text-slate-500 text-xs font-medium">Define your request details and your contact information</p>
                            </div>

                            <div className="space-y-6 max-w-2xl mx-auto text-[#0f172a]">

                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                                        REQUEST DETAILS
                                    </span>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wide leading-none mb-1">
                                                Certificate Type
                                            </label>
                                            <select
                                                value={formData.certType}
                                                onChange={(e) => handleInputChange("certType", e.target.value)}
                                                className="w-full bg-transparent text-xs font-semibold text-[#0b2545] outline-hidden cursor-pointer"
                                            >
                                                <option value="Birth">Birth Certificate</option>
                                                <option value="Marriage">Marriage Certificate</option>
                                                <option value="Divorce">Divorce Certificate</option>
                                                <option value="Death">Death Certificate</option>
                                            </select>
                                        </div>

                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wide leading-none mb-1">
                                                State where event occurred
                                            </label>
                                            <select
                                                value={formData.eventState}
                                                onChange={(e) => handleInputChange("eventState", e.target.value)}
                                                className="w-full bg-transparent text-xs font-semibold text-[#0b2545] outline-hidden cursor-pointer">
                                                <option value="AL">Alabama</option>
                                                <option value="AK">Alaska</option>
                                                <option value="AZ">Arizona</option>
                                                <option value="AR">Arkansas</option>
                                                <option value="CA">California</option>
                                                <option value="CO">Colorado</option>
                                                <option value="CT">Connecticut</option>
                                                <option value="DE">Delaware</option>
                                                <option value="FL">Florida</option>
                                                <option value="GA">Georgia</option>
                                                <option value="HI">Hawaii</option>
                                                <option value="ID">Idaho</option>
                                                <option value="IL">Illinois</option>
                                                <option value="IN">Indiana</option>
                                                <option value="IA">Iowa</option>
                                                <option value="KS">Kansas</option>
                                                <option value="KY">Kentucky</option>
                                                <option value="LA">Louisiana</option>
                                                <option value="ME">Maine</option>
                                                <option value="MD">Maryland</option>
                                                <option value="MA">Massachusetts</option>
                                                <option value="MI">Michigan</option>
                                                <option value="MN">Minnesota</option>
                                                <option value="MS">Mississippi</option>
                                                <option value="MO">Missouri</option>
                                                <option value="MT">Montana</option>
                                                <option value="NE">Nebraska</option>
                                                <option value="NV">Nevada</option>
                                                <option value="NH">New Hampshire</option>
                                                <option value="NJ">New Jersey</option>
                                                <option value="NM">New Mexico</option>
                                                <option value="NY">New York</option>
                                                <option value="NC">North Carolina</option>
                                                <option value="ND">North Dakota</option>
                                                <option value="OH">Ohio</option>
                                                <option value="OK">Oklahoma</option>
                                                <option value="OR">Oregon</option>
                                                <option value="PA">Pennsylvania</option>
                                                <option value="RI">Rhode Island</option>
                                                <option value="SC">South Carolina</option>
                                                <option value="SD">South Dakota</option>
                                                <option value="TN">Tennessee</option>
                                                <option value="TX">Texas</option>
                                                <option value="UT">Utah</option>
                                                <option value="VT">Vermont</option>
                                                <option value="VA">Virginia</option>
                                                <option value="WA">Washington</option>
                                                <option value="WV">West Virginia</option>
                                                <option value="WI">Wisconsin</option>
                                                <option value="WY">Wyoming</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Reason for Request</label>
                                        <select
                                            value={formData.reason}
                                            onChange={(e) => handleInputChange("reason", e.target.value)}
                                            className="w-full bg-transparent text-xs font-semibold text-[#0b2545] outline-hidden cursor-pointer"
                                        >
                                            <option value="Passport">Passport</option>
                                            <option value="Employment">Employment</option>
                                            <option value="Social Security">Social Security</option>
                                            <option value="Legal Proceedings">Legal Proceedings</option>
                                            <option value="Genealogy">Genealogy</option>
                                        </select>
                                    </div>
                                </div>

                                {/* APPLICANT CONTACT */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                                        APPLICANT CONTACT DETAILS
                                    </span>

                                    <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.applicantName}
                                            onChange={(e) => handleInputChange("applicantName", e.target.value)}
                                            placeholder="Your current full name"
                                            className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                        />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.applicantEmail}
                                                onChange={(e) => handleInputChange("applicantEmail", e.target.value)}
                                                placeholder="your@email.com"
                                                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                                required
                                            />
                                        </div>
                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Mobile Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.applicantPhone}
                                                onChange={(e) => handleInputChange("applicantPhone", e.target.value)}
                                                placeholder="(123) 456-7890"
                                                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        disabled
                                        className="border border-slate-200 bg-white text-xs font-bold text-slate-300 px-6 py-2.5 rounded-xl cursor-not-allowed"
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={!formData.applicantName || !formData.applicantEmail || !formData.applicantPhone}
                                        className={`px-8 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md ${formData.applicantName && formData.applicantEmail && formData.applicantPhone
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-blue-500/10'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                            }`}
                                    >
                                        Continue &gt;
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* STEP 2: RECORD SUBJECT DETAILS */}
                        <div className={`w-1/5 shrink-0 px-2 sm:px-4 space-y-8 transition-all duration-500 delay-100 ${step === 2 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
                            <div className="text-center space-y-1">
                                <h2 className="text-2xl font-black text-[#0b2545] tracking-tight">Record Subject Details</h2>
                                <p className="text-slate-500 text-xs font-medium">Add details of the person named on the original certificate</p>
                            </div>

                            <div className="space-y-6 max-w-2xl mx-auto text-[#0f172a]">

                                {/* SUBJECT INFORMATION */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                                        SUBJECT INFORMATION
                                    </span>

                                    <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Relationship to Record Holder</label>
                                        <select
                                            value={formData.relationship}
                                            onChange={(e) => handleInputChange("relationship", e.target.value)}
                                            className="w-full bg-transparent text-xs font-semibold text-[#0b2545] outline-hidden cursor-pointer"
                                        >
                                            <option value="Self">Self</option>
                                            <option value="Parent">Parent</option>
                                            <option value="Child">Child</option>
                                            <option value="Spouse">Spouse</option>
                                        </select>
                                    </div>

                                    <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">
                                            {formData.certType === "Birth" ? "Subject's Full Birth/Maiden Name" : "Subject's Full Name"}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subjectName}
                                            onChange={(e) => handleInputChange("subjectName", e.target.value)}
                                            placeholder="Name appearing on original record"
                                            className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                        />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Exact Event City/County</label>
                                            <input
                                                type="text"
                                                value={formData.eventCity}
                                                onChange={(e) => handleInputChange("eventCity", e.target.value)}
                                                placeholder="City or County of event"
                                                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Date of Event</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <select
                                                    value={formData.eventDay}
                                                    onChange={(e) => handleInputChange("eventDay", e.target.value)}
                                                    className="border border-slate-200 rounded-lg p-2 bg-white text-xs font-bold text-[#0b2545] outline-hidden cursor-pointer"
                                                >
                                                    {Array.from({ length: 31 }, (_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={formData.eventMonth}
                                                    onChange={(e) => handleInputChange("eventMonth", e.target.value)}
                                                    className="border border-slate-200 rounded-lg p-2 bg-white text-xs font-bold text-[#0b2545] outline-hidden cursor-pointer"
                                                >
                                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={formData.eventYear}
                                                    onChange={(e) => handleInputChange("eventYear", e.target.value)}
                                                    className="border border-slate-200 rounded-lg p-2 bg-white text-xs font-bold text-[#0b2545] outline-hidden cursor-pointer"
                                                >
                                                    {Array.from({ length: 100 }, (_, i) => 2026 - i).map(y => (
                                                        <option key={y} value={y}>{y}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* PARENTS INFORMATION */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                                        FAMILY / PARENTS DETAILS
                                    </span>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Father's Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.fatherName}
                                                onChange={(e) => handleInputChange("fatherName", e.target.value)}
                                                placeholder="Father's full name"
                                                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                            />
                                        </div>

                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Mother's Maiden Name</label>
                                            <input
                                                type="text"
                                                value={formData.motherName}
                                                onChange={(e) => handleInputChange("motherName", e.target.value)}
                                                placeholder="Mother's full name & maiden last name"
                                                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={prevStep}
                                        className="border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 px-6 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={!formData.subjectName || !formData.eventCity || !formData.fatherName || !formData.motherName}
                                        className={`px-8 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md ${formData.subjectName && formData.eventCity && formData.fatherName && formData.motherName
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-blue-500/10'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                            }`}
                                    >
                                        Continue &gt;
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* STEP 3: SHIPPING & PROCESSING OPTIONS */}
                        <div className={`w-1/5 shrink-0 px-2 sm:px-4 space-y-8 transition-all duration-500 delay-100 ${step === 3 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
                            <div className="text-center space-y-1">
                                <h2 className="text-2xl font-black text-[#0b2545] tracking-tight">Shipping & Processing Options</h2>
                                <p className="text-slate-500 text-xs font-medium">Select your delivery details and processing speeds</p>
                            </div>

                            <div className="space-y-6 max-w-2xl mx-auto text-[#0f172a]">

                                {/* SHIPPING ADDRESS */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                                        SHIPPING ADDRESS
                                    </span>

                                    <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Street address</label>
                                        <input
                                            type="text"
                                            value={formData.shipStreet}
                                            onChange={(e) => handleInputChange("shipStreet", e.target.value)}
                                            placeholder="e.g. 123 Main St, Apt 4B"
                                            className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs col-span-2">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">City</label>
                                            <input
                                                type="text"
                                                value={formData.shipCity}
                                                onChange={(e) => handleInputChange("shipCity", e.target.value)}
                                                placeholder="Memphis"
                                                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                            />
                                        </div>
                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">State</label>
                                            <select
                                                value={formData.shipState}
                                                onChange={(e) => handleInputChange("shipState", e.target.value)}
                                                className="w-full bg-transparent text-xs font-semibold text-[#0b2545] outline-hidden cursor-pointer">
                                                <option value="TN">TN</option>
                                                <option value="TX">TX</option>
                                                <option value="FL">FL</option>
                                                <option value="CA">CA</option>
                                                <option value="NY">NY</option>
                                                <option value="AL">AL</option>
                                                <option value="AK">AK</option>
                                                <option value="AZ">AZ</option>
                                                <option value="AR">AR</option>
                                                <option value="CO">CO</option>
                                                <option value="CT">CT</option>
                                                <option value="DE">DE</option>
                                                <option value="GA">GA</option>
                                                <option value="HI">HI</option>
                                                <option value="ID">ID</option>
                                                <option value="IL">IL</option>
                                                <option value="IN">IN</option>
                                                <option value="IA">IA</option>
                                                <option value="KS">KS</option>
                                                <option value="KY">KY</option>
                                                <option value="LA">LA</option>
                                                <option value="ME">ME</option>
                                                <option value="MD">MD</option>
                                                <option value="MA">MA</option>
                                                <option value="MI">MI</option>
                                                <option value="MN">MN</option>
                                                <option value="MS">MS</option>
                                                <option value="MO">MO</option>
                                                <option value="MT">MT</option>
                                                <option value="NE">NE</option>
                                                <option value="NV">NV</option>
                                                <option value="NH">NH</option>
                                                <option value="NJ">NJ</option>
                                                <option value="NM">NM</option>
                                                <option value="NC">NC</option>
                                                <option value="ND">ND</option>
                                                <option value="OH">OH</option>
                                                <option value="OK">OK</option>
                                                <option value="OR">OR</option>
                                                <option value="PA">PA</option>
                                                <option value="RI">RI</option>
                                                <option value="SC">SC</option>
                                                <option value="SD">SD</option>
                                                <option value="UT">UT</option>
                                                <option value="VT">VT</option>
                                                <option value="VA">VA</option>
                                                <option value="WA">WA</option>
                                                <option value="WV">WV</option>
                                                <option value="WI">WI</option>
                                                <option value="WY">WY</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">ZIP Code</label>
                                            <input
                                                type="text"
                                                value={formData.shipZip}
                                                onChange={(e) => handleInputChange("shipZip", e.target.value)}
                                                placeholder="e.g. 37201"
                                                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                            />
                                        </div>
                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Country</label>
                                            <select
                                                value={formData.shipCountry}
                                                onChange={(e) => handleInputChange("shipCountry", e.target.value)}
                                                className="w-full bg-transparent text-xs font-semibold text-[#0b2545] outline-hidden cursor-pointer"
                                            >
                                                <option value="United States">United States</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Mexico">Mexico</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* SHIPPING METHOD */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                                        SHIPPING METHOD
                                    </span>

                                    <div className="space-y-2">
                                        {[
                                            { id: "standard", title: "Standard Shipping", price: 15.00, desc: "Basic tracking via USPS" },
                                            { id: "express", title: "Express / Overnight Shipping", price: 45.00, desc: "Fast priority delivery via FedEx/UPS" }
                                        ].map(opt => (
                                            <div
                                                key={opt.id}
                                                onClick={() => handleInputChange("shippingMethod", opt.id)}
                                                className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all duration-300 ${formData.shippingMethod === opt.id
                                                    ? 'border-blue-500 bg-blue-50/20'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className="space-y-0.5">
                                                    <span className="text-xs font-black text-[#0b2545]">{opt.title}</span>
                                                    <span className="text-[10px] text-slate-500 font-semibold block">{opt.desc}</span>
                                                </div>
                                                <div className="text-right flex items-center gap-3">
                                                    <span className="text-xs font-bold text-blue-600">
                                                        ${opt.price.toFixed(2)}
                                                    </span>
                                                    <input
                                                        type="radio"
                                                        checked={formData.shippingMethod === opt.id}
                                                        onChange={() => { }}
                                                        className="w-4 h-4 text-blue-600"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                                        PROCESSING SPEED
                                    </span>

                                    <div className="space-y-2">
                                        {[
                                            { id: "standard", title: "Standard Processing", price: 0.00, desc: "Normal document processing in 2-3 weeks" },
                                            { id: "expedited", title: "Expedited Processing", price: 25.00, desc: "Fast processing in 24-48 hours with certified priority network" }
                                        ].map(opt => (
                                            <div
                                                key={opt.id}
                                                onClick={() => handleInputChange("processingSpeed", opt.id)}
                                                className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all duration-300 ${formData.processingSpeed === opt.id
                                                    ? 'border-blue-500 bg-blue-50/20'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className="space-y-0.5">
                                                    <span className="text-xs font-black text-[#0b2545]">{opt.title}</span>
                                                    <span className="text-[10px] text-slate-500 font-semibold block">{opt.desc}</span>
                                                </div>
                                                <div className="text-right flex items-center gap-3">
                                                    <span className="text-xs font-bold text-blue-600">
                                                        {opt.price === 0 ? "Included" : `+$${opt.price.toFixed(2)}`}
                                                    </span>
                                                    <input
                                                        type="radio"
                                                        checked={formData.processingSpeed === opt.id}
                                                        onChange={() => { }}
                                                        className="w-4 h-4 text-blue-600"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={prevStep}
                                        className="border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 px-6 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={!formData.shipStreet || !formData.shipCity || !formData.shipZip}
                                        className={`px-8 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md ${formData.shipStreet && formData.shipCity && formData.shipZip
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-blue-500/10'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                            }`}
                                    >
                                        Continue &gt;
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* STEP 4: REVIEW & CHECKOUT */}
                        <div className={`w-1/5 shrink-0 px-2 sm:px-4 space-y-8 transition-all duration-500 delay-100 ${step === 4 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
                            <div className="text-center space-y-1">
                                <h2 className="text-2xl font-black text-[#0b2545] tracking-tight">Review & Checkout</h2>
                                <p className="text-slate-500 text-xs font-medium">Verify your details and complete your secure vital record order</p>
                            </div>

                            <div className="space-y-6 max-w-2xl mx-auto text-[#0f172a]">

                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                                                1. APPLICANT & REQUEST INFO
                                            </span>
                                            <button
                                                onClick={() => setStep(1)}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium text-slate-600">
                                            <div><strong className="text-slate-700">Certificate Type:</strong> {formData.certType}</div>
                                            <div><strong className="text-slate-700">State:</strong> {formData.eventState}</div>
                                            <div><strong className="text-slate-700">Reason:</strong> {formData.reason}</div>
                                            <div><strong className="text-slate-700">Name:</strong> {formData.applicantName}</div>
                                            <div className="col-span-2"><strong className="text-slate-700">Email:</strong> {formData.applicantEmail}</div>
                                            <div><strong className="text-slate-700">Mobile:</strong> {formData.applicantPhone}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                                                2. RECORD SUBJECT DETAILS
                                            </span>
                                            <button
                                                onClick={() => setStep(2)}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium text-slate-600">
                                            <div><strong className="text-slate-700">Relationship:</strong> {formData.relationship}</div>
                                            <div><strong className="text-slate-700">Subject Name:</strong> {formData.subjectName}</div>
                                            <div><strong className="text-slate-700">City/County:</strong> {formData.eventCity}</div>
                                            <div><strong className="text-slate-700">Event Date:</strong> {formData.eventMonth} {formData.eventDay}, {formData.eventYear}</div>
                                            <div className="col-span-2"><strong className="text-slate-700">Father's Name:</strong> {formData.fatherName}</div>
                                            <div className="col-span-2"><strong className="text-slate-700">Mother's Maiden Name:</strong> {formData.motherName}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                                                3. SHIPPING & DELIVERY
                                            </span>
                                            <button
                                                onClick={() => setStep(3)}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium text-slate-600">
                                            <div className="col-span-2"><strong className="text-slate-700">Address:</strong> {formData.shipStreet}, {formData.shipCity}, {formData.shipState} {formData.shipZip}, {formData.shipCountry}</div>
                                            <div><strong className="text-slate-700">Shipping Mode:</strong> {formData.shippingMethod === "express" ? "Express / Overnight" : "Standard Shipping"}</div>
                                            <div><strong className="text-slate-700">Processing Speed:</strong> {formData.processingSpeed === "expedited" ? "Expedited (24-48h)" : "Standard (2-3w)"}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* COST BREAKDOWN CARD */}
                                <div className="bg-[#f0f6fe]/70 rounded-2xl p-6 shadow-sm border border-[#e0ebf8] space-y-3.5">
                                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                                        Order Total Breakdown
                                    </span>

                                    <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-700">State Certificate Fee</span>
                                            <span className="font-bold text-[#0b2545]">${stateCertificateFee.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-700">Platform Management Fee</span>
                                            <span className="font-bold text-[#0b2545]">${platformFee.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-700">Shipping Cost ({formData.shippingMethod === "express" ? "Express" : "Standard"})</span>
                                            <span className="font-bold text-[#0b2545]">${getShippingCost().toFixed(2)}</span>
                                        </div>

                                        {getProcessingCost() > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-700">Processing Speed Addon (Expedited)</span>
                                                <span className="font-bold text-[#0b2545]">${getProcessingCost().toFixed(2)}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-3 text-sm font-black text-[#0b2545] border-t border-slate-200">
                                            <span>Order Total</span>
                                            <span className="text-blue-600 text-base">${totalFee.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                                        MOCK PAYMENT FORM
                                    </span>

                                    <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Name on Card</label>
                                        <input
                                            type="text"
                                            value={formData.cardName}
                                            onChange={(e) => handleInputChange("cardName", e.target.value)}
                                            placeholder="Name as it appears on card"
                                            className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                        />
                                    </div>

                                    <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Credit / Debit Card number</label>
                                        <input
                                            type="text"
                                            value={formData.cardNumber}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, '');
                                                if (value.length > 16) {
                                                    value = value.substring(0, 16);
                                                }
                                                let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                                                handleInputChange("cardNumber", formattedValue);
                                            }}
                                            maxLength={19}
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0 tracking-widest"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Expiration Date</label>
                                            <input
                                                type="text"
                                                value={formData.cardExpiry}
                                                onChange={(e) => handleInputChange("cardExpiry", e.target.value)}
                                                placeholder="MM / YY"
                                                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                            />
                                        </div>
                                        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Security Code (CVC)</label>
                                            <input
                                                type="password"
                                                value={formData.cardCvc}
                                                onChange={(e) => handleInputChange("cardCvc", e.target.value)}
                                                placeholder="CVC"
                                                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden p-0 m-0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* TERMS & SUBMIT ACTIONS */}
                                <div className="space-y-4 pt-2">
                                    <div className="flex gap-4 items-start bg-blue-50/10 p-4 border border-slate-100 rounded-2xl relative">
                                        <input
                                            type="checkbox"
                                            id="agreedToTerms"
                                            checked={formData.agreedToTerms}
                                            onChange={(e) => handleInputChange("agreedToTerms", e.target.checked)}
                                            className="w-4 h-4 text-blue-600 rounded-2xs mt-0.5 cursor-pointer shrink-0"
                                        />
                                        <label htmlFor="agreedToTerms" className="text-[10px] text-slate-500 font-semibold leading-relaxed cursor-pointer select-none">
                                            By checking this box, I agree to submit the information provided to this website, and I authorize Order Vital Records to use my information to fill out all necessary documents to prepare my application materials. I understand that <strong className="text-slate-800">OrderVitalRecords.com</strong> is a private document preparation service.
                                        </label>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setStep(3)}
                                            className="w-1/3 border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 py-3 rounded-xl transition-all shadow-2xs cursor-pointer"
                                        >
                                            Review All
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting || !formData.agreedToTerms || !formData.cardName || !formData.cardNumber || !formData.cardExpiry || !formData.cardCvc}
                                            className={`w-2/3 py-3 text-xs font-bold text-center text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 ${!isSubmitting && formData.agreedToTerms && formData.cardName && formData.cardNumber && formData.cardExpiry && formData.cardCvc
                                                ? 'bg-[#0080ff] hover:bg-blue-600 shadow-blue-500/25 cursor-pointer'
                                                : 'bg-slate-300 shadow-none cursor-not-allowed'
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2 justify-center">
                                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                "Submit Order & Pay >"
                                            )}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* STEP 5: ORDER SUCCESS SCREEN */}
                        <div className={`w-1/5 shrink-0 px-2 sm:px-4 space-y-8 transition-all duration-500 delay-100 ${step === 5 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 shadow-xs mb-2 animate-bounce">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-black text-[#0b2545] tracking-tight">Order Confirmed & Paid!</h2>
                                <p className="text-slate-500 text-xs font-semibold max-w-md mx-auto leading-relaxed">
                                    Thank you for your order! Your document submission has been received. Your PDF receipt and summary was generated and downloaded automatically.
                                </p>
                            </div>

                            <div className="space-y-6 max-w-2xl mx-auto text-[#0f172a]">

                                {/* ORDER CONFIRMATION METADATA */}
                                <div className="bg-[#f0f6fe]/70 rounded-2xl p-6 shadow-sm border border-[#e0ebf8] space-y-4">
                                    <span className="text-[9px] font-black text-blue-500 tracking-wider uppercase block border-b border-blue-100 pb-1.5">
                                        SUBMISSION SUMMARY
                                    </span>

                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold text-slate-600">
                                        <div>
                                            <span className="text-slate-400 block text-[9px] uppercase tracking-wide">Submission ID</span>
                                            <strong className="text-blue-600 font-extrabold text-sm">{submissionDetails?.id}</strong>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block text-[9px] uppercase tracking-wide">Date & Time</span>
                                            <strong className="text-slate-800 font-bold">{submissionDetails?.date}</strong>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block text-[9px] uppercase tracking-wide">Certificate Type</span>
                                            <strong className="text-slate-800 font-bold">{formData.certType} Certificate</strong>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block text-[9px] uppercase tracking-wide">Event Location</span>
                                            <strong className="text-slate-800 font-bold">{formData.eventCity ? `${formData.eventCity}, ` : ''}{formData.eventState}</strong>
                                        </div>
                                        <div className="col-span-2 border-t border-slate-100 pt-3 flex justify-between items-center text-sm text-[#0b2545]">
                                            <span className="font-extrabold text-xs text-slate-500 uppercase">Amount Processed</span>
                                            <strong className="text-blue-600 text-base font-black">${totalFee.toFixed(2)}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* WHAT HAPPENS NEXT TIMELINE */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block border-b border-slate-100 pb-1.5">
                                        PROCESS TIMELINE & EXPECTED DELIVERIES
                                    </span>

                                    <div className="space-y-4 pt-1">
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center shrink-0">
                                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shadow-xs">✓</div>
                                                <div className="w-0.5 h-8 bg-emerald-200"></div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="text-xs font-extrabold text-[#0b2545]">Step 1: Secure Data Validation & Fee Paid</h4>
                                                <p className="text-[10px] text-slate-500 font-medium">Your credentials have been securely verified against state registry prerequisites.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center shrink-0">
                                                <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black animate-pulse shadow-xs">2</div>
                                                <div className="w-0.5 h-8 bg-slate-200"></div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="text-xs font-extrabold text-blue-600">Step 2: Document Packaging (Current)</h4>
                                                <p className="text-[10px] text-slate-500 font-medium">Our processors are generating your physical applications, certified state cover letters, and packaging folders.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center shrink-0">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-[10px] font-black">3</div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="text-xs font-extrabold text-slate-400">Step 3: State Registry Dispatch & Delivery</h4>
                                                <p className="text-[10px] text-slate-400 font-medium">Dispatching to {formData.eventState} State Registry. Standard delivery estimated within {formData.processingSpeed === 'expedited' ? '4-5 business days' : '2-3 weeks'}.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SECURE BUTTON ACTIONS */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        onClick={handleReDownload}
                                        className="flex-1 bg-white hover:bg-slate-50 text-[#0b2545] border border-slate-200 hover:border-slate-300 font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download PDF Summary Again
                                    </button>
                                    <Link
                                        href="/"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-500/10 text-center cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Return to Homepage
                                    </Link>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* SECURE SUBMISSION LOADING OVERLAY */}
                {isSubmitting && (
                    <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-slate-100">
                            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 animate-spin"></div>
                                <svg className="w-6 h-6 text-blue-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-base font-black text-[#0b2545]">Processing Secure Payment</h3>
                                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                    Authorizing secure transaction and generating your official PDF summary using Puppeteer. Please do not close or refresh this page.
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 justify-center text-[10px] text-emerald-600 font-bold bg-emerald-50 py-1.5 px-3 rounded-full border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Secure Payment Gateway Verified
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}