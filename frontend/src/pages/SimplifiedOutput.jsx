// src/pages/SimplifiedOutput.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SimplifiedOutput = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data passed from the upload component
  const { simplifiedText, audioUrl } = location.state || {};

  // Handle cases where no data is available
  if (!simplifiedText) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No data available. Please go back and upload a file.</p>
          <button
            onClick={() => navigate("/facilities")}
            className="bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-gray-700 transition-all"
          >
            Back to Facilities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl max-w-2xl w-full p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
          Simplified Prescription
        </h1>
        
        <div className="bg-gray-100 rounded-xl p-6 mb-8 max-h-[300px] overflow-y-auto">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {simplifiedText}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">Audio Version</h2>
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/facilities")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
          >
            Back to Facilities
          </button>
          
          <a 
            href={audioUrl} 
            download
            className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-700 transition-all"
          >
            Download Audio
          </a>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedOutput;