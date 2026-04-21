import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import AppRoutes from "./AppRoutes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email",
      }}
      cacheLocation="localstorage"
    >
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AppRoutes />
            <Toaster position="top-right" richColors closeButton />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </Auth0Provider>
  </StrictMode>
);
