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
          
          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Hoặc</span>
            </div>
          </div>
          
          <Button
            onClick={() => window.location.href = '/patient-login'}
            variant="outline"
            className="flex h-12 w-full items-center justify-center gap-3 transition-all font-bold text-lg text-gray-700 hover:bg-gray-50"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Bệnh nhân đăng nhập
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
