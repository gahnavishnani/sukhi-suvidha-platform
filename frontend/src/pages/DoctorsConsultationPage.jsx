import React, { useEffect, useRef, useState } from "react";
import { translate } from "../utils/translations.js";

const DoctorsConsultationPage = () => {
  const [t, setT] = useState(translate("en"));
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [appointmentType, setAppointmentType] = useState("offline");
  const [doctors, setDoctors] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcLocalRef = useRef(null);
  const pcRemoteRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const lang = localStorage.getItem("preferredLanguage") || "en";
    setT(translate(lang));

    const ds = [
      {
        id: 1,
        name: "Dr. Rajesh Sharma",
        specialtyKey: "cardiologist",
        hospitalKey: "apolloHospital",
        experience: "15 " + (translate(lang).yearsExperience || "years"),
        rating: 4.8,
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
        timings: {
          offline: "Mon-Fri: 10AM-4PM",
          virtual: "Tue-Thu: 6PM-9PM"
        },
        fee: {
          offline: "₹1000",
          virtual: "₹800"
        }
      },
      {
        id: 2,
        name: "Dr. Priya Singh",
        specialtyKey: "pediatrician",
        hospitalKey: "aiimsHospital",
        experience: "12 " + (translate(lang).yearsExperience || "years"),
        rating: 4.7,
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        timings: {
          offline: "Mon-Sat: 9AM-3PM",
          virtual: "Mon-Wed-Fri: 5PM-8PM"
        },
        fee: {
          offline: "₹900",
          virtual: "₹700"
        }
      },
      {
        id: 3,
        name: "Dr. Amit Kumar",
        specialtyKey: "orthopedicSurgeon",
        hospitalKey: "maxHospital",
        experience: "18 " + (translate(lang).yearsExperience || "years"),
        rating: 4.9,
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face",
        timings: {
          offline: "Tue-Sat: 11AM-5PM",
          virtual: "Mon-Wed: 7PM-10PM"
        },
        fee: {
          offline: "₹1200",
          virtual: "₹1000"
        }
      }
    ];
    setDoctors(ds);
  }, []);

  
  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentType("offline");
    setShowBookingModal(true);
  };

  const confirmAppointment = () => {
    
    try {
      const history = JSON.parse(localStorage.getItem("historyItems") || "[]");
      const item = {
        id: Date.now(),
        type: "appointment",
        doctorName: selectedDoctor.name,
        appointmentType,
        fee: selectedDoctor.fee[appointmentType],
        timings: appointmentType === "offline" ? selectedDoctor.timings.offline : selectedDoctor.timings.virtual,
        timestamp: new Date().toISOString()
      };
      history.unshift(item);
      localStorage.setItem("historyItems", JSON.stringify(history));
      alert(`${t.bookAppointment || "Appointment booked!"} — ${selectedDoctor.name}`);
    } catch (err) {
      console.error("Failed to save appointment:", err);
      alert("Could not save appointment. Check console.");
    } finally {
      setShowBookingModal(false);
      setSelectedDoctor(null);
    }
  };

  
  const startVideoCall = async (doctor) => {
    setSelectedDoctor(doctor);
    setShowVideoModal(true);

   
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

     
    const pc1 = new RTCPeerConnection();
      const pc2 = new RTCPeerConnection();
      pcLocalRef.current = pc1;
      pcRemoteRef.current = pc2;

    
      pc1.onicecandidate = (e) => {
        if (e.candidate) pc2.addIceCandidate(e.candidate).catch(console.error);
      };
      pc2.onicecandidate = (e) => {
        if (e.candidate) pc1.addIceCandidate(e.candidate).catch(console.error);
      };

    
      pc2.ontrack = (ev) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = ev.streams[0];
      };

    // add local tracks to pc1
      stream.getTracks().forEach((track) => pc1.addTrack(track, stream));

      // create offer/answer loop
      const offer = await pc1.createOffer();
      await pc1.setLocalDescription(offer);
      await pc2.setRemoteDescription(offer);
      const answer = await pc2.createAnswer();
      await pc2.setLocalDescription(answer);
      await pc1.setRemoteDescription(answer);
    } catch (err) {
      console.error("Video call start failed:", err);
      alert("Cannot access camera/mic. Please enable permissions and try again.");
      cleanupVideo();
    }
  };

  const cleanupVideo = () => {
    // stop tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    // close peer connections
    if (pcLocalRef.current) {
      pcLocalRef.current.close();
      pcLocalRef.current = null;
    }
    if (pcRemoteRef.current) {
      pcRemoteRef.current.close();
      pcRemoteRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setShowVideoModal(false);
    setSelectedDoctor(null);
  };

  // ---------- Small helper styles for premium look ----------
  // You can tweak the gradient colors and shadow to match your theme
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            {t.doctorsConsultation || "Doctors Consultation"}
          </h1>
          <p className="mt-2 text-lg text-gray-600">{t.doctorDesc || "Book appointments with experienced doctors"}</p>
        </div>

        {/* Doctor cards grid (2 columns on md) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-3xl shadow-2xl p-6 transform hover:-translate-y-1 transition">
              <div className="flex items-start gap-4">
                <img src={doc.photo} alt={doc.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md" />
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900">{doc.name}</h2>
                  <p className="text-sm text-indigo-600 font-medium">{t[doc.specialtyKey] || doc.specialtyKey}</p>
                  <p className="text-gray-600 text-sm mt-1">{t[doc.hospitalKey] || doc.hospitalKey}</p>

                  <div className="flex items-center text-sm mt-3">
                    <span className="text-yellow-500 text-lg mr-2">★</span>
                    <span className="text-gray-700 mr-3">{doc.rating}</span>
                    <span className="text-gray-400">•</span>
                    <span className="ml-3 text-gray-600">{doc.experience}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-indigo-50">
                      <p className="text-xs font-medium text-gray-700">{t.offlineConsultation || "Offline"}</p>
                      <p className="text-sm text-gray-700 mt-1">{doc.timings.offline}</p>
                      <p className="text-indigo-600 font-semibold mt-2">{doc.fee.offline}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50">
                      <p className="text-xs font-medium text-gray-700">{t.virtualConsultation || "Virtual"}</p>
                      <p className="text-sm text-gray-700 mt-1">{doc.timings.virtual}</p>
                      <p className="text-rose-600 font-semibold mt-2">{doc.fee.virtual}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleBookAppointment(doc)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow hover:from-indigo-700"
                    >
                      {t.bookAppointment || "Book Appointment"}
                    </button>

                    <button
                      onClick={() => startVideoCall(doc)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:shadow"
                      title="Start Video Call Demo"
                    >
                      🎥 {t.virtualConsultation || "Video Call"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-indigo-700 font-medium hover:text-indigo-900 transition"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.backToFacilities || "Back to Facilities"}
          </button>
        </div>
      </div>

      {/* ---------- Booking Modal ---------- */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-semibold mb-3">
              {t.bookAppointment || "Book Appointment"} — {selectedDoctor.name}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.selectAppointmentType || "Appointment Type"}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="apptType" checked={appointmentType === "offline"} onChange={() => setAppointmentType("offline")} />
                  <span>{t.offlineConsultation || "Offline"} ({selectedDoctor.fee.offline})</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="apptType" checked={appointmentType === "virtual"} onChange={() => setAppointmentType("virtual")} />
                  <span>{t.virtualConsultation || "Virtual"} ({selectedDoctor.fee.virtual})</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">{t.selectedTiming || "Selected Timing"}</label>
              <p className="mt-1 text-gray-800">{appointmentType === "offline" ? selectedDoctor.timings.offline : selectedDoctor.timings.virtual}</p>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => { setShowBookingModal(false); setSelectedDoctor(null); }} className="px-4 py-2 rounded-md bg-gray-100">
                {t.cancel || "Cancel"}
              </button>
              <button onClick={confirmAppointment} className="px-4 py-2 rounded-md bg-indigo-600 text-white">
                {t.confirmBooking || "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Video Call Modal (embedded) ---------- */}
      {showVideoModal && selectedDoctor && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">{t.virtualConsultation || "Video Call"} — {selectedDoctor.name}</h3>
                <p className="text-sm text-gray-500">{t.videoCallNote || "Demo video call (local loopback). No history will be saved.)"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={cleanupVideo}
                  className="px-3 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                >
                  End Call
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-md p-2 flex flex-col items-center">
                <p className="text-sm text-gray-600 mb-2">Your Camera</p>
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-64 rounded-md object-cover bg-black" />
              </div>
              <div className="bg-gray-100 rounded-md p-2 flex flex-col items-center">
                <p className="text-sm text-gray-600 mb-2">{selectedDoctor.name}</p>
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-64 rounded-md object-cover bg-black" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <strong>BPM: </strong> <span id="demo-bpm">--</span> &nbsp; • &nbsp;
                <strong>{t.fee || "Fee"}:</strong> {selectedDoctor.fee.virtual}
              </div>
              <div className="flex gap-2">
                {/* optional: mute/unmute + camera toggle can be added here */}
                <button
                  onClick={cleanupVideo}
                  className="px-4 py-2 rounded-md bg-red-600 text-white"
                >
                  {t.endCall || "End Call"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsConsultationPage;
