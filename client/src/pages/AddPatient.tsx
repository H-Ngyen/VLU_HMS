import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import type { Patient } from '../types';

const AddPatient = () => {
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
    subjectType: 'BHYT', // BHYT, Thu Phí, Miễn, Khác
    insuranceExpiry: '',
    insuranceNumber: '',
    relativeInfo: '',
    relativePhone: ''
  });

  // Auto-calculate Age
  useEffect(() => {
    if (formData.dob) {
      const birthYear = new Date(formData.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      setFormData(prev => ({ ...prev, age: currentYear - birthYear }));
    }
  }, [formData.dob]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatientId = `BN${Date.now().toString().slice(-4)}`;
    const fullAddress = `${formData.addressStreet}, ${formData.addressWard}, ${formData.addressDistrict}, ${formData.addressProvince}`;
    
    // Ensure age is a number
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
      address: fullAddress, // This field is required by Patient interface
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
    <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/patient-management')}
          className="mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-vlu-red hover:border-vlu-red transition shadow-sm flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" /> Hủy bỏ
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Đăng Ký Bệnh Nhân Mới</h1>
            <p className="text-gray-500 text-sm">Nhập thông tin hành chính chi tiết.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">I. HÀNH CHÍNH</h3>
            
            {/* 1. Họ tên */}
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-500 w-6">1.</span>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên (In hoa) <span className="text-red-500">*</span></label>
                    <input 
                        required
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none uppercase font-bold text-gray-800"
                        placeholder="NGUYỄN VĂN A"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value.toUpperCase())}
                    />
                </div>
            </div>

            {/* 2. Sinh ngày - Tuổi */}
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-500 w-6">2.</span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sinh ngày</label>
                        <input 
                            type="date" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                            value={formData.dob}
                            onChange={(e) => handleChange('dob', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi</label>
                        <input 
                            type="number" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none bg-gray-50"
                            value={formData.age}
                            readOnly
                            placeholder="Auto"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Giới tính */}
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-500 w-6">3.</span>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                    <div className="flex gap-6 mt-2">
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="radio" name="gender" value="Nam" 
                                checked={formData.gender === 'Nam'}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                className="w-4 h-4 text-vlu-red focus:ring-vlu-red"
                            />
                            <span className="ml-2">Nam</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="radio" name="gender" value="Nữ" 
                                checked={formData.gender === 'Nữ'}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                className="w-4 h-4 text-vlu-red focus:ring-vlu-red"
                            />
                            <span className="ml-2">Nữ</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* 4. Nghề nghiệp */}
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-500 w-6">4.</span>
                <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nghề nghiệp</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                            value={formData.job}
                            onChange={(e) => handleChange('job', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã nghề</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                            value={formData.jobCode}
                            onChange={(e) => handleChange('jobCode', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 5. Dân tộc */}
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-500 w-6">5.</span>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dân tộc</label>
                    <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                        value={formData.ethnicity}
                        onChange={(e) => handleChange('ethnicity', e.target.value)}
                    />
                </div>
            </div>

            {/* 6. Ngoại kiều */}
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-500 w-6">6.</span>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngoại kiều</label>
                    <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                        value={formData.nationality}
                        onChange={(e) => handleChange('nationality', e.target.value)}
                        placeholder="Việt Nam"
                    />
                </div>
            </div>

            {/* 7. Địa chỉ */}
            <div className="flex items-start gap-4">
                <span className="font-bold text-gray-500 w-6 mt-8">7.</span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số nhà, đường phố / Thôn, ấp</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                            value={formData.addressStreet}
                            onChange={(e) => handleChange('addressStreet', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Xã, phường</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                            value={formData.addressWard}
                            onChange={(e) => handleChange('addressWard', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Huyện (Q, Tx)</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                            value={formData.addressDistrict}
                            onChange={(e) => handleChange('addressDistrict', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh, thành phố</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                            value={formData.addressProvince}
                            onChange={(e) => handleChange('addressProvince', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 8. Nơi làm việc */}
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-500 w-6">8.</span>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nơi làm việc</label>
                    <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                        value={formData.workplace}
                        onChange={(e) => handleChange('workplace', e.target.value)}
                    />
                </div>
            </div>

            {/* 9. Đối tượng */}
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-500 w-6">9.</span>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đối tượng</label>
                    <div className="flex flex-wrap gap-2">
                        {['BHYT', 'Thu phí', 'Miễn', 'Khác'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => handleChange('subjectType', type)}
                                className={`px-4 py-2 text-sm font-medium rounded-md border transition-all ${
                                    formData.subjectType === type 
                                    ? 'bg-vlu-red text-white border-vlu-red' 
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 10. BHYT */}
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-500 w-6">10.</span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">BHYT giá trị đến ngày</label>
                        <input 
                            type="date" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                            value={formData.insuranceExpiry}
                            onChange={(e) => handleChange('insuranceExpiry', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số thẻ BHYT</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                            value={formData.insuranceNumber}
                            onChange={(e) => handleChange('insuranceNumber', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 11. Người nhà */}
            <div className="flex items-start gap-4">
                <span className="font-bold text-gray-500 w-6 mt-8">11.</span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên, địa chỉ người nhà cần báo tin</label>
                        <textarea 
                            rows={2}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                            value={formData.relativeInfo}
                            onChange={(e) => handleChange('relativeInfo', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại số</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-vlu-red outline-none"
                            value={formData.relativePhone}
                            onChange={(e) => handleChange('relativePhone', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-100">
               <button 
                type="submit"
                className="px-8 py-3 bg-vlu-red text-white rounded-lg hover:bg-red-700 font-bold transition shadow-md flex items-center"
              >
                <Save size={20} className="mr-2" /> Lưu & Tạo Hồ Sơ Bệnh Án
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default AddPatient;