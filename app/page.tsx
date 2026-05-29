"use client"; 123

import { useState, ChangeEvent } from 'react';
import Link from 'next/link';

const USAMap = require('react-usa-map').default || require('react-usa-map');

export default function HomePage() {
  const [SelState, setSelState] = useState<string>("TN");

  const MapClick = (event: any) => {
    if (event?.target?.dataset?.name) {
      setSelState(event.target.dataset.name);
    }
  };

  const ComboSync = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelState(event.target.value);
  };

  const PerState = {
    [SelState]: {
      fill: "#1e3a8a",
    },
  };

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
            <Link href="/certificates" className="btn-primary py-2 px-4 text-xs font-bold shadow-xs">
              Start Order &gt;
            </Link>
            <span className="text-xs font-bold text-slate-600 cursor-pointer hover:text-[#2563eb] transition-colors">
              Log In &gt;
            </span>
          </div>

        </div>
      </header>

      {/* HERO SECTION*/}
      <section className="relative bg-linear-to-b from-[#e0ebf8]/40 via-[#f4f8fc]/20 to-white py-16 lg:py-24 border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

          {/* BACKGROUND GLOW */}
          <div className="absolute top-0 right-0 w-125 h-125 bg-blue-400/10 blur-[120px] rounded-full" />

          {/* BACKGROUND IMAGES DECORATION */}
          <img src="/back-flag.png" alt="Decoration"
            className="absolute top-12 -left-15 w-60 opacity-[0.50] object-contain select-none" />

          <img src="/back-flag.png" alt="Decoration"
            className="absolute bottom-8 -left-8 w-40 opacity-[0.50] object-contain select-none" />

          <img src="/back-flag.png" alt="Decoration"
            className="absolute top-75 left-1/2 -translate-x-25 -translate-y-1/2 w-55 opacity-[0.90] object-contain select-none" />

          <img src="/back-flag.png" alt="Decoration"
            className="absolute top-16 -right-4 w-35 opacity-[0.50] object-contain select-none" />

          <img src="/back-flag.png" alt="Decoration"
            className="absolute bottom-80 right-25 w-40 opacity-[0.80] object-contain select-none" />

        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <img src="/flag-us.png" alt="US Vital Badge" className="h-18 object-contain" />
            <div className="space-y-2">
              <span className="text-[#2563eb] text-xs font-bold uppercase tracking-wider block">
                US Vital Records Certificates
              </span>
              <h1 className="text-4xl lg:text-5xl font-black text-[#0f172a] tracking-tight leading-tight">
                Order your Vital <br />
                Records online
              </h1>
            </div>

            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Simple. Secure. Delivered to your door. <br />
              Available in all 50 States.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-100/80 max-w-md mx-auto w-full space-y-5">
            <div>
              <span className="text-[#2563eb] text-xs font-bold block mb-1">Order Vital record</span>
              <h3 className="text-xl font-black text-[#0f172a] tracking-tight">Select the record you need</h3>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <select className="input-form pl-10 appearance-none bg-no-repeat bg-position-[right_12px_center]">
                  <option>Document type</option>
                  <option>Birth Certificate</option>
                  <option>Marriage Certificate</option>
                  <option>Divorce Certificate</option>
                  <option>Death Certificate</option>
                </select>
                <span className="absolute left-3.5 top-3.5 text-xs text-slate-700"> </span>
              </div>
              <div className="relative">
                <input type="email" placeholder="Email" className="input-form pl-10" />
                <span className="absolute left-3.5 top-3.5 text-xs text-slate-700"> </span>
              </div>
              <div className="relative">
                <input type="email" placeholder="Email" className="input-form pl-10" />
                <span className="absolute left-3.5 top-3.5 text-xs text-slate-700"> </span>
              </div>
              <div className="relative">
                <select className="input-form pl-10 appearance-none">
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
                <span className="absolute left-3.5 top-3.5 text-xs text-slate-700"> </span>
              </div>

              <Link href="/certificates" className="w-full btn-primary block text-center font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg shadow-sm">
                Start Order &gt;
              </Link>

              <button type="button" className="w-full bg-[#f0f6fe] hover:bg-[#e2effe] text-[#2563eb] font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-colors flex items-center justify-center gap-1">
                Expedited Process &gt;&gt;
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-16 pt-8 border-t border-slate-100 px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-80 filter grayscale hover:grayscale-0 transition-all duration-300">
            <img src="/agencies/tn-health.png" alt="TN Dept of Health" className="h-16 object-contain" />
            <img src="/agencies/ok-health.png" alt="Oklahoma State Department of Health" className="h-16 object-contain" />
            <img src="/agencies/fl-health.png" alt="Florida Health" className="h-16 object-contain" />
            <img src="/agencies/wa-health.png" alt="Washington State Dept of Health" className="h-16 object-contain" />
            <img src="/agencies/ia-hhs.png" alt="Iowa HHS" className="h-16 object-contain" />
          </div>
        </div>
      </section>

      {/* RECORD SECTION*/}
      <section id="certificates" className="bg-[#0b2545] text-white py-20 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-blue-500/20 blur-[130px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-cyan-400/20 blur-[110px] rounded-full pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* BACKGROUND IMAGES DECORATION*/}
          <img src="/back-flag.png" alt="Decoration"
            className="absolute top-17 -left-17 w-80 opacity-[0.15] object-contain select-none" />

          <img src="/back-flag.png" alt="Decoration"
            className="absolute top-32 -right-25 w-135 opacity-[0.15] object-contain select-none" />

          <div className="text-center mb-16 space-y-2">
            <span className="text-xs font-bold text-[#4474db] uppercase tracking-widest block">Available Certificates</span>
            <h2 className="text-3xl font-black tracking-tight">Choose your record</h2>
            <p className="text-white text-sm max-w-xs mx-auto font-medium">Select the Certificate you need</p>
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
                    {/* Small radial glow behind the icon */}
                    <div className="absolute w-24 h-24 bg-blue-400/25 blur-[20px] rounded-full pointer-events-none z-0" />
                    <img src={`/icons/${cert.imgName}`} alt={cert.title} className="h-30 object-contain relative z-10" />
                  </div>
                  <h4 className="text-base font-black tracking-tight mb-2 text-[#0b2545]">{cert.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">{cert.desc}</p>
                </div>

                <Link href="/certificates" className="text-xs font-bold text-[#2563eb] border border-gray-400 rounded-lg px-5 py-1.5 hover:bg-blue-100 transition-colors flex items-center gap-1">
                  Continue order <span className="text-[9px]">&gt;</span>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* MAP SECTION */}
      <section id="states" className="py-20 bg-[#f4f8fc]/60 border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight">Available in all 50 states</h2>
            <p className="text-slate-500 text-sm font-semibold">Select your state to get started</p>
          </div>

          {/* COMBOBOX SYNC WITH MAP SELECTOR*/}
          <div className="max-w-md mx-auto bg-[#0a192f] p-3 rounded-lg shadow-md flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 shrink-0 pl-2">Select State:</span>
            <div className="relative w-full">
              <select
                value={SelState}
                onChange={ComboSync}
                className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-bold text-[#0f172a] outline-none cursor-pointer"
              >
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

          <div className="w-full max-w-max mx-auto pt-6 p-6 map-container">
            <USAMap
              customize={PerState}
              onClick={MapClick}
              defaultFill="#3b82f6" />
          </div>

        </div>

      </section>

      {/* 3 STEPS AREA */}
      <section id="how-it-works" className="py-20 bg-linear-to-b from-white via-[#f4f8fc]/40 to-white border-b border-slate-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">

          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest block">Headline Title</span>
            <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">Three Steps to your certificate</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { num: '1', step: 'Select Certificate', desc: 'Choose your state and certificate type. See instant pricing and processing times.' },
              { num: '2', step: 'Apply Details', desc: 'Complete our secure online form in minutes. Upload required documents safely.' },
              { num: '3', step: 'Receive Record', desc: 'We process and deliver your certificate directly to your door with tracking.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-xl shadow-xs space-y-3">
                <span className="text-4xl font-black text-[#2563eb] block">{item.num}</span>
                <h4 className="text-base font-black text-[#0f172a] tracking-tight">{item.step}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>

          <button className="btn-primary px-8 shadow-md">
            How It Works &gt;
          </button>
        </div>
      </section>

      {/* INFORMATIVE SECTION */}
      <section id="benefits" className="py-20 bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#2563eb] block">Everything you need</span>
          <h2 className="text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight max-w-xl">
            Fast and Secure vital records, US governement approved
          </h2>
          <p className="text-sm text-slate-700 font-semibold max-w-2xl">
            24/7 access from any device. No office visits required. Start your application whenever it's convenient for you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {[
            { title: 'Legal validity in 50 States', d: '24/7 access from any device. No office visits required. Start your application whenever it\'s convenient for you.', icon: '☁️' },
            { title: 'Government certified', d: 'Bank-level encryption and HIPAA compliance. Your personal information is always protected.', icon: '🔒' },
            { title: 'Simple and Fast orders', d: '24/7 access from any device. No office visits required. Start your application whenever it\'s convenient for you.', icon: '🔄' },
            { title: 'Advanced security', d: 'Bank-level encryption and HIPAA compliance. Your personal information is always protected.t', icon: '🧬' },
            { title: 'Skip the Lines', d: 'No waiting at government offices. We handle everything and deliver directly to your door.', icon: '⚙️' },
            { title: 'No paerwork', d: 'Digital forms that are simple and secure. Complete your application online in just 10 minutes.', icon: '💻' }
          ].map((benefit, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base text-[#2563eb] font-bold">{benefit.icon}</span>
                <h4 className="text-xs font-black text-[#0f172a] uppercase tracking-wider">{benefit.title}</h4>
              </div>
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed pl-6">{benefit.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT AND FAQ SECTION */}
      <section id="faq" className="bg-[#0b2545] text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <h2 className="text-3xl font-black text-center tracking-tight">Questions? We have answers.</h2>

          <div className="grid md:grid-cols-2 gap-4 items-start">
            <div className="space-y-3">
              <details className="group bg-white p-4 rounded-lg cursor-pointer text-[#0f172a] border border-slate-200">
                <summary className="flex items-center justify-between font-bold text-xs">
                  <span>Does it work in all 50 States?</span>
                  <span className="text-slate-700 group-open:rotate-180 font-bold">&gt;</span>
                </summary>
                <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t font-medium leading-relaxed">Yes, all files and formats connect directly with official records across every state database.</p>
              </details>
              <details className="group bg-white p-4 rounded-lg cursor-pointer text-[#0f172a] border border-slate-200">
                <summary className="flex items-center justify-between font-bold text-xs">
                  <span>Lorem Ipsum dolor sit amet?</span>
                  <span className="text-slate-700 group-open:rotate-180 font-bold">&gt;</span>
                </summary>
                <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t font-medium leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
              </details>
              <details className="group bg-white p-4 rounded-lg cursor-pointer text-[#0f172a] border border-slate-200">
                <summary className="flex items-center justify-between font-bold text-xs">
                  <span>Lorem Ipsum dolor sit amet?</span>
                  <span className="text-slate-700 group-open:rotate-180 font-bold">&gt;</span>
                </summary>
                <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t font-medium leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
              </details>
            </div>

            <div className="space-y-3">
              <details className="group bg-white p-4 rounded-lg cursor-pointer text-[#0f172a] border border-slate-200" open>
                <summary className="flex items-center justify-between font-bold text-xs">
                  <span>Lorem Ipsum dolor sit amet?</span>
                  <span className="text-slate-700 group-open:rotate-180 font-bold">▾</span>
                </summary>
                <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t font-medium space-y-2 leading-relaxed bg-[#f8fafc] p-3 rounded-md">
                  <p><strong className="text-[#0f172a]">Government certified.</strong> Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.</p>
                </div>
              </details>
              <details className="group bg-white p-4 rounded-lg cursor-pointer text-[#0f172a] border border-slate-200">
                <summary className="flex items-center justify-between font-bold text-xs">
                  <span>Lorem Ipsum dolor sit amet?</span>
                  <span className="text-slate-700 group-open:rotate-180 font-bold">&gt;</span>
                </summary>
                <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t font-medium leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
              </details>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button className="btn-primary bg-[#0080ff] hover:bg-blue-600 px-8 text-xs font-bold shadow-sm">
              Support & FAQ &gt;
            </button>
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
            <Link href="/certificates" className="w-full btn-primary block text-center font-bold text-xs uppercase tracking-wider py-3.5 shadow-md shadow-blue-500/20">
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
              <Link href="/certificates" className="btn-primary bg-[#0080ff] hover:bg-blue-600 block text-center py-2 text-xs font-bold rounded-md">
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
