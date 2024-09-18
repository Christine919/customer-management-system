import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import supabase from './config/supabaseClient.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);