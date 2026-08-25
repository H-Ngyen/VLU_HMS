import { useAuth0 } from "@auth0/auth0-react";
import { Loader2, AlertCircle } from "lucide-react";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  component: React.ComponentType<object>;
}

export const ProtectedRoute = ({ component: Component }: ProtectedRouteProps) => {
  const { isSynced, syncError, currentUser, isLoading, isPatient } = useAuth();
  const { logout, isAuthenticated: isAuth0Authenticated, isLoading: isAuth0Loading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuth0Loading && !currentUser) {
       // Only redirect to login if we have finished checking both auths and there's no user.
       if (!isAuth0Authenticated && !localStorage.getItem("patient_token")) {
           // If they have no patient token and aren't Auth0 logged in, send them to login
           navigate("/login");
       } else if (isAuth0Authenticated && !isSynced) {
           // Waiting to sync...
       } else if (localStorage.getItem("patient_token") && !isSynced) {
           // Waiting to sync...
       } else {
           navigate("/login");
       }
    }
  }, [isLoading, isAuth0Loading, currentUser, isAuth0Authenticated, isSynced, navigate]);

  if (isLoading || isAuth0Loading || (currentUser == null && !syncError)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vlu-red" />
      </div>
    );
  }

  if (syncError) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center gap-4 bg-gray-50">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Lỗi xác thực</h1>
        </div>
        <p className="text-gray-600 max-w-md text-center">
          {syncError || "Không thể đồng bộ thông tin tài khoản với hệ thống."}
        </p>
        <div className="flex gap-4 mt-2">
          <Button onClick={() => window.location.reload()} variant="outline">
            Thử lại
          </Button>
          <Button onClick={() => {
              if (isPatient) {
                  localStorage.removeItem("patient_token");
                  window.location.href = "/patient-login";
              } else {
                  logout({ logoutParams: { returnTo: window.location.origin } });
              }
          }} variant="destructive">
            Đăng xuất
          </Button>
        </div>
      </div>
    );
  }

  if (!isSynced) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-vlu-red" />
        <p className="text-gray-500 font-medium animate-pulse">Đang thiết lập phiên làm việc...</p>
      </div>
    );
  }

  return <Component />;
};
