import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  patientName: string;
  recordId: string;
  onDownload: () => void;
  isDownloading: boolean;
}

export const TopBar = ({ patientName, recordId, onDownload, isDownloading }: TopBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="print-hide bg-white shadow-sm border-b border-gray-200 -mt-8 -mx-8 mb-4 sticky top-0 z-10">
      <div className="flex justify-between items-center h-16 px-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-vlu-red hover:border-vlu-red"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Quay lại danh sách</span>
        </Button>
        <div className="text-center">
          <h2 className="font-bold text-gray-800 text-lg">
            {patientName}
          </h2>
          <p className="text-sm text-gray-500 font-mono">#{recordId}</p>
        </div>
        <Button
          onClick={onDownload}
          disabled={isDownloading}
          className="flex items-center bg-vlu-red hover:bg-red-700 text-white font-semibold"
        >
          {isDownloading ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Đang xử lý...
            </span>
          ) : (
            <>
              <Download size={16} className="mr-2" /> Tải xuống PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
