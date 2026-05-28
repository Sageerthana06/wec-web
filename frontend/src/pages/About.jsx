import React from 'react';
import { useCompany } from '../context/CompanyContext';
import GlassCard from '../components/Common/GlassCard';
import { Target, Compass, Users, CheckCircle, Shield } from 'lucide-react';

const About = () => {
  const { details } = useCompany();

  const stats = [
    { label: 'Years Experience', value: '7+' },
    { label: 'Current Staff', value: '250+' },
    { label: 'Retention Rate', value: '99%' },
  ];

  return (
    <div className="w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">

        {/* Page Title Banner */}
        <div className="text-center flex flex-col gap-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Who We Are</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">About Our Company</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Discover our values, historical journey, and the core philosophies guiding our technical development.
          </p>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Left Side: Mock graphic or illustration card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative glass-panel rounded-3xl p-8 max-w-[400px] w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle size={22} />
                </div>
                <span className="font-bold text-sm">Premium Product Quality</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center">
                  <Users size={22} />
                </div>
                <span className="font-bold text-sm">24/7 Client Support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Shield size={22} />
                </div>
                <span className="font-bold text-sm">Trusted Export & Import</span>
              </div>
            </div>
          </div>

          {/* Right Side: Text description */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-850 dark:text-white">
              Empowering businesses with strategic direct marketing.
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {details?.description ||
                'World Entrepreneurs Export & Import (PVT) LTD is a premier trading company based in Jaffna, Sri Lanka, specializing in the import and export of quality goods. We connect businesses across global markets with trust, reliability, and excellence.'}
            </p>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              We operate at the intersection of robust backend scalability and premium visual aesthetics. By prioritizing user journey pathways and lightning-fast loading architectures, we construct website codebases and SaaS structures that perform reliably.
            </p>
          </div>
        </div>

        {/* Mission & Vision grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <GlassCard className="flex flex-col gap-4 p-8 relative overflow-hidden" hover={false}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl translate-x-4 -translate-y-4" />
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-bold font-sans">Our Mission</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
              {details?.mission ||
                'To empower local manufacturers by providing seamless global market access through innovative direct marketing and trusted trading solutions.'}
            </p>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4 p-8 relative overflow-hidden" hover={false}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl translate-x-4 -translate-y-4" />
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Compass size={24} />
            </div>
            <h3 className="text-2xl font-bold font-sans">Our Vision</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
              {details?.vision ||
                'To be a premier global trading hub recognized for unmatched reliability, sustainable supply chains, and driving economic growth across borders.'}
            </p>
          </GlassCard>
        </div>

        {/* Statistics Section */}
        <section className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-sky-500/5 pointer-events-none" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary-500 text-glow">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
