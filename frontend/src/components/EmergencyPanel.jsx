import React, { useState, useEffect } from "react";
import { translate } from "../utils/translations";

const EmergencyPanel = () => {
  const [t, setT] = useState(translate("en"));

  useEffect(() => {
    const lang = localStorage.getItem("preferredLanguage") || "en";
    setT(translate(lang));
  }, []);

  const contacts = [
    { label: t.police,         number: "100",  icon: "👮", color: "bg-blue-100" },
    { label: t.ambulance,      number: "102",  icon: "🚑", color: "bg-red-100" },
    { label: t.fireBrigade,    number: "101",  icon: "🚒", color: "bg-orange-100" },
    { label: t.womenHelpline,  number: "1091", icon: "👩", color: "bg-pink-100" },
    { label: t.childHelpline,  number: "1098", icon: "🧒", color: "bg-green-100" },
  ];

  const handleCall = (number) => {
    if (window.confirm(`${t.call} ${number}?`)) {
      window.location.href = `tel:${number}`;
    }
  };

  return (
    <div className="p-8 rounded-3xl shadow-2xl bg-white">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-gray-900">
        {t.emergency || "Emergency Contacts"}
      </h1>

      {/* CONTACT LIST */}
      <div className="flex flex-col gap-4">
        {contacts.map((c, i) => (
          <div
            key={i}
            onClick={() => handleCall(c.number)}
            className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer 
                        transition-transform duration-150 hover:scale-[1.01] shadow-sm ${c.color}`}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-3">{c.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">{c.label}</p>
                <p className="text-gray-600 text-sm">{c.number}</p>
              </div>
            </div>

            <button
              className="px-4 py-1.5 rounded-lg text-sm font-semibold 
                         bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              {t.call || "Call"}
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER NOTE */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
        <p className="text-sm font-semibold text-yellow-800">
          {t.emergencyNoteTitle || "Important Note:"}
        </p>
        <p className="text-xs mt-1 text-yellow-700">
          {t.emergencyNote ||
            "In case of emergency, please call the appropriate number immediately."}
        </p>
      </div>
    </div>
  );
};

export default EmergencyPanel;
