import React, { useEffect, useState } from "react";
import { translate } from "../utils/translations";

const ProfilePage = () => {
  const [t, setT] = useState(translate("en"));

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    village: "",
    district: "",
    language: "en"
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem("preferredLanguage") || "en";
    setT(translate(lang));

    setProfileData({
      name: localStorage.getItem("userName") ?? "",
      phone: localStorage.getItem("userPhone") ?? "",
      village: localStorage.getItem("userVillage") ?? "",
      district: localStorage.getItem("userDistrict") ?? "",
      language: lang ?? "en"
    });
  }, []);

  const handleSave = () => {
    localStorage.setItem("userName", profileData.name);
    localStorage.setItem("userPhone", profileData.phone);
    localStorage.setItem("userVillage", profileData.village);
    localStorage.setItem("userDistrict", profileData.district);
    localStorage.setItem("preferredLanguage", profileData.language);

    alert("Profile updated successfully!");
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full">
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          👤 {t.profile || "Your Profile"}
        </h1>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t.name || "Name"}
            </label>
            <input
              type="text"
              disabled={!editing}
              className={`w-full p-2 rounded-lg border ${
                editing ? "border-green-400" : "border-gray-300"
              }`}
              value={profileData.name || ""}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t.phone || "Phone Number"}
            </label>
            <input
              type="text"
              disabled={!editing}
              className={`w-full p-2 rounded-lg border ${
                editing ? "border-green-400" : "border-gray-300"
              }`}
              value={profileData.phone || ""}
              onChange={(e) =>
                setProfileData({ ...profileData, phone: e.target.value })
              }
            />
          </div>

          {/* Village */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t.village || "Village"}
            </label>
            <input
              type="text"
              disabled={!editing}
              className={`w-full p-2 rounded-lg border ${
                editing ? "border-green-400" : "border-gray-300"
              }`}
              value={profileData.village || ""}
              onChange={(e) =>
                setProfileData({ ...profileData, village: e.target.value })
              }
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t.district || "District"}
            </label>
            <input
              type="text"
              disabled={!editing}
              className={`w-full p-2 rounded-lg border ${
                editing ? "border-green-400" : "border-gray-300"
              }`}
              value={profileData.district || ""}
              onChange={(e) =>
                setProfileData({ ...profileData, district: e.target.value })
              }
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t.language || "Preferred Language"}
            </label>
            <select
              disabled={!editing}
              value={profileData.language}
              className="w-full p-2 rounded-lg border border-gray-300"
              onChange={(e) =>
                setProfileData({ ...profileData, language: e.target.value })
              }
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="bn">বাংলা</option>
              <option value="mr">मराठी</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              {t.editProfile || "Edit Profile"}
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
              >
                {t.cancel || "Cancel"}
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                {t.save || "Save"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
