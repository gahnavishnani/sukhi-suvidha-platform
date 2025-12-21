import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { translate } from "../utils/translations.js";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaLanguage,
} from "react-icons/fa";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { setLanguage, setLanguageCode } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phoneNumber: "",
    language: "en",
  });

  // Use the shared translate function
  const t = translate(formData.language);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save all user data to localStorage
    localStorage.setItem("welcomePhone", formData.phoneNumber);
    localStorage.setItem("userName", formData.name);
    localStorage.setItem("userLocation", formData.location);
    localStorage.setItem("userData", JSON.stringify(formData));
    localStorage.setItem("preferredLanguage", formData.language);
    
    // Set language in context
    setLanguage(formData.language);
    setLanguageCode(formData.language);
    
    // Navigate to signup page
    navigate("/signup");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage: 'url("/images/rural.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.h1
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl font-bold text-black px-6 py-3 rounded-xl bg-white/40 backdrop-blur-md shadow-md inline-block"
      >
        Sukhi Suvidha 🌸
      </motion.h1>

      <div className="bg-white bg-opacity-90 p-8 md:p-10 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-lg">
        <h2 className="text-xl font-semibold mb-4 text-center text-black">{t.welcome}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="name"
              placeholder={t.name}
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md text-black"
              required
            />
          </div>

          {/* Location Field */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="location"
              placeholder={t.location}
              value={formData.location}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md text-black"
              required
            />
          </div>

          {/* Phone Number Field */}
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="tel"
              name="phoneNumber"
              placeholder={t.phone}
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md text-black"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
            />
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <FaLanguage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md text-black appearance-none"
              required
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
              <option value="te">Telugu</option>
              <option value="mr">Marathi</option>
              <option value="ta">Tamil</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition font-semibold"
          >
            {t.continue}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomePage;