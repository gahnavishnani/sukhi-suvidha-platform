// src/components/UploadPanel.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { addHistory } from "../utils/history";

const UploadPanel = ({ t }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { languageCode } = useLanguage();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert(t?.noFile || "Please select a file first!");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("uploadFile", selectedFile);
    formData.append("language_code", languageCode);

    try {
      const response = await fetch("http://localhost:8000/upload-ocr", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        const thumbnail = selectedFile
          ? URL.createObjectURL(selectedFile)
          : null;

        addHistory({
          type: "upload",
          title: selectedFile.name || "Uploaded file",
          subtitle: t?.uploading || "Uploaded",
          details: data.text || "",
          thumbnail,
          extra: {
            audioUrl: data.audio_url
              ? `http://localhost:8000${data.audio_url}`
              : null,
          },
        });

        navigate("/simplified-output", {
          state: {
            simplifiedText: data.text,
            audioUrl: data.audio_url
              ? `http://localhost:8000${data.audio_url}`
              : null,
          },
        });
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.detail || "Unknown error"}`);
      }
    } catch (error) {
      alert("Error uploading file: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl shadow-2xl bg-white">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-gray-900">
        {t?.uploadPrescription || "Upload Prescription"}
      </h2>

      {/* FILE INPUT */}
      <div className="mb-6">
        <label
          className="flex flex-col items-center w-full px-4 py-4 
                     bg-gray-100 hover:bg-gray-200 transition rounded-2xl 
                     cursor-pointer border border-gray-300 text-gray-700"
        >
          <span className="text-sm mb-1 font-medium">
            {t?.chooseFileLabel || "Select a file to upload"}
          </span>
          <span className="text-xs text-gray-500">
            {selectedFile ? selectedFile.name : t?.chooseFile || "Choose File"}
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className={`w-full py-3 rounded-2xl font-semibold text-white text-sm md:text-base
                    transition-all duration-200
          ${
            isUploading || !selectedFile
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-700 hover:bg-gray-800 shadow-md"
          }`}
      >
        {isUploading
          ? t?.uploading || "Uploading..."
          : t?.uploadSimplify || "Upload & Simplify"}
      </button>
    </div>
  );
};

export default UploadPanel;
