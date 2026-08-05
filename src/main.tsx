import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./styles/globals.css";

import App from "./App";
import AppProviders from "./app/providers";
import { setupInterceptors } from "./api/interceptors";

setupInterceptors();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AppProviders>
      <App />
    </AppProviders>
    </GoogleOAuthProvider>
  </StrictMode>
);