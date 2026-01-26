import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { Record, ManagementData } from "@/types";

interface PatientManagementProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
}

export const PatientManagementSection = ({ formData, setFormData }: PatientManagementProps) => {
  const handleManagementChange = (field: keyof ManagementData, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        managementData: { ...prev.managementData, [field]: value },
      };
    });
  };

  const updateTransfer = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newTransfers = [...prev.managementData.transfers];
      newTransfers[index] = { ...newTransfers[index], [field]: value };
      return {
        ...prev,
        managementData: { ...prev.managementData, transfers: newTransfers },
      };
    });
  };

  const addTransfer = () => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        managementData: {
          ...prev.managementData,
          transfers: [
            ...prev.managementData.transfers,
            { department: "", date: "", time: "", days: 0 },
          ],
        },
      };
    });
  };

  const removeTransfer = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        managementData: {
          ...prev.managementData,
          transfers: prev.managementData.transfers.filter((_, i) => i !== index),
        },
      };
    });
  };
  
  const handleHospitalTransferChange = (field: string, value: any) => {
    setFormData((prev) => {
        if (!prev) return null;
        return {
            ...prev,
            managementData: {
                ...prev.managementData,
                hospitalTransfer: {
                    ...prev.managementData.hospitalTransfer,
                    [field]: value
                }
            }
        }
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-800">II. QUẢN LÝ NGƯỜI BỆNH</h3>
      </div>
      <div className="p-8 space-y-8">
        {/* 12. Vào viện lúc */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-1.5 block">12. Vào viện lúc</Label>
            <div className="flex gap-2">
              <Input
                type="time"
                className="w-32"
                value={formData.managementData?.admissionTime || ""}
                onChange={(e) => handleManagementChange("admissionTime", e.target.value)}
              />
              <Input
                type="date"
                className="flex-1"
                value={formData.admissionDate}
                onChange={(e) =>
                  setFormData((prev) => (prev ? { ...prev, admissionDate: e.target.value } : null))
                }
              />
            </div>
          </div>
        </div>

        {/* 13. Trực tiếp vào */}
        <div>
          <Label className="mb-2 block">13. Trực tiếp vào</Label>
          <RadioGroup
            value={formData.managementData?.admissionType}
            onValueChange={(val) => handleManagementChange("admissionType", val)}
            className="flex gap-4 flex-wrap"
          >
            {["Cấp cứu", "KKB", "Khoa điều trị"].map((opt) => (
              <div key={opt} className="flex items-center space-x-2">
                <RadioGroupItem value={opt} id={`adm-${opt}`} />
                <Label htmlFor={`adm-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* 14. Nơi giới thiệu & Lần thứ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block">14. Nơi giới thiệu</Label>
            <RadioGroup
              value={formData.managementData?.referralSource}
              onValueChange={(val) => handleManagementChange("referralSource", val)}
              className="flex gap-4 flex-wrap"
            >
              {["Cơ quan y tế", "Tự đến", "Khác"].map((opt) => (
                <div key={opt} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`ref-${opt}`} />
                  <Label htmlFor={`ref-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label className="mb-1.5 block">Vào viện lần thứ</Label>
            <Input
              type="number"
              value={formData.managementData?.admissionCount || ""}
              onChange={(e) => handleManagementChange("admissionCount", e.target.value)}
            />
          </div>
        </div>

        {/* 15. Vào Khoa */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 font-bold text-sm text-gray-700">
            15. Vào Khoa
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Label className="text-xs text-gray-500 mb-1">Tên Khoa</Label>
              <Input
                value={formData.managementData?.transfers?.[0]?.department || ""}
                onChange={(e) => updateTransfer(0, "department", e.target.value)}
                placeholder="VD: Nội Hô Hấp"
              />
            </div>
            <div className="md:col-span-1">
              <Label className="text-xs text-gray-500 mb-1">Ngày vào</Label>
              <Input
                type="date"
                value={formData.managementData?.transfers?.[0]?.date || ""}
                onChange={(e) => updateTransfer(0, "date", e.target.value)}
              />
            </div>
            <div className="md:col-span-1">
              <Label className="text-xs text-gray-500 mb-1">Giờ vào</Label>
              <Input
                type="time"
                value={formData.managementData?.transfers?.[0]?.time || ""}
                onChange={(e) => updateTransfer(0, "time", e.target.value)}
              />
            </div>
            <div className="md:col-span-1">
              <Label className="text-xs text-gray-500 mb-1">Số ngày điều trị</Label>
              <Input
                type="number"
                value={formData.managementData?.transfers?.[0]?.days || ""}
                onChange={(e) => updateTransfer(0, "days", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 16. Chuyển Khoa */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <Label className="font-semibold text-sm text-gray-700">16. Chuyển Khoa</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addTransfer}
              className="text-blue-600 hover:bg-blue-50"
            >
              <Plus size={14} className="mr-1" /> Thêm khoa
            </Button>
          </div>
          {(formData.managementData?.transfers?.length ?? 0) > 1 ? (
            <div className="divide-y divide-gray-100">
              {formData.managementData.transfers.map((t, idx) => {
                if (idx === 0) return null;
                return (
                  <div key={idx} className="p-4 grid grid-cols-1 md:grid-cols-9 gap-4 items-end">
                    <div className="md:col-span-3">
                      <Label className="text-xs text-gray-500 mb-1">Khoa chuyển đến</Label>
                      <Input
                        value={t.department}
                        onChange={(e) => updateTransfer(idx, "department", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs text-gray-500 mb-1">Ngày chuyển</Label>
                      <Input
                        type="date"
                        value={t.date}
                        onChange={(e) => updateTransfer(idx, "date", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs text-gray-500 mb-1">Giờ chuyển</Label>
                      <Input
                        type="time"
                        value={t.time || ""}
                        onChange={(e) => updateTransfer(idx, "time", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Label className="text-xs text-gray-500 mb-1">Số ngày</Label>
                      <Input
                        type="number"
                        value={t.days}
                        onChange={(e) => updateTransfer(idx, "days", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTransfer(idx)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400 italic text-sm">
              Chưa có thông tin chuyển khoa
            </div>
          )}
        </div>

        {/* 17. Chuyển viện & 18. Ra viện */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 border border-gray-200 rounded-lg">
            <Label className="block text-sm font-bold text-gray-700 mb-3">17. Chuyển viện</Label>
            <div className="space-y-3">
              <RadioGroup
                value={formData.managementData?.hospitalTransfer?.type}
                onValueChange={(val) => handleHospitalTransferChange("type", val)}
                className="flex gap-4"
              >
                {["Tuyến trên", "Tuyến dưới", "CK"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={`ht-${type}`} />
                    <Label htmlFor={`ht-${type}`} className="font-normal cursor-pointer">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
              <div>
                <Label className="text-xs text-gray-500 mb-1">Chuyển đến:</Label>
                <Input
                  placeholder="Tên bệnh viện..."
                  value={formData.managementData?.hospitalTransfer?.destination || ""}
                  onChange={(e) => handleHospitalTransferChange("destination", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <Label className="block text-sm font-bold text-gray-700 mb-3">18. Ra viện</Label>
            <RadioGroup
              value={formData.managementData?.dischargeType}
              onValueChange={(val) => handleManagementChange("dischargeType", val)}
              className="flex gap-4 flex-wrap mb-4"
            >
              {["Ra viện", "Xin về", "Bỏ về", "Đưa về"].map((opt) => (
                <div key={opt} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`dt-${opt}`} />
                  <Label htmlFor={`dt-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
            
            <Label className="block text-sm font-bold text-gray-700 mb-1 mt-4">19. Tổng số ngày điều trị</Label>
            <Input
              type="number"
              value={formData.managementData?.totalDays || ""}
              onChange={(e) => handleManagementChange("totalDays", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
