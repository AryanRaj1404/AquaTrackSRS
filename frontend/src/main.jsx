import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {GoogleOAuthProvider} from "@react-oauth/google";

import App from "./App";
import "./styles/global.css";
import AppToaster from "./components/AppToaster";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
        <AppToaster/>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);