import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import type { Patient } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PatientInfoSection } from './PatientInfoSection';
import { AddressInfoSection } from './AddressInfoSection';
import { InsuranceInfoSection } from './InsuranceInfoSection';
import { RelativeInfoSection } from './RelativeInfoSection';

export const PatientForm = () => {
  const { addPatient } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    age: '' as string | number,
    gender: 'Nam',
    job: '',
    jobCode: '',
    ethnicity: 'Kinh',
    nationality: 'Việt Nam',
    addressStreet: '',
    addressWard: '',
    addressDistrict: '',
    addressProvince: '',
    workplace: '',
    subjectType: 'BHYT',
    insuranceExpiry: '',
    insuranceNumber: '',
    relativeInfo: '',
    relativePhone: ''
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value };
      
      // Auto-calculate Age if 'dob' field changes
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
    const fullAddress = `${formData.addressStreet}, ${formData.addressWard}, ${formData.addressDistrict}, ${formData.addressProvince}`;
    
    const age = typeof formData.age === 'string' ? parseInt(formData.age || '0', 10) : formData.age;

    const newPatient: Patient = {
      id: newPatientId,
      fullName: formData.fullName,
      dob: formData.dob,
      age: age,
      gender: formData.gender,
      job: formData.job,
      jobCode: formData.jobCode,
      ethnicity: formData.ethnicity,
      nationality: formData.nationality,
      address: fullAddress,
      addressStreet: formData.addressStreet,
      addressWard: formData.addressWard,
      addressDistrict: formData.addressDistrict,
      addressProvince: formData.addressProvince,
      workplace: formData.workplace,
      subjectType: formData.subjectType,
      insuranceExpiry: formData.insuranceExpiry,
      insuranceNumber: formData.insuranceNumber,
      relativeInfo: formData.relativeInfo,
      relativePhone: formData.relativePhone
    };
    
    addPatient(newPatient);
    alert(`Đã lưu bệnh nhân "${formData.fullName}". Đang chuyển sang tạo hồ sơ...`);
    navigate(`/records/create/${newPatientId}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
        <Button 
          variant="outline"
          onClick={() => navigate('/patient-management')}
          className="mb-4 hover:bg-gray-50 hover:text-vlu-red hover:border-vlu-red"
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
                <button 
                  type="submit"
                  className="px-8 py-3 bg-vlu-red text-white rounded-lg hover:bg-red-700 font-bold transition shadow-md flex items-center cursor-pointer"
                >
                  <Save size={20} className="mr-2" /> Lưu & Tạo Hồ Sơ Bệnh Án
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  );
};