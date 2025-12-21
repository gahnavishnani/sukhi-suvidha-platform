// src/pages/NearbyHospitalsPage.jsx
import React from "react";
import { translate } from "../utils/translations.js";
import { addHistory } from "../utils/history";

const NearbyHospitalsPage = () => {
  const [t, setT] = React.useState(translate("en"));

  React.useEffect(() => {
    const lang = localStorage.getItem("preferredLanguage") || "en";
    setT(translate(lang));
  }, []);

  const hospitals = [
    {
      id: 1,
      nameKey: "apolloHospital",
      address: "Mathura Road, New Delhi",
      beds: 15,
      ambulance: "108",
      phone: "+91 1234567890",
      specialties: ["cardiology", "neurology", "orthopedics"]
    },
    {
      id: 2,
      nameKey: "aiimsHospital",
      address: "Ansari Nagar, New Delhi",
      beds: 8,
      ambulance: "102",
      phone: "+91 1234567891",
      specialties: ["oncology", "pediatrics", "surgery"]
    },
    {
      id: 3,
      nameKey: "maxHospital",
      address: "Saket, New Delhi",
      beds: 12,
      ambulance: "1099",
      phone: "+91 1234567892",
      specialties: ["gastroenterology", "endocrinology", "urology"]
    }
  ];

  const handleCall = (hospital) => {
    // Save hospital call to history
    addHistory({
      type: "hospital",
      title: t[hospital.nameKey] || hospital.nameKey,
      subtitle: hospital.address,
      details: `Called: ${hospital.phone}`,
      thumbnail: null,
      extra: { phone: hospital.phone }
    });

    // Trigger actual call
    window.location.href = `tel:${hospital.phone}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">{t.nearbyHospitals}</h1>
          <p className="text-blue-600">{t.hospitalDesc}</p>
        </div>

        <div className="space-y-6">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{t[hospital.nameKey]}</h2>
                <p className="text-gray-600 mb-4">{hospital.address}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">{t.bedsAvailable}</p>
                    <p className="text-xl font-bold text-blue-800">{hospital.beds}</p>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">{t.ambulance}</p>
                    <p className="text-xl font-bold text-green-800">{hospital.ambulance}</p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-purple-700 font-medium">{t.contact}</p>
                    <p className="text-lg font-bold text-purple-800">{hospital.phone}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">{t.specialties}</p>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.map((sp, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{t[sp] || sp}</span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleCall(hospital)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  {t.call} {hospital.phone}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => window.history.back()} className="inline-flex items-center text-blue-700 font-medium hover:text-blue-900 transition">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.backToFacilities}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NearbyHospitalsPage;


