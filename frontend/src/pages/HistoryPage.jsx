// src/pages/HistoryPage.jsx
import React, { useEffect, useState } from "react";
import { getHistory, removeHistory, clearHistory } from "../utils/history";
import { translate } from "../utils/translations";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const [t, setT] = useState(translate("en"));
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const lang = localStorage.getItem("preferredLanguage") || "en";
    setT(translate(lang));
    setItems(getHistory());
  }, []);

  const refresh = () => {
    setItems(getHistory());
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this history item?")) return;
    removeHistory(id);
    refresh();
  };

  const handleClearAll = () => {
    if (!confirm("Clear all history?")) return;
    clearHistory();
    refresh();
  };

  const openItem = (item) => {
    // Behavior per type
    if (item.type === "upload") {
      // navigate to simplified-output passing state
      navigate("/simplified-output", {
        state: {
          simplifiedText: item.details,
          audioUrl: item.extra?.audioUrl || null
        }
      });
    } else if (item.type === "appointment") {
      // Show appointment detail modal or navigate to doctors page
      // For now, navigate to doctors-consultation (could be improved to preselect)
      navigate("/doctors-consultation");
    } else if (item.type === "hospital") {
      // Initiate call
      const phone = item.extra?.phone;
      if (phone) window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📜 History</h1>
            <p className="text-sm text-gray-500">Uploads, Appointments and Hospital calls — all in one place</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={refresh} className="px-4 py-2 bg-white border rounded-lg shadow-sm text-sm hover:bg-gray-50">Refresh</button>
            <button onClick={handleClearAll} className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm text-sm hover:bg-red-700">Clear All</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {items.length === 0 && (
            <div className="p-8 bg-white rounded-2xl shadow-lg text-center text-gray-500">
              No history yet — your recent actions will show up here.
            </div>
          )}

          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-lg">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-none bg-gray-100 flex items-center justify-center">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-sm">{item.type.toUpperCase()}</div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.subtitle}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(item.date).toLocaleString()}</div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <button onClick={() => openItem(item)} className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Open</button>
                    <button onClick={() => handleDelete(item.id)} className="px-3 py-2 bg-gray-100 text-red-600 rounded-md text-sm hover:bg-gray-200">Delete</button>
                  </div>
                </div>

                {item.details && <p className="mt-3 text-sm text-gray-600 line-clamp-3">{item.details}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
