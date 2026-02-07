// src/pages/NearbyHospitalsPage.jsx
import React from "react";
import { translate } from "../utils/translations.js";
import { addHistory } from "../utils/history";

const NearbyHospitalsPage = () => {
  const [t, setT] = React.useState(translate("en"));
  const [location, setLocation] = React.useState(null);
  const [hospitals, setHospitals] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Language setup
  React.useEffect(() => {
    const lang = localStorage.getItem("preferredLanguage") || "en";
    setT(translate(lang));
  }, []);

  // STEP 1: Ask for user location
  React.useEffect(() => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        alert("Location access is required to find nearby hospitals");
        setLoading(false);
      }
    );
  }, []);

  // STEP 2: Fetch hospitals from OpenStreetMap
  React.useEffect(() => {
    if (!location) return;

    const fetchHospitalsFromOSM = async () => {
      const query = `
        [out:json];
        (
          node["amenity"="hospital"](around:5000,${location.lat},${location.lng});
          way["amenity"="hospital"](around:5000,${location.lat},${location.lng});
        );
        out center tags;
      `;

      try {
        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: query
        });

        const data = await res.json();

        const formatted = data.elements.map((el, index) => ({
          id: index,
          name: el.tags?.name || "Nearby Hospital",
          address:
            el.tags?.["addr:full"] ||
            el.tags?.["addr:street"] ||
            "Address not available",
          beds: "N/A",
          ambulance: "108",
          phone: el.tags?.phone || "Not available",
          lat: el.lat || el.center?.lat,
          lng: el.lon || el.center?.lon
        }));

        setHospitals(formatted);
      } catch (err) {
        console.error("OSM fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalsFromOSM();
  }, [location]);

  // Handle call + history
  const handleCall = (hospital) => {
    if (hospital.phone === "Not available") return;

    addHistory({
      type: "hospital",
      title: hospital.name,
      subtitle: hospital.address,
      details: `Called: ${hospital.phone}`,
      thumbnail: null,
      extra: { phone: hospital.phone }
    });

    window.location.href = `tel:${hospital.phone}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            {t.nearbyHospitals}
          </h1>
          <p className="text-blue-600">{t.hospitalDesc}</p>
        </div>

        {loading && (
          <p className="text-center text-blue-700 font-medium">
            Finding nearby hospitals…
          </p>
        )}

        <div className="space-y-6">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-xl shadow-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {hospital.name}
                </h2>

                <p className="text-gray-600 mb-4">{hospital.address}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">
                      {t.bedsAvailable}
                    </p>
                    <p className="text-xl font-bold text-blue-800">
                      {hospital.beds}
                    </p>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      {t.ambulance}
                    </p>
                    <p className="text-xl font-bold text-green-800">
                      {hospital.ambulance}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-purple-700 font-medium">
                      {t.contact}
                    </p>
                    <p className="text-lg font-bold text-purple-800">
                      {hospital.phone}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCall(hospital)}
                  disabled={hospital.phone === "Not available"}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {t.call} {hospital.phone}
                </button>

                {/* OPEN IN MAPS */}
                {hospital.lat && hospital.lng && (
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${hospital.lat}&mlon=${hospital.lng}#map=17/${hospital.lat}/${hospital.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center mt-3 text-blue-600 font-medium hover:underline"
                  >
                    Open in Maps
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-blue-700 font-medium hover:text-blue-900 transition"
          >
            ← {t.backToFacilities}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NearbyHospitalsPage;
