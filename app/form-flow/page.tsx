"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { useAuth } from '../../components/AuthProvider';

export default function BirthFlowPage() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
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
        // Pricing & Shipping (Step 1)
        number_of_copies: 1,
        paternity_copies: 0,
        shippingMethod: "standard",
        processingSpeed: "standard",
        mail_name: "",
        mail_address: "",
        mail_city_state: "",
        mail_zip: "",
        phone: "",
        email: "",

        // Payment (Step 2)
        cardName: "",
        cardNumber: "",
        cardExpiry: "",
        cardCvc: "",

        // Official Application (Step 3)
        first_name: "",
        middle_name: "",
        last_name: "",
        name_changed: false,
        original_name: "",
        dob_month: "",
        dob_day: "",
        dob_year: "",
        sex: "Male",
        birth_city: "",
        birth_county: "",
        birth_state: "TN",
        birth_country: "",
        hospital: "",
        father_name: "",
        mother_maiden_name: "",
        mother_last_name_at_birth: "",
        older_sibling: "",
        younger_sibling: "",
        relationship: "",
        purpose: ""
    });

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const nextStep = () => {
        setFormError("");
        if (step === 1) {
            if (!formData.mail_name || !formData.email || !formData.phone || !formData.mail_address || !formData.mail_city_state || !formData.mail_zip) {
                setFormError("Please fill out all Applicant / Mailing Information fields before proceeding.");
                return;
            }
        } else if (step === 2) {
            if (!formData.cardName || !formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
                setFormError("Please fill out all payment details before proceeding.");
                return;
            }
        }

        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        setFormError("");
        if (step > 1) setStep(step - 1);
    };

    // COST CALCULATOR
    const stateFee = (formData.number_of_copies * 15.00) + (formData.paternity_copies * 5.00);
    const platformFee = 19.99;
    const shippingCost = formData.shippingMethod === "express" ? 45.00 : 15.00;
    const processingCost = formData.processingSpeed === "expedited" ? 25.00 : 0.00;
    const totalFee = stateFee + platformFee + shippingCost + processingCost;

    const handleSubmit = async () => {
        setFormError("");
        // Validate Step 3 fields - Only strictly necessary ones
        if (!formData.first_name || !formData.last_name || !formData.dob_month || !formData.dob_day || !formData.dob_year ||
            !formData.birth_city || !formData.mother_maiden_name || !formData.relationship || !formData.purpose) {
            setFormError("Please complete all required fields (Name, DOB, City of Birth, Mother's Maiden Name, Relationship, and Purpose).");
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const randomId = Math.floor(10000 + Math.random() * 90000);
            const subId = `OVR-TN-${randomId}`;

            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            const subDate = new Date().toLocaleDateString('en-US', options);

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
                        stateFee,
                        platformFee,
                        shippingCost,
                        processingCost,
                        total: totalFee
                    }
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate application PDF");
            }

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            setSubmissionDetails({
                id: subId,
                date: subDate,
                pdfBlobUrl: blobUrl
            });
            setStep(4);

        } catch (error) {
            console.error(error);
            alert("There was an error processing your application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = () => {
        if (submissionDetails?.pdfBlobUrl) {
            const link = document.createElement('a');
            link.href = submissionDetails.pdfBlobUrl;
            link.download = `Application-${submissionDetails.id}.pdf`;
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

    // Modern input styling for Steps 1 & 2
    const inputClassModern = "w-full bg-slate-50 border-2 border-slate-300 shadow-sm rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition-all outline-none";

    // Paper input styling for Step 3
    const inputClassPaper = "border-b-2 border-slate-300 bg-transparent outline-none grow px-1 font-normal font-mono text-[13px] focus:border-blue-500 focus:bg-blue-50/30 hover:border-slate-400 transition-colors";

    return (
        <div className="min-h-screen bg-linear-to-b from-[#e0ebf8]/40 via-[#f4f8fc]/20 to-[#f4f8fc]/60 text-[#0f172a] font-sans antialiased pb-20">
            <Header />

            <div className="max-w-4xl mx-auto px-4 pt-12 space-y-8 relative z-10">
                {step < 4 && (
                    <div className="max-w-2xl mx-auto flex items-center justify-between relative px-2 mb-10">
                        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0">
                            <div
                                className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
                                style={{ width: `${Math.min((step - 1) * 50, 100)}%` }}
                            />
                        </div>

                        {[
                            { id: 1, label: "Order Setup" },
                            { id: 2, label: "Payment" },
                            { id: 3, label: "Official Application" }
                        ].map((s) => {
                            const isCompleted = step > s.id;
                            const isActive = step === s.id;

                            return (
                                <div key={s.id} className="relative z-10 flex items-center">
                                    {isActive ? (
                                        <div className="bg-white border-2 border-blue-500 rounded-full shadow-md py-1.5 px-3 flex items-center gap-2 transition-all duration-300">
                                            <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                                                {s.id}
                                            </div>
                                            <span className="text-xs font-bold text-[#0f172a] whitespace-nowrap hidden sm:block pr-1">
                                                {s.label}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isCompleted ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-400 border-2 border-slate-200'}`}>
                                            {isCompleted ? '✓' : s.id}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className={`transition-all duration-500 ease-in-out ${step < 4 ? '' : 'h-0 opacity-0 pointer-events-none overflow-hidden'}`}>

                    {/* STEP 1: ORDER DETAILS & SHIPPING */}
                    {step === 1 && (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-6 md:p-10 animate-fade-in space-y-8">
                                <div>
                                    <h2 className="text-2xl font-black text-[#0b2545] tracking-tight mb-2">Order Setup & Delivery</h2>
                                    <p className="text-sm font-medium text-slate-500">Configure your order and tell us where to mail the final certificate.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-[#2563eb] uppercase tracking-wider border-b border-slate-100 pb-2">Document Quantities</h3>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Number of Certificate Copies ($15 ea)</label>
                                            <input type="number" min="1" max="10" className={inputClassModern} value={formData.number_of_copies} onChange={(e) => handleInputChange('number_of_copies', parseInt(e.target.value) || 1)} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Voluntary Acknowledgment of Paternity Copies ($5 ea)</label>
                                            <input type="number" min="0" max="10" className={inputClassModern} value={formData.paternity_copies} onChange={(e) => handleInputChange('paternity_copies', parseInt(e.target.value) || 0)} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-[#2563eb] uppercase tracking-wider border-b border-slate-100 pb-2">Processing & Shipping</h3>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Processing Speed</label>
                                            <select className={inputClassModern} value={formData.processingSpeed} onChange={(e) => handleInputChange('processingSpeed', e.target.value)}>
                                                <option value="standard">Standard Processing (Free)</option>
                                                <option value="expedited">Expedited Processing (+$25)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Shipping Method</label>
                                            <select className={inputClassModern} value={formData.shippingMethod} onChange={(e) => handleInputChange('shippingMethod', e.target.value)}>
                                                <option value="standard">Standard Mail (+$15)</option>
                                                <option value="express">Express Overnight (+$45)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-[#2563eb] uppercase tracking-wider border-b border-slate-100 pb-2">Applicant / Mailing Information</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Applicant Name</label>
                                            <input type="text" className={inputClassModern} value={formData.mail_name} onChange={(e) => handleInputChange('mail_name', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Email Address</label>
                                            <input type="email" className={inputClassModern} value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Telephone Number</label>
                                            <input type="tel" className={inputClassModern} value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Mailing Address or Route</label>
                                            <input type="text" className={inputClassModern} value={formData.mail_address} onChange={(e) => handleInputChange('mail_address', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">City and State</label>
                                            <input type="text" placeholder="e.g. Nashville, TN" className={inputClassModern} value={formData.mail_city_state} onChange={(e) => handleInputChange('mail_city_state', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Zip Code</label>
                                            <input type="text" className={inputClassModern} value={formData.mail_zip} onChange={(e) => handleInputChange('mail_zip', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CHECKOUT (PAYMENT) */}
                    {step === 2 && (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-6 md:p-10 animate-fade-in grid md:grid-cols-[1.5fr_1fr] gap-10">
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-[#0b2545] tracking-tight mb-2">Secure Checkout</h2>
                                        <p className="text-sm font-medium text-slate-500">Pay your processing fees to unlock the official application form.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-[#2563eb] uppercase tracking-wider border-b border-slate-100 pb-2">Payment Details</h3>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Cardholder Name</label>
                                            <input type="text" className={inputClassModern} value={formData.cardName} onChange={(e) => handleInputChange('cardName', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Card Number</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" className={`${inputClassModern} tracking-[0.2em]`} value={formData.cardNumber} onChange={(e) => {
                                                let val = e.target.value.replace(/\D/g, '');
                                                val = val.replace(/(\d{4})/g, '$1 ').trim();
                                                handleInputChange('cardNumber', val);
                                            }} maxLength={19} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Expiry (MM/YY)</label>
                                                <input type="text" placeholder="MM/YY" className={inputClassModern} value={formData.cardExpiry} onChange={(e) => handleInputChange('cardExpiry', e.target.value)} maxLength={5} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">CVC</label>
                                                <input type="text" placeholder="123" className={inputClassModern} value={formData.cardCvc} onChange={(e) => handleInputChange('cardCvc', e.target.value)} maxLength={4} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200/60 h-fit space-y-4">
                                    <h3 className="text-sm font-black text-[#0b2545] uppercase tracking-wider border-b border-slate-200 pb-3">Order Summary</h3>
                                    <div className="space-y-3 text-xs font-medium text-slate-600">
                                        <div className="flex justify-between"><span className="text-slate-500">TN State Fee (x{formData.number_of_copies})</span><span className="font-bold text-slate-800">${(formData.number_of_copies * 15.00).toFixed(2)}</span></div>
                                        {formData.paternity_copies > 0 && <div className="flex justify-between"><span className="text-slate-500">Paternity Ack (x{formData.paternity_copies})</span><span className="font-bold text-slate-800">${(formData.paternity_copies * 5.00).toFixed(2)}</span></div>}
                                        <div className="flex justify-between"><span className="text-slate-500">Platform Prep Fee</span><span className="font-bold text-slate-800">${platformFee.toFixed(2)}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Processing ({formData.processingSpeed})</span><span className="font-bold text-slate-800">${processingCost.toFixed(2)}</span></div>
                                        <div className="flex justify-between pb-3 border-b border-slate-200"><span className="text-slate-500">Shipping ({formData.shippingMethod})</span><span className="font-bold text-slate-800">${shippingCost.toFixed(2)}</span></div>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-sm font-black text-[#0b2545]">Total</span>
                                        <span className="text-2xl font-black text-[#2563eb]">${totalFee.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: OFFICIAL APPLICATION FORM (PAPER REPLICA) */}
                    {step === 3 && (
                        <div className="animate-fade-in space-y-8 pb-4">
                            <div className="flex items-center gap-4 bg-green-50 border border-green-200 p-4 rounded-xl">
                                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0">✓</div>
                                <div>
                                    <h4 className="text-sm font-bold text-green-800">Payment Successful</h4>
                                    <p className="text-xs text-green-700 font-medium">Please fill out the official Tennessee form below exactly as it appears on paper.</p>
                                </div>
                            </div>

                            {/* PAPER FORM UI */}
                            <div className="bg-white shadow-2xl mx-auto p-4 sm:p-8 md:p-12 text-black font-sans border border-gray-300 w-full" style={{ maxWidth: '8.5in', fontFamily: 'Arial, sans-serif' }}>
                                <div className="w-full">

                                    {/* Header */}
                                    <div className="text-center mb-8 relative">
                                        <h1 className="text-sm font-bold">TENNESSEE DEPARTMENT OF HEALTH</h1>
                                        <h2 className="text-[13px]">OFFICE OF VITAL RECORDS</h2>
                                        <h3 className="text-sm font-bold mt-4">APPLICATION FOR CERTIFIED COPY OF A TENNESSEE CERTIFICATE OF LIVE BIRTH</h3>
                                    </div>

                                    {/* Top row */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 text-[13px] gap-6 md:gap-0">
                                        <div className="flex items-end w-full md:w-auto">
                                            <span className="font-bold mr-2">Date:</span>
                                            <div className="border-b-2 border-slate-300 grow md:w-64 pb-0.5 px-2 text-center text-slate-500">{new Date().toLocaleDateString()}</div>
                                        </div>
                                        <div className="text-left md:text-right text-xs font-bold leading-tight flex flex-col items-start md:items-end bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-lg w-full md:w-auto">
                                            <div>
                                                Number of Copies <div className="inline-block border-b-2 border-slate-300 w-16 text-center text-slate-500 pb-0.5">{formData.number_of_copies}</div>
                                            </div>
                                            <div className="mb-2">Enclose $15.00 for each copy</div>
                                            <div>
                                                <div className="inline-block border-b-2 border-slate-300 w-10 text-center text-slate-500 pb-0.5">{formData.paternity_copies > 0 ? formData.paternity_copies : ''}</div> Copy of Voluntary Acknowledgment of Paternity - $5.00 each copy
                                            </div>
                                            <div className="font-normal text-[10px]">(When purchased with a certified copy of the birth certificate.)</div>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-6 md:space-y-4 text-[13px] font-bold">
                                        <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-0">
                                            <span className="md:mr-2">Full name on birth certificate:</span>
                                            <div className="flex flex-col grow text-center">
                                                <input type="text" className={inputClassPaper + " w-full"} value={formData.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} />
                                                <span className="text-[10px] font-normal mt-1">First</span>
                                            </div>
                                            <div className="flex flex-col grow text-center md:mx-2">
                                                <input type="text" className={inputClassPaper + " w-full"} value={formData.middle_name} onChange={(e) => handleInputChange('middle_name', e.target.value)} />
                                                <span className="text-[10px] font-normal mt-1">Middle</span>
                                            </div>
                                            <div className="flex flex-col grow text-center">
                                                <input type="text" className={inputClassPaper + " w-full"} value={formData.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} />
                                                <span className="text-[10px] font-normal mt-1">Last Name</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-1">
                                            <span>Has the name ever been changed other than by marriage?</span>
                                            <div className="flex gap-6">
                                                <label className="flex items-center font-normal cursor-pointer text-sm">
                                                    <input type="checkbox" className="mr-1.5 w-4 h-4 md:w-3 md:h-3 appearance-none border-2 border-slate-400 checked:bg-blue-600 checked:border-blue-600 transition-colors" checked={formData.name_changed} onChange={() => handleInputChange('name_changed', true)} /> Yes
                                                </label>
                                                <label className="flex items-center font-normal cursor-pointer text-sm">
                                                    <input type="checkbox" className="mr-1.5 w-4 h-4 md:w-3 md:h-3 appearance-none border-2 border-slate-400 checked:bg-blue-600 checked:border-blue-600 transition-colors" checked={!formData.name_changed} onChange={() => handleInputChange('name_changed', false)} /> No
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-0">
                                            <span className="md:mr-2">If yes, what was original name?</span>
                                            <input type="text" className={inputClassPaper + " w-full md:w-auto"} value={formData.original_name} onChange={(e) => handleInputChange('original_name', e.target.value)} />
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-0">
                                            <span className="md:mr-2">Date of birth:</span>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <div className="flex flex-col text-center grow md:w-24">
                                                    <input type="text" className={inputClassPaper + " w-full text-center"} value={formData.dob_month} onChange={(e) => handleInputChange('dob_month', e.target.value)} />
                                                    <span className="text-[10px] font-normal mt-1">Month</span>
                                                </div>
                                                <div className="flex flex-col text-center grow md:w-24 md:mx-2">
                                                    <input type="text" className={inputClassPaper + " w-full text-center"} value={formData.dob_day} onChange={(e) => handleInputChange('dob_day', e.target.value)} />
                                                    <span className="text-[10px] font-normal mt-1">Day</span>
                                                </div>
                                                <div className="flex flex-col text-center grow md:w-32 md:mr-8">
                                                    <input type="text" className={inputClassPaper + " w-full text-center"} value={formData.dob_year} onChange={(e) => handleInputChange('dob_year', e.target.value)} />
                                                    <span className="text-[10px] font-normal mt-1">Year</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-end w-full md:w-auto gap-1 md:gap-0">
                                                <span className="md:mr-2">Sex:</span>
                                                <input type="text" className={inputClassPaper + " w-full md:w-auto"} value={formData.sex} onChange={(e) => handleInputChange('sex', e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-0 pt-1">
                                            <span className="md:mr-2">Place of birth:</span>
                                            <div className="flex gap-2 w-full md:w-auto grow">
                                                <div className="flex flex-col text-center grow md:w-1/4">
                                                    <input type="text" className={inputClassPaper + " w-full"} value={formData.birth_city} onChange={(e) => handleInputChange('birth_city', e.target.value)} />
                                                    <span className="text-[10px] font-normal mt-1">City</span>
                                                </div>
                                                <div className="flex flex-col text-center grow md:w-1/5 md:mx-2">
                                                    <input type="text" className={inputClassPaper + " w-full"} value={formData.birth_county} onChange={(e) => handleInputChange('birth_county', e.target.value)} />
                                                    <span className="text-[10px] font-normal mt-1">County</span>
                                                </div>
                                                <div className="flex flex-col text-center grow md:w-20 md:mx-2">
                                                    <input type="text" className={inputClassPaper + " w-full text-center"} value={formData.birth_state} onChange={(e) => handleInputChange('birth_state', e.target.value)} />
                                                    <span className="text-[10px] font-normal mt-1">State</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col text-center w-full md:w-auto mt-2 md:mt-0">
                                                <input type="text" className={inputClassPaper + " w-full"} value={formData.birth_country !== 'USA' && formData.birth_country !== 'United States' ? formData.birth_country : ''} onChange={(e) => handleInputChange('birth_country', e.target.value)} />
                                                <span className="text-[10px] font-normal mt-1">Foreign Country (if Report of Foreign Birth)</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-0">
                                            <span className="md:mr-2">Hospital where birth occurred:</span>
                                            <input type="text" className={inputClassPaper + " w-full md:w-auto"} value={formData.hospital} onChange={(e) => handleInputChange('hospital', e.target.value)} />
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-0">
                                            <span className="md:mr-2">Full name of father:</span>
                                            <input type="text" className={inputClassPaper + " w-full md:w-auto"} value={formData.father_name} onChange={(e) => handleInputChange('father_name', e.target.value)} />
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-0">
                                            <span className="md:mr-2">Full maiden name of mother:</span>
                                            <input type="text" className={inputClassPaper + " w-full md:w-auto"} value={formData.mother_maiden_name} onChange={(e) => handleInputChange('mother_maiden_name', e.target.value)} />
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-0">
                                            <span className="md:mr-2">Last name of mother at time of birth:</span>
                                            <input type="text" className={inputClassPaper + " w-full md:w-auto"} value={formData.mother_last_name_at_birth} onChange={(e) => handleInputChange('mother_last_name_at_birth', e.target.value)} />
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-0">
                                            <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-0 grow">
                                                <span className="md:mr-2">Next older brother or sister:</span>
                                                <input type="text" className={inputClassPaper + " w-full md:w-auto"} value={formData.older_sibling} onChange={(e) => handleInputChange('older_sibling', e.target.value)} />
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-0 w-full md:w-auto mt-2 md:mt-0">
                                                <span className="md:ml-4 md:mr-2">Younger:</span>
                                                <input type="text" className={inputClassPaper + " w-full md:w-48 md:flex-none"} value={formData.younger_sibling} onChange={(e) => handleInputChange('younger_sibling', e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-0">
                                            <span className="md:mr-2">Signature of person making request:</span>
                                            <input type="text" className={inputClassPaper + " w-full md:w-auto text-slate-500 bg-slate-50 pointer-events-none"} style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '18px' }} value={formData.mail_name} disabled />
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-0">
                                            <span className="md:mr-2">Relationship:</span>
                                            <input type="text" className={inputClassPaper + " w-full md:w-auto"} value={formData.relationship} onChange={(e) => handleInputChange('relationship', e.target.value)} />
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-0">
                                            <span className="md:mr-2">Purpose of copy:</span>
                                            <input type="text" className={inputClassPaper + " w-full md:w-auto"} value={formData.purpose} onChange={(e) => handleInputChange('purpose', e.target.value)} />
                                        </div>

                                        <div className="pt-2">
                                            <span className="block mb-2">Telephone number and email where you may be reached for additional information:</span>
                                            <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-0">
                                                <div className="flex items-end w-full md:w-auto">
                                                    <span className="mr-1 font-normal">(</span>
                                                    <input type="text" className={inputClassPaper + " grow md:w-40 text-center"} value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                                                    <span className="ml-1 md:mr-4 font-normal">)</span>
                                                </div>
                                                <input type="text" className={inputClassPaper + " w-full md:w-auto"} value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="text-center font-bold text-xs mt-6 pt-2">
                                            IT IS UNLAWFUL TO WILLFULLY AND KNOWINGLY MAKE ANY FALSE STATEMENT ON THIS APPLICATION.
                                        </div>

                                        <div className="text-xs font-bold underline mt-3">
                                            Records are filed in this office for the past 100 years: and over 100 years are available at the TN State Library and Archives.
                                        </div>

                                        <div className="text-[11px] font-normal text-justify mt-4 leading-relaxed">
                                            A fee of $15.00 is charged for the search of the records and includes one copy of the record if located. Search fees are non-refundable if the record is not on file. All items must be completed and appropriate fees attached to process this request. Do not send cash. Send check or money order payable to: Tennessee Vital Records. <strong><u>In addition, unless this application is notarized, you must send a photocopy of a VALID government issued ID showing your signature.</u></strong> If you have not received a response within 45 days, please write or call Tennessee Vital Records at (615) 741-1763.
                                        </div>

                                        <div className="border-t border-dashed border-black my-5"></div>

                                        <div className="text-center text-xs mb-4">
                                            PRINT NAME AND ADDRESS BELOW FOR OUR RECORDS<br />
                                            <strong className="text-[15px]">Please remember to include the Fee and a Copy of your ID.</strong> <span className="font-normal italic text-[10px] md:inline block">(Note: The request will be returned if not included.)</span>
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between mt-6 gap-6 md:gap-0">
                                            <div className="w-full md:w-[60%] space-y-4">
                                                <div className="flex flex-col">
                                                    <div className="border-b-2 border-slate-300 w-full pb-1 px-1 font-normal font-mono text-[13px] text-slate-500">{formData.mail_name}</div>
                                                    <span className="text-[10px] font-bold mt-1">Name</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="border-b-2 border-slate-300 w-full pb-1 px-1 font-normal font-mono text-[13px] text-slate-500">{formData.mail_address}</div>
                                                    <span className="text-[10px] font-bold mt-1">Address or Route</span>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex flex-col grow">
                                                        <div className="border-b-2 border-slate-300 w-full pb-1 px-1 font-normal font-mono text-[13px] text-slate-500">{formData.mail_city_state}</div>
                                                        <span className="text-[10px] font-bold mt-1">City and State</span>
                                                    </div>
                                                    <div className="flex flex-col w-32 md:w-32">
                                                        <div className="border-b-2 border-slate-300 w-full pb-1 px-1 font-normal font-mono text-[13px] text-slate-500">{formData.mail_zip}</div>
                                                        <span className="text-[10px] font-bold mt-1">Zip Code</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-[35%] text-center text-[13px] font-bold bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-lg">
                                                <u>Mail Your Application To:</u><br /><br />
                                                Tennessee Vital Records<br />
                                                Andrew Johnson Tower, 1<sup>st</sup> Floor<br />
                                                710 James Robertson Parkway<br />
                                                Nashville, TN 37243
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ERROR MESSAGE DISPLAY */}
                    {formError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 mt-6 animate-fade-in mx-auto w-fit shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {formError}
                        </div>
                    )}

                    {/* NAVIGATION BUTTONS */}
                    <div className="bg-slate-50 p-4 md:p-6 border-t border-slate-100 flex justify-between items-center rounded-b-2xl mt-4 shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)]">
                        {step > 1 ? (
                            <button onClick={prevStep} disabled={isSubmitting} className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors py-2 px-4">
                                &lt; Back
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 3 ? (
                            <button onClick={nextStep} className="btn-primary py-2.5 px-8 text-xs font-bold shadow-md shadow-blue-500/20">
                                {step === 1 ? 'Proceed to Payment >' : 'Pay & Access Form >'}
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary bg-green-600 hover:bg-green-700 py-2.5 px-8 text-xs font-bold shadow-md shadow-green-500/20 flex items-center gap-2 disabled:opacity-70">
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Generating Official PDF...
                                    </>
                                ) : (
                                    'Submit Official Application >'
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* STEP 4: SUCCESS / DOWNLOAD */}
                <div className={`transition-all duration-700 ease-in-out origin-top ${step === 4 ? 'scale-100 opacity-100' : 'scale-95 opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
                    {step === 4 && submissionDetails && (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-14 text-center space-y-6">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                                ✓
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-[#0b2545] tracking-tight">Application Generated!</h2>
                                <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">
                                    Your official Tennessee Department of Health application has been beautifully generated. Please download, print, sign, and mail it along with a copy of your valid ID.
                                </p>
                            </div>

                            <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200 inline-block text-left mb-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Submission Reference</p>
                                <p className="text-sm font-bold text-[#0f172a]">{submissionDetails.id}</p>
                            </div>

                            <div>
                                <button onClick={handleDownload} className="btn-primary py-3 px-8 text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 mx-auto">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Download Official PDF
                                </button>
                                <Link href="/" className="block mt-6 text-xs font-bold text-slate-400 hover:text-slate-600">
                                    Return to Home
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}