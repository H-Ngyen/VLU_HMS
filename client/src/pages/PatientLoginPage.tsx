import { GoogleLogin } from '@react-oauth/google';
import logo from "@/assets/vlu-logo.png";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const PatientLoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      const { credential } = credentialResponse;
      
      const response = await api.auth.googleLogin(credential);
      
      if (response && response.token) {
        localStorage.setItem("patient_token", response.token);
        if (response.userId) {
          localStorage.setItem("patient_id", response.userId.toString());
        }
        // Trigger event so AuthContext picks up the new token
        window.dispatchEvent(new Event("patient_logged_in"));
        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else if (response && response.requiresOnboarding) {
        // Redirect to onboarding page with the token
        navigate("/patient-onboarding", { state: { googleToken: credential } });
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập Google", error);
      if (error.response?.status === 404 || error.message?.includes("RequiresOnboarding") || error.message?.includes("Chưa đăng ký")) {
          // In case the backend throws 404 for un-onboarded user
          navigate("/patient-onboarding", { state: { googleToken: credentialResponse.credential } });
      } else {
          toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Lỗi xác thực với Google. Vui lòng thử lại sau.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border-t-4 border-t-vlu-red shadow-xl relative overflow-hidden">
        {isLoading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-vlu-red" />
                <p className="mt-2 text-sm font-medium text-gray-700">Đang xử lý đăng nhập...</p>
            </div>
        )}
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src={logo} alt="VLU Logo" className="h-20 w-auto object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Cổng Bệnh Nhân VLU
          </CardTitle>
          <CardDescription className="text-gray-500">
            Chào mừng bạn đến với hệ thống quản lý bệnh án. Vui lòng đăng nhập bằng tài khoản Google để tiếp tục.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-8 items-center">
          <div className="w-full flex justify-center py-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                size="large"
                theme="outline"
                text="continue_with"
                shape="rectangular"
              />
          </div>
          <p className="mt-4 text-center text-xs text-gray-400">
            © 2026 Van Lang University Hospital Management System
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientLoginPage;
