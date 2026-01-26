import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { Record, Transfer } from "@/types";

interface PatientManagementSectionProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
  readOnly?: boolean;
}

export const PatientManagementSection = ({ formData, setFormData, readOnly = false }: PatientManagementSectionProps) => {
  const managementData = formData.managementData;

  const handleChange = (field: string, value: any) => {
    if (readOnly) return;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        managementData: {
          ...prev.managementData,
          [field]: value,
        },
      };
    });
  };

  const handleTransferChange = (index: number, field: keyof Transfer, value: any) => {
    if (readOnly) return;
    const newTransfers = [...managementData.transfers];
    newTransfers[index] = { ...newTransfers[index], [field]: value };
    handleChange("transfers", newTransfers);
  };

  const addTransfer = () => {
    if (readOnly) return;
    const newTransfer: Transfer = { department: "", date: "", days: 0, time: "" };
    handleChange("transfers", [...managementData.transfers, newTransfer]);
  };

  const removeTransfer = (index: number) => {
    if (readOnly) return;
    const newTransfers = managementData.transfers.filter((_, i) => i !== index);
    handleChange("transfers", newTransfers);
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const val = e.target.value; // Format: YYYY-MM-DDTHH:MM
    if (val) {
      const [date, time] = val.split('T');
      setFormData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          admissionDate: date,
          managementData: {
            ...prev.managementData,
            admissionTime: time,
          },
        };
      });
    }
  };

  // Combine date and time for input value
  const dateTimeValue = formData.admissionDate && managementData.admissionTime 
    ? `${formData.admissionDate}T${managementData.admissionTime}` 
    : "";

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>10. Vào viện lúc</Label>
            <Input
              type="datetime-local"
              value={dateTimeValue}
              onChange={handleDateTimeChange}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>11. Trực tiếp vào</Label>
             <Input
              value={managementData.admissionType || ""}
              onChange={(e) => handleChange("admissionType", e.target.value)}
              placeholder="Ví dụ: Cấp cứu, KKB..."
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>12. Nơi giới thiệu</Label>
             <Input
              value={managementData.referralSource || ""}
              onChange={(e) => handleChange("referralSource", e.target.value)}
              placeholder="Cơ quan y tế, Tự đến..."
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>13. Vào viện lần thứ</Label>
            <Input
              type="number"
              value={managementData.admissionCount || 1}
              onChange={(e) => handleChange("admissionCount", e.target.value)}
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">14. Chuyển khoa</Label>
            {!readOnly && (
                <Button type="button" variant="outline" size="sm" onClick={addTransfer} className="h-8">
                <Plus size={14} className="mr-1" /> Thêm khoa
                </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {managementData.transfers.map((transfer, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="md:col-span-4 space-y-1">
                  <Label className="text-xs">Khoa</Label>
                  <Input
                    value={transfer.department}
                    onChange={(e) => handleTransferChange(index, "department", e.target.value)}
                    placeholder="Tên khoa"
                    className="h-9 bg-white"
                    disabled={readOnly}
                  />
                </div>
                <div className="md:col-span-3 space-y-1">
                   <Label className="text-xs">Ngày đến</Label>
                   <Input
                    type="date"
                    value={transfer.date}
                    onChange={(e) => handleTransferChange(index, "date", e.target.value)}
                    className="h-9 bg-white"
                    disabled={readOnly}
                  />
                </div>
                 <div className="md:col-span-2 space-y-1">
                   <Label className="text-xs">Giờ</Label>
                   <Input
                    type="time"
                    value={transfer.time || ""}
                    onChange={(e) => handleTransferChange(index, "time", e.target.value)}
                    className="h-9 bg-white"
                    disabled={readOnly}
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                   <Label className="text-xs">Số ngày</Label>
                   <Input
                    type="number"
                    value={transfer.days}
                    onChange={(e) => handleTransferChange(index, "days", e.target.value)}
                    className="h-9 bg-white"
                    disabled={readOnly}
                  />
                </div>
                 <div className="md:col-span-1 flex justify-center pb-1">
                  {!readOnly && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeTransfer(index)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 size={16} />
                      </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
             <div className="space-y-2">
                <Label>15. Chuyển viện (Tuyến)</Label>
                 <Input
                  value={managementData.hospitalTransfer?.type || ""}
                  onChange={(e) => handleChange("hospitalTransfer", { ...managementData.hospitalTransfer, type: e.target.value })}
                  disabled={readOnly}
                />
             </div>
              <div className="space-y-2">
                <Label>Đến bệnh viện</Label>
                 <Input
                  value={managementData.hospitalTransfer?.destination || ""}
                   onChange={(e) => handleChange("hospitalTransfer", { ...managementData.hospitalTransfer, destination: e.target.value })}
                   disabled={readOnly}
                />
             </div>
        </div>
        
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <Label>16. Ra viện</Label>
                 <Input
                  value={managementData.dischargeType || ""}
                  onChange={(e) => handleChange("dischargeType", e.target.value)}
                   placeholder="Ra viện, chuyển viện, trốn viện..."
                   disabled={readOnly}
                />
             </div>
              <div className="space-y-2">
                <Label>17. Tổng số ngày điều trị</Label>
                 <Input
                  type="number"
                  value={managementData.totalDays || 0}
                   onChange={(e) => handleChange("totalDays", e.target.value)}
                   disabled={readOnly}
                />
             </div>
        </div>

      </CardContent>
    </Card>
  );
};
