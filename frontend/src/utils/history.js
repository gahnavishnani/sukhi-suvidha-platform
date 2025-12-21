// src/utils/history.js
export const HISTORY_KEY = "appHistory";

const readRaw = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read history:", e);
    return [];
  }
};

const writeRaw = (arr) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
  } catch (e) {
    console.error("Failed to write history:", e);
  }
};

export const getHistory = () => {
  return readRaw();
};

export const addHistory = (item) => {
  // item: { type: 'upload' | 'appointment' | 'hospital', title, subtitle, details, thumbnail, extra }
  const arr = readRaw();
  const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const entry = {
    id,
    date: new Date().toISOString(),
    ...item
  };
  arr.unshift(entry); // newest first
  writeRaw(arr);
  return entry;
};

export const removeHistory = (id) => {
  const arr = readRaw();
  const filtered = arr.filter((i) => i.id !== id);
  writeRaw(filtered);
  return filtered;
};

export const clearHistory = () => {
  writeRaw([]);
  return [];
};
