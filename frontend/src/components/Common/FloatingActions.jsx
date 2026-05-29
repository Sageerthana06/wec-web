import React, { useEffect, useState } from "react";
import { ArrowUp, MessageSquare } from "lucide-react";
import { useCompany } from "../../context/CompanyContext";

const FloatingActions = () => {
  const { details } = useCompany();
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappPhone = details?.whatsapp || details?.phone || "0770287429";
  const cleanNumber = whatsappPhone.replace(/[^0-9]/g, "");
  const whatsappLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent("Hello World Entrepreneurs Team! I would like to discuss export and import services.")}`;

  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col items-end gap-3">
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .floating-whatsapp {
          animation: fadeSlideIn 0.3s ease-out;
        }
        .floating-scroll {
          animation: fadeSlideIn 0.3s ease-out;
        }
      `}</style>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp inline-flex items-center gap-2 px-4 py-3 rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/25 hover:scale-105 transition-transform duration-300"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-sm font-semibold">Chat WhatsApp</span>
      </a>

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="floating-scroll inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-white shadow-2xl shadow-slate-900/30 hover:bg-slate-800 transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default FloatingActions;
