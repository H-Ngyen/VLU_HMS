import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import type { Patient } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PatientInfoSection } from "./PatientInfoSection";
import { AddressInfoSection } from "./AddressInfoSection";
import { InsuranceInfoSection } from "./InsuranceInfoSection";
import { RelativeInfoSection } from "./RelativeInfoSection";

const getInitialData = (patient: Patient | undefined) => {
  if (!patient) {
    return {
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
    };
  }

  return {
    fullName: patient.fullName || '',
    dob: patient.dob || '',
    age: patient.age || '',
    gender: patient.gender || 'Nam',
    job: patient.job || '',
    jobCode: patient.jobCode || '',
    ethnicity: patient.ethnicity || 'Kinh',
    nationality: patient.nationality || 'Việt Nam',
    addressStreet: patient.addressStreet || patient.address || '',
    addressWard: patient.addressWard || '',
    addressDistrict: patient.addressDistrict || '',
    addressProvince: patient.addressProvince || '',
    workplace: patient.workplace || '',
    subjectType: patient.subjectType || 'BHYT',
    insuranceExpiry: patient.insuranceExpiry || '',
    insuranceNumber: patient.insuranceNumber || '',
    relativeInfo: patient.relativeInfo || '',
    relativePhone: patient.relativePhone || ''
  };
};

export const EditPatientForm = () => {
  const { patients, updatePatient } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const patientToEdit = patients.find(p => p.id === id);

  const [formData, setFormData] = useState(() => getInitialData(patientToEdit));

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
    if (!id) return;

    const fullAddress = `${formData.addressStreet}, ${formData.addressWard}, ${formData.addressDistrict}, ${formData.addressProvince}`;
    const age = typeof formData.age === 'string' ? parseInt(formData.age || '0', 10) : formData.age;

    const updatedPatient: Patient = {
      id: id,
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
    
    updatePatient(updatedPatient);
    alert(`Đã cập nhật thông tin bệnh nhân "${formData.fullName}" thành công!`);
    navigate('/patient-management');
  };

  if (!patientToEdit) return <div className="p-8 text-center text-gray-500">Bệnh nhân không tồn tại</div>;

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
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 font-bold px-8 py-6 text-base cursor-pointer"
                >
                  <Save size={20} className="mr-2" /> Lưu Thay Đổi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  );
};
