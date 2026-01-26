import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import type { Patient } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PatientInfoSection } from "./sections/PatientInfoSection";
import { AddressInfoSection } from "./sections/AddressInfoSection";
import { InsuranceInfoSection } from "./sections/InsuranceInfoSection";
import { RelativeInfoSection } from "./sections/RelativeInfoSection";
import { INITIAL_PATIENTS } from "@/mockData";

const getInitialData = (patient: Patient | undefined): Partial<Patient> => {
  if (!patient) {
    return {
      fullName: '', dob: '', age: 0, gender: 'Nam', job: '', jobCode: '',
      ethnicity: 'Kinh', nationality: 'Việt Nam', addressStreet: '',
      addressWard: '', addressDistrict: '', addressProvince: '',
      workplace: '', subjectType: 'BHYT', insuranceExpiry: '',
      insuranceNumber: '', relativeInfo: '', relativePhone: ''
    };
  }
  return { ...patient };
};

export const EditPatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock data usage
  const patientToEdit = INITIAL_PATIENTS.find(p => p.id === id);
  const [formData, setFormData] = useState<Partial<Patient>>(() => getInitialData(patientToEdit));

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
    if (!id) return;
    // Simulate API call
    console.log("Saving patient:", formData);
    alert(`Đã cập nhật thông tin bệnh nhân "${formData.fullName}" thành công!`);
    navigate('/patients');
  };

  if (!patientToEdit) return <div className="p-8 text-center text-gray-500">Bệnh nhân không tồn tại</div>;

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
            <CardTitle className="text-xl font-bold text-gray-800">Chỉnh Sửa Thông Tin Bệnh Nhân</CardTitle>
            <CardDescription>Mã BN: {id}</CardDescription>
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
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold px-8 py-6 text-base">
                  <Save size={20} className="mr-2" /> Lưu Thay Đổi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  );
};
