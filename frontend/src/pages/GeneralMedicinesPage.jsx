import React, { useState, useEffect } from "react";
import { translate } from "../utils/translations.js";

const GeneralMedicinesPage = () => {
  const [t, setT] = useState(translate("en"));
  const [search, setSearch] = useState("");

  useEffect(() => {
    const lang = localStorage.getItem("preferredLanguage") || "en";
    setT(translate(lang));
  }, []);

  const medicines = [
    {
      key: "paracetamol",
      emoji: "💊",
      purpose: t.paracetamolPurpose,
      dosage: t.paracetamolDosage,
      timing: t.paracetamolTiming,
      sideEffects: t.paracetamolSideEffects,
    },
    {
      key: "ibuprofen",
      emoji: "🤕",
      purpose: t.ibuprofenPurpose,
      dosage: t.ibuprofenDosage,
      timing: t.ibuprofenTiming,
      sideEffects: t.ibuprofenSideEffects,
    },
    {
      key: "cetirizine",
      emoji: "🤧",
      purpose: t.cetirizinePurpose,
      dosage: t.cetirizineDosage,
      timing: t.cetirizineTiming,
      sideEffects: t.cetirizineSideEffects,
    },
    {
      key: "omeprazole",
      emoji: "🔥",
      purpose: t.omeprazolePurpose,
      dosage: t.omeprazoleDosage,
      timing: t.omeprazoleTiming,
      sideEffects: t.omeprazoleSideEffects,
    },
    {
      key: "amoxicillin",
      emoji: "🦠",
      purpose: t.amoxicillinPurpose,
      dosage: t.amoxicillinDosage,
      timing: t.amoxicillinTiming,
      sideEffects: t.amoxicillinSideEffects,
    },
    {
      key: "atorvastatin",
      emoji: "❤️",
      purpose: t.atorvastatinPurpose,
      dosage: t.atorvastatinDosage,
      timing: t.atorvastatinTiming,
      sideEffects: t.atorvastatinSideEffects,
    },
  ];

  const filteredMedicines = medicines.filter((m) =>
    t[m.key].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">

      {/* TITLE */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-300 to-teal-400 text-transparent bg-clip-text">
          {t.generalMedicines}
        </h1>
        <p className="text-gray-300 mt-2">{t.medicineDesc}</p>
      </div>

      {/* SEARCH */}
      <div className="max-w-xl mx-auto mb-10">
        <input
          type="text"
          placeholder={t.searchMedicines || "Search medicines..."}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {filteredMedicines.map((m, i) => (
          <div
            key={i}
            className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">{m.emoji}</span>
              <h2 className="text-xl font-semibold">{t[m.key]}</h2>
            </div>

            <p className="text-teal-300 font-medium mb-4">{m.purpose}</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">{t.dosage}:</span>
                <span className="text-white max-w-[60%] text-right">{m.dosage}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">{t.timing}:</span>
                <span className="text-white max-w-[60%] text-right">{m.timing}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">{t.sideEffects}:</span>
                <span className="text-red-300 max-w-[60%] text-right">{m.sideEffects}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 border-t border-white/10 pt-3">
              {t.disclaimer}
            </p>
          </div>
        ))}
      </div>

      {/* BACK BUTTON */}
      <div className="mt-12 text-center">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 text-white bg-white/10 border border-white/20 backdrop-blur-lg rounded-xl hover:scale-105 hover:bg-white/20 transition mx-auto"
        >
          ← {t.backToFacilities}
        </button>
      </div>
    </div>
  );
};

export default GeneralMedicinesPage;
