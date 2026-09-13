import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LangProvider } from './context/LangContext';
import './index.css';
import './utils/axiosConfig';
// import '@tabler/icons-webfont/tabler-icons.min.css';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </LangProvider>
  </React.StrictMode>
);