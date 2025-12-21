import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { translate } from "../utils/translations.js";
import { saveUserData } from "../utils/authHelper";
import { initGoogle, renderGoogleButton, promptGoogleOneTap } from "../utils/googleauth.js";

const SignupPage = () => {
  const [t, setT] = useState(translate("en"));
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();

  // --------------------------
  // GOOGLE LOGIN HANDLER
  // --------------------------
  const handleGoogleResponse = (response) => {
    try {
      const decoded = JSON.parse(atob(response.credential.split(".")[1]));

      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        googleId: decoded.sub,
        loginMethod: "google",
      };

      saveUserData(userData);
      localStorage.setItem("isAuthenticated", "true");

      // FINAL: Redirect to Facilities Page
      navigate("/facilities");
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  useEffect(() => {
    const lang = localStorage.getItem("preferredLanguage") || "en";
    setT(translate(lang));

    const welcomePhone = localStorage.getItem("welcomePhone");
    if (welcomePhone) setPhoneNumber(welcomePhone);

    updateDebugInfo();

    initGoogle(handleGoogleResponse);

    setTimeout(() => {
      renderGoogleButton("googleSignInDiv");
    }, 300);

    promptGoogleOneTap();
  }, []);

  const updateDebugInfo = () => {
    const debugData = {
      welcomePhone: localStorage.getItem("welcomePhone"),
      userPhone: localStorage.getItem("userPhone"),
      userPassword: localStorage.getItem("userPassword"),
      userData: localStorage.getItem("userData"),
      isAuthenticated: localStorage.getItem("isAuthenticated")
    };
    setDebugInfo(JSON.stringify(debugData, null, 2));
  };

  // --------------------------
  // OTP + PASSWORD LOGIC (unchanged)
  // --------------------------
  const handleSendOtp = async () => {
    setLoading(true);
    setError("");

    if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(2);
    } catch {
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(3);
    } catch {
      setError("Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    setError("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const normalizedPhone = phoneNumber.replace(/\D/g, "");

      const newUser = {
        phone: normalizedPhone,
        password,
        name: "User",
        loginMethod: "phone",
      };

      saveUserData(newUser);
      localStorage.setItem("isAuthenticated", "true");

      navigate("/login", {
        state: { message: "Account created! Please login." }
      });

    } catch {
      setError("Failed to create account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // UI SECTION
  // --------------------------
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">
            {step === 1 ? "Sign Up" : step === 2 ? "Verify OTP" : "Create Password"}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 1
              ? "Create your account"
              : step === 2
              ? "Enter the OTP sent to your phone"
              : "Create a strong password"}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

              {/* GOOGLE SIGN IN BUTTON */}
              <div className="flex justify-center mt-3">
                <div id="googleSignInDiv"></div>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                className="text-blue-600 mt-2"
                onClick={() => setStep(1)}
              >
                Change Number
              </button>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <button
                onClick={handleCreateAccount}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </>
          )}
        </div>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">Login</Link>
          </p>
        </div>

        <details className="mt-4 text-xs">
          <summary className="cursor-pointer text-gray-500">Debug Info</summary>
          <pre className="bg-gray-100 p-2 rounded">{debugInfo}</pre>
        </details>
      </div>
    </div>
  );
};

export default SignupPage;
