import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientPageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  fromDay?: string;
  onFromDayChange?: (value: string) => void;
  toDay?: string;
  onToDayChange?: (value: string) => void;
  onFilter?: () => void;
}

export const PatientPageHeader = ({
  searchTerm,
  onSearchChange,
  fromDay = "",
  onFromDayChange,
  toDay = "",
  onToDayChange,
  onFilter
}: PatientPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bệnh Nhân</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
        {onFromDayChange && (
          <div className="flex items-center gap-2">
            <Label htmlFor="fromDay" className="text-sm font-medium text-gray-600 whitespace-nowrap">Từ ngày</Label>
            <Input 
              id="fromDay"
              type="date" 
              value={fromDay} 
              onChange={(e) => onFromDayChange(e.target.value)}
              className="w-[140px] h-9"
            />
          </div>
        )}
        {onToDayChange && (
          <div className="flex items-center gap-2">
            <Label htmlFor="toDay" className="text-sm font-medium text-gray-600 whitespace-nowrap">Đến ngày</Label>
            <Input 
              id="toDay"
              type="date" 
              value={toDay} 
              onChange={(e) => onToDayChange(e.target.value)}
              className="w-[140px] h-9"
            />
          </div>
        )}

        <div className="relative w-full sm:w-64 lg:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <Input
            placeholder="Tìm kiếm theo mã BN, tên hoặc số cccd"
            className="pl-9 bg-white h-9"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {onFilter && (
          <Button onClick={onFilter} className="h-9 bg-vlu-red hover:bg-red-700 text-white">
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </Button>
        )}

        <div className="flex gap-2">
            <Button 
                onClick={() => navigate('/patient/add')}
                className="bg-vlu-red hover:bg-red-700 flex items-center gap-2 h-9"
            >
                <Plus size={16} />
                <span>Thêm Mới</span>
            </Button>
        </div>
      </div>
    </div>
  );
};
