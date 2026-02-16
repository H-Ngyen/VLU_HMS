import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import type { Patient } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PatientInfoSection } from "../Edit/sections/PatientInfoSection";
import { AddressInfoSection } from "../Edit/sections/AddressInfoSection";
import { InsuranceInfoSection } from "../Edit/sections/InsuranceInfoSection";
import { RelativeInfoSection } from "../Edit/sections/RelativeInfoSection";

export const AddPatientForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Patient>>({
    fullName: '', dob: '', age: 0, gender: 'Nam', job: '', jobCode: '',
    ethnicity: 'Kinh', nationality: 'Việt Nam', addressStreet: '',
    addressWard: '', addressDistrict: '', addressProvince: '',
    workplace: '', subjectType: 'BHYT', insuranceExpiry: '',
    insuranceNumber: '', relativeInfo: '', relativePhone: ''
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value };
      if (field === 'dob' && typeof value === 'string') {
        const birthYear = new Date(value).getFullYear();
        const currentYear = new Date().getFullYear();
        if (!isNaN(birthYear)) {
           newState.age = currentYear - birthYear;
        }
      }
      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatientId = `BN${Date.now().toString().slice(-4)}`;
    // Simulate API call
    console.log("Creating patient:", { id: newPatientId, ...formData });
    alert(`Đã thêm bệnh nhân "${formData.fullName}" thành công!`);
    // Navigate back to patient list or to create record
    navigate('/patients');
  };

  return (
    <div className="w-full p-4 md:p-6">
        <Button 
          variant="outline"
          onClick={() => navigate('/patients')}
          className="mb-4 hover:bg-gray-50 hover:text-red-700 hover:border-red-700"
        >
          <ArrowLeft size={18} className="mr-2" /> Hủy bỏ
        </Button>

        <Card>
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-xl font-bold text-gray-800">Đăng Ký Bệnh Nhân Mới</CardTitle>
            <CardDescription>Nhập thông tin hành chính chi tiết.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-6">I. HÀNH CHÍNH</h3>
                <PatientInfoSection formData={formData} handleChange={handleChange} />
                <AddressInfoSection formData={formData} handleChange={handleChange} />
                <div className="mt-6"></div>
                <InsuranceInfoSection formData={formData} handleChange={handleChange} />
                <RelativeInfoSection formData={formData} handleChange={handleChange} />
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100">
                <Button type="submit" className="bg-red-700 hover:bg-red-800 font-bold px-8 py-6 text-base">
                  <Save size={20} className="mr-2" /> Lưu & Tạo Hồ Sơ
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  );
};
