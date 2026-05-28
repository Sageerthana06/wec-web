import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import { messageService } from '../services/api';
import GlassCard from '../components/Common/GlassCard';
import { showToast } from '../components/Common/Toast';
import { Phone, Mail, MapPin, Send, Loader2 } from 'lucide-react';

const Contact = () => {
  const { details } = useCompany();
  const location = useLocation();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Check URL query parameters for dynamic subject (e.g. from services or products pages)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subjectParam = params.get('subject');
    if (subjectParam) {
      setFormData((prev) => ({
        ...prev,
        subject: subjectParam,
      }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const res = await messageService.send(formData);
      if (res.success) {
        showToast('success', 'Inquiry message submitted successfully! We will email you shortly.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }
    } catch (error) {
      showToast('error', error.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">

      {/* Title */}
      <div className="text-center flex flex-col gap-4 mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Get In Touch</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-sans">Contact Our Team</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Submit your product specifications or scheduling inquiries. Our engineering consultants respond within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Contact details & Map */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold font-sans">Office Locations</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Drop by our tech hub office or send an email to connect directly with our managers.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <GlassCard className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800" hover={false}>
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-bold uppercase">Main Address</span>
                <span className="text-sm font-semibold">{details?.address || 'No,348, Stanly Road, Jaffna.'}</span>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800" hover={false}>
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center flex-shrink-0">
                <Phone size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-bold uppercase">Direct Phone</span>
                <span className="text-sm font-semibold">{details?.phone || '021 722 3317'}</span>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800" hover={false}>
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center flex-shrink-0">
                <Mail size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-bold uppercase">Work Email</span>
                <span className="text-sm font-semibold">{details?.email || 'Worldentrepreneurs78@gmail.com'}</span>
              </div>
            </GlassCard>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full h-64 rounded-2xl overflow-hidden glass-panel border border-slate-200 dark:border-slate-800 shadow-md">
            {details?.mapEmbedUrl ? (
              <iframe
                title="Google Map Embed"
                src={details.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-500">
                Map Unavailable
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7">
          <GlassCard className="p-8 sm:p-10 border border-slate-200 dark:border-slate-850" hover={false}>
            <h3 className="text-2xl font-bold font-sans mb-6">Send an Inquiry</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="px-4 py-2.5 rounded-xl border glass-input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="px-4 py-2.5 rounded-xl border glass-input"
                  />
                </div>
              </div>

              {/* Row 2: Phone and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +1 (555) 123-4567"
                    className="px-4 py-2.5 rounded-xl border glass-input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Inquiry topic"
                    className="px-4 py-2.5 rounded-xl border glass-input"
                  />
                </div>
              </div>

              {/* Row 3: Message */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Detail your requirements here..."
                  className="px-4 py-3 rounded-xl border glass-input resize-none"
                />
              </div>

              {/* Submit button */}
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/10 disabled:opacity-70 transition-all hover:scale-102 duration-300"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending Inquiry...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Form
                    </>
                  )}
                </button>
              </div>

            </form>
          </GlassCard>
        </div>
      </div>

      </div>
    </div>
  );
};

export default Contact;
