// src/context/LanguageContext.js
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext({
  language: "en",
  languageCode: "en",
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }) => {
  const initialLanguage = 
    (typeof window !== "undefined" && localStorage.getItem("preferredLanguage")) || "en";
  
  const [language, setLanguage] = useState(initialLanguage);
  const [languageCode, setLanguageCode] = useState(initialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem("preferredLanguage", language);
      localStorage.setItem("preferredLanguageCode", languageCode);
    } catch {}
  }, [language, languageCode]);

  const value = useMemo(() => ({ 
    language, 
    languageCode, 
    setLanguage,
    setLanguageCode 
  }), [language, languageCode]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);