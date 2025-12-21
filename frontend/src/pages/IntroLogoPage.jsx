import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IntroLogoPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-[#0a1a3a] relative overflow-hidden">

      {/* Neon Blue Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,140,255,0.25),transparent_70%)]" />

      {/* Logo */}
      <img
        src="/logo.jpg"
        alt="Sukhi Suvidha Logo"
        className="w-64 sm:w-80 md:w-[350px] opacity-0 animate-logoFade drop-shadow-[0_0_20px_rgba(0,140,255,0.9)]"
        style={{ animationDelay: "0.4s" }}
      />

      {/* Tagline */}
      <p
        className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-300 
        opacity-0 animate-slideLeft drop-shadow-[0_0_10px_rgba(0,140,255,1)] mt-6 text-center px-4"
        style={{ animationDelay: "1.2s" }}
      >
        Empowering Rural Healthcare & Accessibility
      </p>

      {/* Custom Animations */}
      <style>{`
        @keyframes logoFade {
          0% { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-logoFade {
          animation: logoFade 1.4s ease-out forwards;
        }

        @keyframes slideLeft {
          0% { opacity: 0; transform: translateX(-40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideLeft {
          animation: slideLeft 1.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default IntroLogoPage;
