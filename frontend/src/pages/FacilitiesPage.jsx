// src/pages/FacilitiesPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { translate } from "../utils/translations.js";
import UploadPanel from "../components/UploadPanel.jsx";
import EmergencyPanel from "../components/EmergencyPanel.jsx";
import ChatbotWidget from "../components/ChatbotWidget.jsx";
import { useNavigate } from "react-router-dom";

const FacilitiesPage = () => {
  const [t, setT] = useState(translate("en"));
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const lang = localStorage.getItem("preferredLanguage") || "en";
    setT(translate(lang));

    const name = localStorage.getItem("userName") || "User";
    setUserName(name);

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserInitial = () => userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const handleProfileAction = (action) => {
    setIsProfileOpen(false);
    switch (action) {
      case "profile":
        navigate("/profile");
        break;
      case "history":
        navigate("/history");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  
  const facilityCards = [
    {
      id: 1,
      title: t.hospital,
      description: t.hospitalDesc,
      icon: "🏥",
      path: "/nearby-hospitals",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      title: t.generalMedicines || "General Medicines",
      description: t.medicineDesc || "Commonly used medicines and their purposes",
      icon: "💊",
      path: "/general-medicines",
      color: "from-green-500 to-green-600",
    },
    {
      id: 3,
      title: t.doctor,
      description: t.doctorDesc,
      icon: "👨‍⚕️",
      path: "/doctors-consultation",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: 4,
      title: t.healthyDiet || "Healthy Diet",
      description: t.dietDesc || "Nutrition plans for different age groups.",
      icon: "🥗",
      path: "/healthy-diet",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#c8f5d9] px-4 sm:px-6 py-6 relative">
      {/* TOP RIGHT GREETING + PROFILE */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <span className="text-gray-800 hidden md:block">
          Hello, {userName}
        </span>

        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md hover:bg-blue-700"
          >
            {getUserInitial()}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-xl shadow-xl border border-gray-200 z-[9999]">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">
                  {localStorage.getItem("userPhone") || "No phone number added"}
                </p>
              </div>

              <button
                onClick={() => handleProfileAction("profile")}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                👤 Profile
              </button>
              <button
                onClick={() => handleProfileAction("history")}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                📋 History
              </button>
              <button
                onClick={() => handleProfileAction("logout")}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto pt-10 pb-16">
        {/* HEADING */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#065f46]">
  {t.facilitiesTitle}
</h1>
<p className="mt-3 text-gray-700 text-lg">
  {t.facilitiesSubtitle}
</p>

        </div>

        {/* FACILITY CARDS – 2x2 GRID */}
        <div className="grid gap-8 md:grid-cols-2">
          {facilityCards.map((card) => (
            <div
              key={card.id}
              onClick={() => navigate(card.path)}
              className={`p-6 md:p-7 rounded-2xl bg-gradient-to-r ${card.color}
                          text-white shadow-xl cursor-pointer
                          hover:scale-[1.02] hover:shadow-2xl transition-all`}
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4">{card.icon}</span>
                <h2 className="text-xl font-semibold">{card.title}</h2>
              </div>

              <p className="mt-3 text-sm md:text-base text-white/90">
                {card.description}
              </p>

              <div className="mt-4 text-sm font-medium flex items-center">
                <span>{t.clickToExplore || "Click to explore"}</span>
                <span className="ml-1 text-lg leading-none">›</span>
              </div>
            </div>
          ))}
        </div>

        {/* UPLOAD PRESCRIPTION */}
        <div className="mt-12 max-w-4xl mx-auto">
          <UploadPanel t={t} />
        </div>

        {/* EMERGENCY CONTACTS */}
        <div className="mt-8 max-w-4xl mx-auto mb-10">
          <EmergencyPanel />
        </div>
      </div>

      {/* FIXED CHATBOT */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <ChatbotWidget />
      </div>
    </div>
  );
};

export default FacilitiesPage;
