import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/inter';
import App from './App';
import './theme/fonts';
import './index.css';
import { tr } from './i18n/tr';
import { en } from './i18n/en';

// The shipped UI is Turkish. The screenshot pipeline requests the English
// locale explicitly so README images stay readable for an international audience.
if (new URLSearchParams(window.location.search).get('lang') === 'en') {
  Object.assign(tr, en);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);