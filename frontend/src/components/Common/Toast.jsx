import React, { useState, useEffect } from 'react';

// Dispatcher function to show a toast alert
export const showToast = (type, message) => {
  const event = new CustomEvent('show-toast', { detail: { type, message } });
  window.dispatchEvent(event);
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleShowToast = (e) => {
      const { type, message } = e.detail;
      const id = Date.now() + Math.random().toString(36).substr(2, 9);
      
      setToasts((prevToasts) => [...prevToasts, { id, type, message }]);

      // Remove after 3.5 seconds
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
      }, 3500);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto
            flex items-center p-4 rounded-xl shadow-lg border backdrop-blur-md
            animate-fade-in
            ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : toast.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
            }
          `}
          role="alert"
        >
          <div className="flex-1 text-sm font-medium">{toast.message}</div>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="ml-3 text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};
