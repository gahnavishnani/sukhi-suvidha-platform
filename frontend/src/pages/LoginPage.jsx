// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { translate } from "../utils/translations.js";
import { getStoredUserPhone, getStoredUserPassword, isAuthenticated } from "../utils/authHelper";

const LoginPage = () => {
  const [t, setT] = useState(translate("en"));
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get success message from signup redirect
  const successMessage = location.state?.message;

  useEffect(() => {
    const lang = localStorage.getItem("preferredLanguage") || "en";
    setT(translate(lang));
    
    // Check if user is already logged in
    if (isAuthenticated()) {
      navigate("/facilities");
    }
    
    // Pre-fill phone number if available
    const storedPhone = getStoredUserPhone();
    if (storedPhone) {
      setPhoneNumber(storedPhone);
    }
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    
    // Validate inputs
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      setError(t.phoneInvalid || "Please enter a valid phone number");
      setLoading(false);
      return;
    }
    
    if (!password || password.length < 6) {
      setError(t.passwordInvalid || "Please enter your password");
      setLoading(false);
      return;
    }
    
    try {
      // Simulate API call to login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if credentials match
      const storedPhone = getStoredUserPhone();
      const storedPassword = getStoredUserPassword();
      
      // Normalize phone numbers for comparison
      const normalizePhone = (phone) => phone.replace(/\D/g, '');
      const enteredNormalized = normalizePhone(phoneNumber);
      const storedNormalized = storedPhone ? normalizePhone(storedPhone) : '';
      
      if (enteredNormalized === storedNormalized && password === storedPassword) {
        // Set authentication token
        localStorage.setItem("isAuthenticated", "true");
        navigate("/facilities");
      } else {
        setError(t.invalidCredentials || "Invalid phone number or password");
      }
    } catch (err) {
      setError(t.loginError || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">{t.login || "Login"}</h1>
          <p className="text-gray-600 mt-2">{t.loginDesc || "Welcome back! Please login to your account"}</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p>{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.phoneNumber || "Phone Number"}
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t.phonePlaceholder || "Enter your phone number"}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.password || "Password"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t.passwordPlaceholder || "Enter your password"}
            />
          </div>
          
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              {t.forgotPassword || "Forgot Password?"}
            </Link>
          </div>
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? t.loggingIn || "Logging in..." : t.login || "Login"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t.dontHaveAccount || "Don't have an account?"}{" "}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              {t.signup || "Sign Up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 