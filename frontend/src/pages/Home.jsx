import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import { servicesService, productsService, getMediaUrl } from '../services/api';
import GlassCard from '../components/Common/GlassCard';
import { LoadingSpinner } from '../components/Common/Loading';
import { ArrowRight, Star, Plus, Minus, ShieldCheck, Zap, Award } from 'lucide-react';

const Home = () => {
  const { details } = useCompany();
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FAQ Accordion State
  const [faqOpen, setFaqOpen] = useState({});

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const [servicesRes, productsRes] = await Promise.all([
          servicesService.getAll(),
          productsService.getAll(),
        ]);
        if (servicesRes.success) setServices(servicesRes.data.slice(0, 3));
        if (productsRes.success) setProducts(productsRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load page highlights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  const toggleFaq = (index) => {
    setFaqOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqs = [
    {
      q: 'What industries do you specialize in?',
      a: 'We specialize in building tailored digital products for financial technology, SaaS start-ups, modern retail, e-commerce, cloud infrastructure, and education sectors.',
    },
    {
      q: 'How long does a custom web application take to build?',
      a: 'Standard custom web applications take anywhere from 4 to 12 weeks depending on database architecture complexity, features, integrations, and testing cycles.',
    },
    {
      q: 'Do you offer hosting and maintenance post-launch?',
      a: 'Yes, we provide fully-managed cloud hosting (AWS/Vercel) and 24/7 security maintenance plans to ensure zero downtime and optimal page speeds.',
    },
    {
      q: 'Can we integrate custom payment gateways?',
      a: 'Absolutely. We regularly integrate secure checkout portals including Stripe, PayPal, Razorpay, and direct bank transfer processors.',
    },
  ];

  return (
    <div className="pb-16 relative overflow-hidden">

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
        {/* Glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Col: Headings */}
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 self-center lg:self-start px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/25">
                <Zap size={12} />
                Connecting Business Opportunities


              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans leading-[2.15]">
                InspiringEntrepreneurs {' '}
                <span className="bg-gradient-to-r from-primary-500 via-sky-400 to-cyan-500 bg-clip-text text-transparent text-glow">
                  Worldwide..
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {details?.description ||
                  'World Entrepreneurs Export & Import (PVT) LTD is a Sri Lanka-based direct marketing and international trading company. The company focuses on entrepreneur development, leadership training, export and import services, and business growth opportunities. It works to connect local products with global markets while supporting young entrepreneurs through teamwork, communication, and management training. The company’s vision is to become a leading direct marketing and export-import company in Sri Lanka'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-primary-500/20 transition-all duration-300 hover:scale-105"
                >
                  Start Project
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-base font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-300"
                >
                  Our Services
                </Link>
              </div>
            </div>


            {/* Right Col: Hero Image */}
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/20 border border-white/20 dark:border-slate-800">
              <img
                src="https://i.pinimg.com/originals/e6/d9/12/e6d9123a7be4e90e470e4fc31c083caf.png"
                alt="Global Trade and Export Import"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />


            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Strengths Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">




        </div>
      </section>

      {/* 3. Services Highlights */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Our Core Services</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            We provide comprehensive development, UI systems, and backend engineering packages to help businesses scale.
          </p>
        </div>

        {
          loading ? (
            <LoadingSpinner className="my-12" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service) => (
                <GlassCard key={service._id} className="flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-4">
                    {service.image ? (
                      <img
                        src={getMediaUrl(service.image)}
                        alt={service.title}
                        className="w-full h-40 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-lg">
                        S
                      </div>
                    )}
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    to="/services"
                    className="mt-6 flex items-center gap-1 text-sm font-bold text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    Learn More <ArrowRight size={14} />
                  </Link>
                </GlassCard>
              ))}
            </div>
          )
        }
      </section>

      {/* 4. Products Highlights */}
      <section className="py-16 bg-slate-100/50 dark:bg-darkBg-darker/30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center flex flex-col gap-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Trending Products</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Explore our production-ready UI kits, boilerplates, and SaaS systems designed for rapid digital deployment.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner className="my-12" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <GlassCard key={product._id} className="flex flex-col h-full overflow-hidden p-0 rounded-2xl group border border-slate-200 dark:border-slate-800">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={getMediaUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-lg font-bold text-slate-850 dark:text-white line-clamp-1">{product.name}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    </div>
                    <Link
                      to="/products"
                      className="mt-6 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold bg-primary-500 hover:bg-primary-600 text-white transition-colors duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </section>

    </GlassCard>
          
        </div >
      </section >



  {/* 7. Call To Action Banner */ }
  < section className = "py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12" >
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-sky-600 p-8 sm:p-12 text-center text-white shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-6 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to launch your digital platform?</h2>
        <p className="text-base text-sky-100 max-w-lg mx-auto leading-relaxed">
          Connect with our digital architecture consultants today to scope your software specifications and receive a free technical estimate.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Link
            to="/contact"
            className="px-8 py-3.5 rounded-xl font-bold bg-white text-primary-600 hover:bg-slate-50 shadow-md hover:scale-105 transition-all duration-300"
          >
            Get In Touch
          </Link>
          <Link
            to="/about"
            className="px-8 py-3.5 rounded-xl font-bold border border-white/20 hover:bg-white/10 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
      </section >

    </div >
  );
};

export default Home;
