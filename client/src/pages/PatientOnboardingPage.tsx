import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";
import logo from "@/assets/vlu-logo.png";

const PatientOnboardingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const googleToken = location.state?.googleToken;

  const [isLoading, setIsLoading] = useState(false);
  const [ethnicities, setEthnicities] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '0',
    ethnicityId: '',
    healthInsuranceNumber: '',
  });

  useEffect(() => {
    if (!googleToken) {
      toast.error("Không tìm thấy thông tin đăng nhập Google.");
      navigate('/patient-login');
    }
  }, [googleToken, navigate]);

  useEffect(() => {
    const fetchEthnicities = async () => {
      try {
        const data = await api.ethnicities.getAll();
        setEthnicities(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, ethnicityId: data[0].id.toString() }));
        }
      } catch (error) {
        console.error("Failed to load ethnicities", error);
        toast.error("Không thể tải danh sách dân tộc.");
      }
    };
    fetchEthnicities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const handleEthnicityChange = (value: string) => {
    setFormData(prev => ({ ...prev, ethnicityId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const payload = {
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        gender: parseInt(formData.gender, 10),
        ethnicityId: parseInt(formData.ethnicityId, 10),
        healthInsuranceNumber: formData.healthInsuranceNumber,
      };

      const response = await api.auth.googleOnboard(googleToken, payload);
      
      if (response && response.token) {
        localStorage.setItem("patient_token", response.token);
        if (response.userId) {
          localStorage.setItem("patient_id", response.userId.toString());
        }
        window.dispatchEvent(new Event("patient_logged_in"));
        toast.success("Đăng ký hồ sơ thành công!");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Onboarding error", error);
      toast.error(error.message || "Có lỗi xảy ra khi tạo hồ sơ. Vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-2xl border-t-4 border-t-vlu-red shadow-xl relative overflow-hidden">
        {isLoading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-vlu-red" />
                <p className="mt-2 text-sm font-medium text-gray-700">Đang tạo hồ sơ bệnh án...</p>
            </div>
        )}
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="flex justify-center">
            <img src={logo} alt="VLU Logo" className="h-16 w-auto object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Hoàn Tất Hồ Sơ Bệnh Nhân
          </CardTitle>
          <CardDescription className="text-gray-500">
            Vui lòng cung cấp thêm thông tin để hoàn tất việc đăng ký hồ sơ bệnh án của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Ngày sinh <span className="text-red-500">*</span></Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Giới tính <span className="text-red-500">*</span></Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={handleGenderChange}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="gender-male" />
                  <Label htmlFor="gender-male">Nam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="gender-female" />
                  <Label htmlFor="gender-female">Nữ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="gender-other" />
                  <Label htmlFor="gender-other">Khác</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ethnicityId">Dân tộc <span className="text-red-500">*</span></Label>
                <Select value={formData.ethnicityId} onValueChange={handleEthnicityChange} required>
                  <SelectTrigger id="ethnicityId">
                    <SelectValue placeholder="Chọn dân tộc" />
                  </SelectTrigger>
                  <SelectContent>
                    {ethnicities.map((ethnicity) => (
                      <SelectItem key={ethnicity.id} value={ethnicity.id.toString()}>
                        {ethnicity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthInsuranceNumber">Số BHYT <span className="text-red-500">*</span></Label>
                <Input
                  id="healthInsuranceNumber"
                  name="healthInsuranceNumber"
                  required
                  value={formData.healthInsuranceNumber}
                  onChange={handleChange}
                  placeholder="Nhập số Bảo Hiểm Y Tế"
                />
                <p className="text-xs text-gray-500 mt-1">Hệ thống sử dụng số BHYT để định danh hồ sơ y tế của bạn.</p>
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full bg-vlu-red hover:bg-red-700 h-12 text-md">
                Hoàn tất đăng ký
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientOnboardingPage;
