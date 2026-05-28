import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/Common/GlassCard';
import { showToast } from '../components/Common/Toast';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect to admin immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      showToast('error', 'Please enter username and password');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(username, password);
      if (res && res.success) {
        showToast('success', 'Access granted! Welcome to the Admin Panel.');
        navigate('/admin');
      } else {
        showToast('error', res?.message || 'Access Denied. Check credentials.');
      }
    } catch (err) {
      showToast('error', err.message || 'Login request error. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-32 pb-24 relative">
      {/* Background decoration blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />

      <GlassCard className="p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl relative z-10" hover={false}>
        <div className="text-center flex flex-col gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600 to-sky-400 flex items-center justify-center text-white font-bold text-lg mx-auto shadow-neon-primary">
            A
          </div>
          <h2 className="text-2xl font-extrabold font-sans mt-3">Admin Login</h2>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Username</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border glass-input"
              />
              <User size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border glass-input"
              />
              <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-lg disabled:opacity-75 transition-all hover:scale-102 duration-300"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default Login;
