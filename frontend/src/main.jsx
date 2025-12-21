// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css' ;
import {LanguageProvider} from "./context/LanguageContext.jsx";
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
    <App />
    </LanguageProvider>
  </React.StrictMode>
)
