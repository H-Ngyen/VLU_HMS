import { useAuth0 } from "@auth0/auth0-react";
import logo from "@/assets/vlu-logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vlu-red" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border-t-4 border-t-vlu-red shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src={logo} alt="VLU Logo" className="h-20 w-auto object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Hệ thống Quản lý Bệnh án
          </CardTitle>
          <CardDescription className="text-gray-500">
            Chào mừng bạn đến với hệ thống quản lý bệnh án của Đại học Văn Lang. Vui lòng đăng nhập để tiếp tục.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-8">
          <Button
            onClick={handleLogin}
            className="flex h-12 w-full items-center justify-center gap-3 bg-[#0078d4] text-white hover:bg-[#006cc1] transition-all font-bold text-lg"
          >
            <svg width="20" height="20" viewBox="0 0 23 23">
              <path fill="#f3f3f3" d="M0 0h11.5v11.5H0zM11.5 0H23v11.5H11.5zM0 11.5h11.5V23H0zM11.5 11.5H23V23H11.5z" />
            </svg>
            Đăng nhập với Microsoft
          </Button>
          <p className="mt-4 text-center text-xs text-gray-400">
            © 2026 Van Lang University Hospital Management System
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
