import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AppRoutes from "./AppRoutes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AppRoutes />
      <Toaster position="top-right" richColors closeButton />
    </Router>
  </StrictMode>
);
