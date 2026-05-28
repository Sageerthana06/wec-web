import React, { useState, useEffect } from 'react';
import { servicesService, getMediaUrl } from '../services/api';
import GlassCard from '../components/Common/GlassCard';
import { LoadingSpinner, SkeletonCard } from '../components/Common/Loading';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper component to render Lucide Icons dynamically by name
const DynamicIcon = ({ name, className, size = 24 }) => {
  const IconComponent = LucideIcons[name] || LucideIcons.Activity;
  return <IconComponent className={className} size={size} />;
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesService.getAll();
        if (res.success) {
          setServices(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
      
      {/* Title */}
      <div className="text-center flex flex-col gap-4 mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-primary-500">What We Do</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Our Core Services</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          We combine cutting-edge tech stacks and clean architecture designs to construct digital platforms that scale.
        </p>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-500 font-bold">{error}</div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No services available at this time.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <GlassCard key={service._id} className="flex flex-col justify-between h-full p-8 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col gap-5">
                {/* Icon or Image */}
                {service.image ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-2">
                    <img
                      src={getMediaUrl(service.image)}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center shadow-inner">
                    <DynamicIcon name={service.icon} size={28} />
                  </div>
                )}
                
                <h3 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <Link
                  to="/contact?subject=Inquiry regarding: "
                  className="text-sm font-bold text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  Consult Now &rarr;
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* CTA Box */}
      <section className="mt-20 text-center glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-500/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Need a Bespoke Solution?</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Our engineers build customized solutions tailored to your complex logic models. Reach out to schedule a scoping interview.
          </p>
          <div>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 rounded-xl font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-lg transition-transform hover:scale-105 duration-300"
            >
              Request Scoping Session
            </Link>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
};

export default Services;
