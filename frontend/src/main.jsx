import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {GoogleOAuthProvider} from "@react-oauth/google";
import { WorkspaceProvider } from "./context/WorkspaceContext";

import App from "./App";
import "./styles/global.css";
import AppToaster from "./components/AppToaster";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <WorkspaceProvider>
            <App />
            <AppToaster />
        </WorkspaceProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);