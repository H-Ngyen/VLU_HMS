import { useNavigate } from "react-router-dom";
import { UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PatientPageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const PatientPageHeader = ({ searchTerm, onSearchChange }: PatientPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Bệnh Nhân</h1>
        
        <Button 
            onClick={() => navigate('/patients/new')}
            className="bg-green-600 hover:bg-green-700 text-white"
        >
            <UserPlus size={18} className="mr-2" /> Thêm Bệnh Nhân Mới
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input 
            placeholder="Tìm kiếm bệnh nhân (Tên, Mã BN)..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
      </div>
    </div>
  );
};
