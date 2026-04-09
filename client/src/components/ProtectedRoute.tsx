import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import { Loader2, AlertCircle } from "lucide-react";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";

interface ProtectedRouteProps {
  component: React.ComponentType<object>;
}

const ProtectedComponent = withAuthenticationRequired(
  ({ component: Component }: { component: React.ComponentType<object> }) => {
    const { isSynced, syncError } = useAuth();
    const { logout } = useAuth0();

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
            <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} variant="destructive">
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
  },
  {
    onRedirecting: () => (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vlu-red" />
      </div>
    ),
  }
);

export const ProtectedRoute = ({ component }: ProtectedRouteProps) => {
  return <ProtectedComponent component={component} />;
};
