import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import { getMediaUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, Phone, Mail, MapPin, LogOut, User, Send } from 'lucide-react';
import { showToast } from '../components/Common/Toast';

const Layout = ({ children }) => {
  const { details, loading } = useCompany();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize dark mode from system preference or local storage
  useEffect(() => {
    const isDark =
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
      showToast('info', 'Light mode activated');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
      showToast('info', 'Dark mode activated');
    }
  };

  const handleLogout = () => {
    logout();
    showToast('success', 'Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  const whatsappNumber = details?.whatsapp || '0770287429';
  const whatsappText = encodeURIComponent("Hello! I visited your website and would like to know more about your services.");
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappText}`;

  return (
    <div className="min-h-screen flex flex-col bg-mesh-gradient-light dark:bg-bg-mesh-gradient text-slate-800 dark:text-slate-100 transition-colors duration-300">

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 glass-nav w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <img
                  src={details?.logo ? getMediaUrl(details.logo) : '/logo.jpg'}
                  alt={details?.name || 'World Entrepreneurs Company'}
                  className="w-12 h-12 rounded-xl object-contain group-hover:scale-105 transition-transform duration-300 shadow-md"
                />
                <span className="font-sans font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-600 to-sky-500 dark:from-primary-400 dark:to-sky-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                  {details?.name || 'World Entrepreneurs Company'}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${isActive(link.path)
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-primary-600 dark:hover:text-primary-400 border border-transparent'
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${isActive('/admin')
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
                    }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Dark mode button */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
              </button>

              {/* Login / Logout */}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 transition-colors duration-300"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-300"
                >
                  <User size={16} />
                  <span>System</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger menu trigger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors mr-1"
              >
                {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel-heavy border-t border-slate-200 dark:border-slate-800 py-4 px-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-semibold tracking-wide transition-all ${isActive(link.path)
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-semibold tracking-wide transition-all ${isActive('/admin')
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
              >
                Admin Dashboard
              </Link>
            )}

            <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-bold text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 transition-colors duration-300"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-300"
                >
                  <User size={18} />
                  <span>System Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-darkBg-darker border-t border-slate-200 dark:border-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Info */}
            <div className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={details?.logo ? getMediaUrl(details.logo) : '/logo.jpg'}
                  alt={details?.name || 'World Entrepreneurs Company'}
                  className="w-10 h-10 rounded-lg object-contain"
                />
                <span className="font-sans font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary-600 to-sky-500 dark:from-primary-400 dark:to-sky-300 bg-clip-text text-transparent">
                  {details?.name || 'World Entrepreneurs Company'}
                </span>
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {details?.description || 'Connecting global markets with quality products and professional trading services.'}
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div>
              <h3 className="font-bold text-sm tracking-wider uppercase mb-4 text-slate-400">Quick Links</h3>
              <ul className="flex flex-col gap-2.5">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h3 className="font-bold text-sm tracking-wider uppercase mb-4 text-slate-400">Contact Us</h3>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin size={18} className="text-primary-500 flex-shrink-0 mt-0.5" />
                  <span>{details?.address || 'No,348, Stanly Road, Jaffna.'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                  <Phone size={18} className="text-primary-500 flex-shrink-0" />
                  <span>{details?.phone || '021 722 3317'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                  <Mail size={18} className="text-primary-500 flex-shrink-0" />
                  <span>{details?.email || 'Worldentrepreneurs78@gmail.com'}</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Social Icons */}
            <div>
              <h3 className="font-bold text-sm tracking-wider uppercase mb-4 text-slate-400">Connect</h3>
              <div className="flex flex-wrap gap-3">
                {/* Facebook */}
                <a
                  href={details?.socialLinks?.facebook || 'https://www.facebook.com/profile.php?id=61581285864582'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all duration-300"
                  title="World Entrepreneurs Export & Import on Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${(details?.whatsapp || '0770287429').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello! I would like to know more about your services.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white transition-all duration-300"
                  title="Chat on WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                </a>
                {/* Render any extra social links from DB */}
                {details?.socialLinks &&
                  Object.entries(details.socialLinks)
                    .filter(([p]) => !['facebook', 'whatsapp'].includes(p))
                    .map(([platform, url]) => {
                      if (!url) return null;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-primary-500 dark:hover:bg-primary-600 hover:text-white dark:hover:text-white transition-all duration-300"
                          title={platform}
                        >
                          <span className="capitalize text-xs font-bold">{platform.charAt(0)}</span>
                        </a>
                      );
                    })}
              </div>
              {/* WhatsApp number label */}
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                WhatsApp: {details?.whatsapp || '077 028 7429'}
              </p>
            </div>
          </div>

          {/* Bottom Copyright bar */}
          <div className="border-t border-slate-200 dark:border-slate-900 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} {details?.name || 'World Entrepreneurs Export & Import (PVT) LTD'}. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">
              Designed with Glassmorphism Theme.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Chat Widget */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-30 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-3.5 rounded-full shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-300"
        title="Chat on WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-100 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-200"></span>
        </span>
        <span className="text-sm tracking-wide">Support Chat</span>
      </a>
    </div>
  );
};

export default Layout;
