import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { UserPlus, FilePlus, Search, Users, History, Edit } from 'lucide-react';

const PatientManagement = () => {
  const { patients } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bệnh Nhân</h1>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button 
                onClick={() => navigate('/patients/new')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition shadow-sm flex items-center whitespace-nowrap"
            >
                <UserPlus size={18} className="mr-2" /> Thêm Bệnh Nhân Mới
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Tìm kiếm bệnh nhân (Tên, Mã BN)..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vlu-red focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                  <th className="px-6 py-4">Mã BN</th>
                  <th className="px-6 py-4">Họ và tên</th>
                  <th className="px-6 py-4">Ngày sinh</th>
                  <th className="px-6 py-4">Giới tính</th>
                  <th className="px-6 py-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">{patient.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{patient.fullName}</td>
                      <td className="px-6 py-4 text-gray-600">{patient.dob}</td>
                      <td className="px-6 py-4 text-gray-600">{patient.gender}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => navigate(`/patients/edit/${patient.id}`)}
                              className="bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 text-xs font-medium px-3 py-1.5 rounded-md inline-flex items-center transition"
                              title="Sửa thông tin bệnh nhân"
                            >
                              <Edit size={14} className="mr-1" /> Sửa
                            </button>
                            <button 
                              onClick={() => navigate(`/repository?patientId=${patient.id}`)}
                              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium px-3 py-1.5 rounded-md inline-flex items-center transition"
                              title="Xem tất cả hồ sơ cũ"
                            >
                              <History size={14} className="mr-1" /> Lịch sử BA
                            </button>
                            <button 
                              onClick={() => navigate(`/records/create/${patient.id}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md inline-flex items-center transition"
                            >
                              <FilePlus size={14} className="mr-1" /> Tạo HSBA
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <Users size={48} className="mx-auto text-gray-300 mb-4" />
                      Không tìm thấy bệnh nhân nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default PatientManagement;
