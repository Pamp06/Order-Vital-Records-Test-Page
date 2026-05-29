"use client";

import Link from 'next/link';

export default function CertificatesPage() {
  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-sans antialiased">
      {/* HEADER/NAVBAR */}
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
            <a href="#how-it-works" className="hover:text-[#2563eb] transition-colors">How It works</a>
            <a href="#states" className="hover:text-[#2563eb] transition-colors">Search States</a>
            <a href="#faq" className="hover:text-[#2563eb] transition-colors">Support</a>
            <a href="#benefits" className="hover:text-[#2563eb] transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-[#2563eb] transition-colors">Contact</a>
          </nav>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-4 shrink-0 z-10">
            <Link href="#certificates" className="btn-primary py-2 px-4 text-xs font-bold shadow-xs">
              Start Order &gt;
            </Link>
            <span className="text-xs font-bold text-slate-600 cursor-pointer hover:text-[#2563eb] transition-colors">
              Log In &gt;
            </span>
          </div>

        </div>
      </header>


      {/* RECORD SECTION*/}
      <section id="certificates" className="bg-[#f4f8fc]/60 text-black py-20 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-cyan-400/20 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center mb-16 space-y-2">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest block">Available Certificates</span>
            <h2 className="text-3xl font-black tracking-tight">Choose your record</h2>
            <p className="text-slate-700 text-sm max-w-xs mx-auto font-medium">Select the Certificate you need</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Birth Certificate', desc: 'Official proof of birth for passports, IDs, school enrollment, and more. Required for most applications.', imgName: 'card-birth.png' },
              { title: 'Wedding Records', desc: 'Required for name changes, health insurance, tax filing, and immigration purposes.', imgName: 'card-wedding.png' },
              { title: 'Divorce Certificate', desc: 'Necessary for name restoration, remarriage, property matters, and child custody documents.', imgName: 'card-divorce.png' },
              { title: 'Death Certificate', desc: 'Essential for estate settlement, insurance claims, property transfer, and closing accounts.', imgName: 'card-death.png' }
            ].map((cert, index) => (
              <div key={index} className="bg-white text-[#0f172a] rounded-xl p-6 shadow-sm flex flex-col justify-between items-start border border-slate-100 transition-all duration-300 hover:scale-[1.03] hover:border-blue-200/80 group">
                <div className="w-full">
                  <div className="w-full h-32 bg-[#f4f8fd] rounded-lg mb-4 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute w-24 h-24 bg-blue-400/25 blur-[20px] rounded-full pointer-events-none z-0" />
                    <img src={`/icons/${cert.imgName}`} alt={cert.title} className="h-30 object-contain relative z-10" />
                  </div>
                  <h4 className="text-base font-black tracking-tight mb-2 text-[#0b2545]">{cert.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">{cert.desc}</p>
                </div>

                <Link href="/form-flow" className="text-xs font-bold text-[#2563eb] border border-gray-400 rounded-lg px-5 py-1.5 hover:bg-blue-100 transition-colors flex items-center gap-1">
                  Continue order <span className="text-[9px]">&gt;</span>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* GOVERNMENT APPROVED SECTION */}
      <section className="bg-[#0b2545] py-20 relative overflow-hidden text-center text-white">
        {/* Background glow for premium feel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/15 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">
            AVAILABLE CERTIFICATES
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            US Government approved
          </h2>
          <p className="text-blue-100/80 text-sm max-w-xl mx-auto font-medium leading-relaxed">
            Our service is fast, secure and approved on a federal level to ensure validity of the document at the highest level.
          </p>

          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl max-w-4xl mx-auto mt-10 border border-slate-100 flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 filter grayscale opacity-90 py-2">
              <img src="/agencies/tn-health.png" alt="TN Dept of Health" className="h-10 md:h-12 object-contain" />
              <img src="/agencies/ok-health.png" alt="Oklahoma State Department of Health" className="h-10 md:h-12 object-contain" />
              <img src="/agencies/fl-health.png" alt="Florida Health" className="h-10 md:h-12 object-contain" />
              <img src="/agencies/wa-health.png" alt="Washington State Dept of Health" className="h-10 md:h-12 object-contain" />
              <img src="/agencies/ia-hhs.png" alt="Iowa HHS" className="h-10 md:h-12 object-contain" />
            </div>

            <div className="space-y-1 mt-2">
              <span className="text-2xl font-black text-[#0b2545] tracking-tight block">
                +100 MORE
              </span>
              <a href="#states" className="text-xs font-bold text-[#2563eb] hover:text-blue-700 transition-colors inline-flex items-center gap-0.5">
                See all <span className="text-[10px]">&gt;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATE DETAILS HEADER */}
      <section className="bg-linear-to-b from-[#e0ebf8]/40 via-[#f4f8fc]/20 to-white py-16 text-center relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-2">
          <h2 className="text-3xl font-black text-[#0b2545] tracking-tight">Certificate Details</h2>
          <p className="text-slate-600 text-xs md:text-sm max-w-xl mx-auto font-medium leading-relaxed">
            Check each certificate available and its common uses, timeline for delivery, pricing based on processing fees per each State.
          </p>
        </div>
      </section>

      {/* BIRTH CERTIFICATE */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">

          <div className="relative w-full max-w-md mx-auto aspect-4/3 sm:aspect-square flex items-center justify-center">
            <div className="absolute right-4 md:right-8 w-44 h-44 sm:w-65 sm:h-80 bg-gray-100/50 rounded-2xl border border-slate-100 shadow-md flex items-center justify-center p-6 sm:p-8 translate-x-18 translate-y-10">
              <div className="w-full h-full bg-[#f4f8fd] rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute w-16 h-16 bg-blue-400/25 blur-[15px] rounded-full pointer-events-none" />
                <img src="/icons/card-birth.png" alt="Birth Icon" className="h-35 object-contain relative z-10" />
              </div>
            </div>
            <div className="absolute left-4 md:left-8 w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden shadow-xl border border-white/20">
              <img src="/birth-image.png" alt="Birth Certificate" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-6 max-w-lg mx-auto md:mx-0 text-[#0f172a]">
            <div>
              <span className="text-xs font-bold text-[#2563eb] uppercase tracking-wider block mb-1">
                APPLICATION TYPE
              </span>
              <h3 className="text-3xl font-black text-[#0b2545] tracking-tight">
                Birth Certificate
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Official proof of birth required for passports, IDs, school enrollment, and various government applications.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-black text-[#0b2545] tracking-tight mb-2">
                Common Uses
              </h4>
              <ul className="gap-y-1.5 gap-x-4 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Passport applications
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> REAL ID / Driver's license
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> School enrollment
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Marriage license
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Social Security benefits
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Employment verification
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black text-[#0b2545] tracking-tight mb-1">
                Who can order
              </h4>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Self, parents, guardians, legal representative with proper documentation
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black text-[#0b2545] tracking-tight mb-1">
                Pricing & Timeline
              </h4>
              <p className="text-xs text-slate-600 font-semibold block">
                Starting at $35 (State Fee + Service & Shipping)
              </p>
              <p className="text-xs text-slate-600 font-semibold block">
                Delivery: Typically 2–4 weeks, varies by state.
              </p>
            </div>

            <Link href="#certificates" className="btn-primary py-2.5 px-6 text-xs font-bold mt-4 tracking-wide shadow-md shadow-blue-500/10 inline-flex items-center gap-1">
              Start Order <span className="text-[10px]">&gt;</span>
            </Link>
          </div>

        </div>
      </section>

      {/* WEDDING CERTIFICATE */}
      <section className="py-20 bg-[#f4f8fc]/60 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6 max-w-lg mx-auto md:mx-0 text-[#0f172a] order-2 md:order-1">
            <div>
              <span className="text-xs font-bold text-[#2563eb] uppercase tracking-wider block mb-1">
                APPLICATION TYPE
              </span>
              <h3 className="text-3xl font-black text-[#0b2545] tracking-tight">
                Wedding Certificate
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Official record of marriage required for name changes, insurance, tax filing, and immigration purposes.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-black text-[#0b2545] tracking-tight mb-2">
                Common Uses
              </h4>
              <ul className="gap-y-1.5 gap-x-4 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Name changes (SSA, DMV, passport)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Health insurance benefits
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Tax filing status
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Mortgage applications
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Immigration purposes
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Estate planning
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black text-[#0b2545] tracking-tight mb-1">
                Who can order
              </h4>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Either spouse or legal representative with proper identification.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black text-[#0b2545] tracking-tight mb-1">
                Pricing & Timeline
              </h4>
              <p className="text-xs text-slate-600 font-semibold block">
                Starting at $35 (State Fee + Service & Shipping)
              </p>
              <p className="text-xs text-slate-600 font-semibold block">
                Delivery: Typically 2–4 weeks, varies by state.
              </p>
            </div>

            <Link href="#certificates" className="btn-primary py-2.5 px-6 text-xs font-bold mt-4 tracking-wide shadow-md shadow-blue-500/10 inline-flex items-center gap-1">
              Start Order <span className="text-[10px]">&gt;</span>
            </Link>
          </div>

          <div className="relative w-full max-w-md mx-auto aspect-4/3 sm:aspect-square flex items-center justify-center order-1 md:order-2">
            {/* White card behind */}
            <div className="absolute right-4 md:right-8 w-44 h-44 sm:w-65 sm:h-80 bg-gray-100/50 rounded-2xl border border-slate-100 shadow-md flex items-center justify-center p-6 sm:p-8 translate-x-18 translate-y-10">
              <div className="w-full h-full bg-[#f4f8fd] rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute w-16 h-16 bg-blue-400/25 blur-[15px] rounded-full pointer-events-none" />
                <img src="/icons/card-wedding.png" alt="Wedding Icon" className="h-35 object-contain relative z-10" />
              </div>
            </div>
            <div className="absolute left-4 md:left-8 w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden shadow-xl border border-white/20">
              <img src="/wedding-image.png" alt="Wedding Certificate" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* DIVORCE CERTIFICATE */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">

          <div className="relative w-full max-w-md mx-auto aspect-4/3 sm:aspect-square flex items-center justify-center">
            <div className="absolute right-4 md:right-8 w-44 h-44 sm:w-65 sm:h-80 bg-gray-100/50 rounded-2xl border border-slate-100 shadow-md flex items-center justify-center p-6 sm:p-8 -translate-x-58 translate-y-10">
              <div className="w-full h-full bg-[#f4f8fd] rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute w-16 h-16 bg-blue-400/25 blur-[15px] rounded-full pointer-events-none" />
                <img src="/icons/card-divorce.png" alt="Divorce Icon" className="h-35 object-contain relative z-10" />
              </div>
            </div>
            <div className="absolute right-4 md:right-8 w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden shadow-xl border border-white/20">
              <img src="/divorce-image.png" alt="Divorce Certificate" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-6 max-w-lg mx-auto md:mx-0 text-[#0f172a]">
            <div>
              <span className="text-xs font-bold text-[#2563eb] uppercase tracking-wider block mb-1">
                APPLICATION TYPE
              </span>
              <h3 className="text-3xl font-black text-[#0b2545] tracking-tight">
                Divorce Certificate
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Official record of divorce decrees necessary for name restoration, remarriage, and legal matters.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-black text-[#0b2545] tracking-tight mb-2">
                Common Uses
              </h4>
              <ul className="gap-y-1.5 gap-x-4 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Quis tellus eget
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> adipiscing convallis
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> sit eget aliquet quis
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Suspendisse eget egestas
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black text-[#0b2545] tracking-tight mb-1">
                Who can order
              </h4>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Self, parents, guardians, legal representative with proper documentation
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black text-[#0b2545] tracking-tight mb-1">
                Pricing & Timeline
              </h4>
              <p className="text-xs text-slate-600 font-semibold block">
                Starting at $35 (State Fee + Service & Shipping)
              </p>
              <p className="text-xs text-slate-600 font-semibold block">
                Delivery: Typically 2–4 weeks, varies by state.
              </p>
            </div>

            <Link href="#certificates" className="btn-primary py-2.5 px-6 text-xs font-bold mt-4 tracking-wide shadow-md shadow-blue-500/10 inline-flex items-center gap-1">
              Start Order <span className="text-[10px]">&gt;</span>
            </Link>
          </div>

        </div>
      </section>

      {/* DEATH CERTIFICATE */}
      <section className="py-20 bg-[#f4f8fc]/60 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6 max-w-lg mx-auto md:mx-0 text-[#0f172a] order-2 md:order-1">
            <div>
              <span className="text-xs font-bold text-[#2563eb] uppercase tracking-wider block mb-1">
                APPLICATION TYPE
              </span>
              <h3 className="text-3xl font-black text-[#0b2545] tracking-tight">
                Death Certificate
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Official record of death essential for estate settlement, insurance claims, and property matters.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-black text-[#0b2545] tracking-tight mb-2">
                Common Uses
              </h4>
              <ul className="gap-y-1.5 gap-x-4 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Life insurance claims
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Estate settlement
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Property transfer
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Close bank accounts
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Cancel subscriptions
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#2563eb] font-bold text-sm">•</span> Social Security benefits
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black text-[#0b2545] tracking-tight mb-1">
                Who can order
              </h4>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Immediate family, legal representative, or beneficiaries with proper authorization.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black text-[#0b2545] tracking-tight mb-1">
                Pricing & Timeline
              </h4>
              <p className="text-xs text-slate-600 font-semibold block">
                Starting at $35 (State Fee + Service & Shipping)
              </p>
              <p className="text-xs text-slate-600 font-semibold block">
                Delivery: Typically 2–4 weeks, varies by state.
              </p>
            </div>

            <Link href="#certificates" className="btn-primary py-2.5 px-6 text-xs font-bold mt-4 tracking-wide shadow-md shadow-blue-500/10 inline-flex items-center gap-1">
              Start Order <span className="text-[10px]">&gt;</span>
            </Link>
          </div>

          <div className="relative w-full max-w-md mx-auto aspect-4/3 sm:aspect-square flex items-center justify-center order-1 md:order-2">
            {/* White card behind */}
            <div className="absolute right-4 md:right-8 w-44 h-44 sm:w-65 sm:h-80 bg-gray-100/50 rounded-2xl border border-slate-100 shadow-md flex items-center justify-center p-6 sm:p-8 translate-x-18 translate-y-10">
              <div className="w-full h-full bg-[#f4f8fd] rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute w-16 h-16 bg-blue-400/25 blur-[15px] rounded-full pointer-events-none" />
                <img src="/icons/card-death.png" alt="Death Icon" className="h-40 object-contain relative z-10" />
              </div>
            </div>
            <div className="absolute left-4 top-15 md:left-10 w-56 h-72 sm:w-50 sm:h-50 rounded-2xl overflow-hidden shadow-xl border border-white/20">
              <img src="/death-image.png" alt="Death Certificate" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* ANOTHER INFORMATIVE SECTION*/}
      <section id="contact" className="py-45 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-blue-50/60 to-transparent pointer-events-none flex items-center justify-center">
          <span className="text-[14rem] font-black text-blue-50/20 tracking-tighter select-none">EF</span>
        </div>

        {/* BACKGROUND IMAGES DECORATION*/}
        <img src="/back-flag.png" alt="Decoration"
          className="absolute top-40 left-1/2 -translate-x-50 -translate-y-1/2 w-100 opacity-[0.30] object-contain select-none" />

        <div className="max-w-2xl mx-auto text-center px-4 relative z-10 space-y-6">
          <h2 className="text-4xl font-black text-[#0f172a] tracking-tight">
            Get your Certificate today
          </h2>
          <p className="text-xs text-slate-700 font-medium leading-relaxed max-w-sm mx-auto">
            Begin your simple, secure application process today. <br />
            Questions? Call us at <span className="text-[#2563eb] font-bold cursor-pointer">(833) 366-3409</span> or <br />
            email <span className="text-[#2563eb] font-bold cursor-pointer">support@ordervitalrecords.com</span>
          </p>

          <div className="space-y-3 max-w-xs mx-auto pt-4">
            <Link href="#certificates" className="w-full btn-primary block text-center font-bold text-xs uppercase tracking-wider py-3.5 shadow-md shadow-blue-500/20">
              Start Order &gt;
            </Link>
            <button className="w-full bg-[#f4f8fd] hover:bg-slate-100 text-[#2563eb] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all border border-slate-200/40">
              Contact Us &gt;&gt;
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1a1a1a] text-slate-700 py-16 border-t border-slate-800 text-xs font-semibold select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid md:grid-cols-3 gap-12 items-center border-b border-slate-800 pb-12">

            <div className="flex items-center gap-2">
              <img src="/flag-us.png" alt="ORDER VITAL RECORDS" className="h-5 object-contain" />
              <span className="text-white font-black tracking-tight text-xs uppercase">
                ORDER VITAL RECORDS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-slate-700 text-xs">
              <a href="#certificates" className="hover:text-white transition-colors">Certificates</a>
              <a href="#faq" className="hover:text-white transition-colors">Support</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It works</a>
              <a href="#benefits" className="hover:text-white transition-colors">Pricing</a>
              <a href="#states" className="hover:text-white transition-colors">Search States</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>

            <div className="space-y-4">
              <Link href="#certificates" className="btn-primary bg-[#0080ff] hover:bg-blue-600 block text-center py-2 text-xs font-bold rounded-md">
                Start Order &gt;
              </Link>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between text-slate-500 font-medium text-[11px] gap-4">
            <p className="max-w-md leading-relaxed">
              Lorem Ipsum ure sed ab. Aperiam optio placeat dolor facere. Officiis pariatur eveniet atque et dolor.
            </p>
            <p className="sm:text-right shrink-0">
              © 2026 Order Vital Records. Intake system assistant environment.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}