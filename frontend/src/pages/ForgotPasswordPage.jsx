// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { translate } from "../utils/translations.js";

const ForgotPasswordPage = () => {
  const [t, setT] = useState(translate("en"));
  const [step, setStep] = useState(1); // 1: Phone number, 2: OTP verification, 3: New password
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const lang = localStorage.getItem("preferredLanguage") || "en";
    setT(translate(lang));
  }, []);

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    
    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      setError(t.phoneInvalid || "Please enter a valid phone number");
      setLoading(false);
      return;
    }
    
    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(2);
    } catch (err) {
      setError(t.otpSendError || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");
    
    // Validate OTP
    if (!otp || otp.length !== 6) {
      setError(t.otpInvalid || "Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }
    
    try {
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(3);
    } catch (err) {
      setError(t.otpVerifyError || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError("");
    
    // Validate passwords
    if (!newPassword || newPassword.length < 6) {
      setError(t.passwordShort || "Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError(t.passwordMismatch || "Passwords do not match");
      setLoading(false);
      return;
    }
    
    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update password in localStorage (in a real app, this would be done on the server)
      localStorage.setItem("userPassword", newPassword);
      
      // Redirect to login page with success message
      navigate("/login", { state: { message: t.passwordResetSuccess || "Password reset successfully! Please login with your new password." } });
    } catch (err) {
      setError(t.passwordResetError || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">
            {step === 1 ? t.forgotPassword : step === 2 ? t.verifyOtp : t.resetPassword}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 1 ? t.forgotPasswordDesc || "Enter your phone number to reset your password" : 
             step === 2 ? t.verifyOtpDesc || "Enter the OTP sent to your phone" : 
             t.resetPasswordDesc || "Create a new password"}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {step === 1 && (
            <>
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
              
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? t.sendingOtp || "Sending OTP..." : t.sendOtp || "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.enterOtp || "Enter OTP"}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.otpPlaceholder || "Enter 6-digit OTP"}
                />
              </div>
              
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? t.verifyingOtp || "Verifying..." : t.verifyOtp || "Verify OTP"}
              </button>
              
              <div className="text-center">
                <button 
                  onClick={() => setStep(1)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  {t.changeNumber || "Change phone number"}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.newPassword || "New Password"}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.newPasswordPlaceholder || "Enter new password"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.confirmPassword || "Confirm Password"}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.confirmPasswordPlaceholder || "Confirm your new password"}
                />
              </div>
              
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? t.resettingPassword || "Resetting password..." : t.resetPassword || "Reset Password"}
              </button>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t.rememberPassword || "Remember your password?"}{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              {t.login || "Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;