import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/globals.css";

import App from "./App";
import AppProviders from "./app/providers";
import { setupInterceptors } from "./api/interceptors";

setupInterceptors();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);