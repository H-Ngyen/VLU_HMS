import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PatientPageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const PatientPageHeader = ({
  searchTerm,
  onSearchChange,
}: PatientPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bệnh Nhân</h1>
        <p className="text-gray-500 text-sm mt-1">
          Bệnh nhân và thông tin chi tiết
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <Input
            placeholder="Tìm kiếm theo mã BN, tên hoặc số cccd"
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
            <Button 
                onClick={() => navigate('/patient/add')}
                className="bg-vlu-red hover:bg-red-700 flex items-center gap-2"
            >
                <Plus size={16} />
                <span>Thêm Mới</span>
            </Button>
        </div>
      </div>
    </div>
  );
};
