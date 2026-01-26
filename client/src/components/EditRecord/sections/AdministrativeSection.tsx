import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InfoRow } from "./InfoRow";
import type { Patient } from "@/types";

interface AdministrativeSectionProps {
  patient: Patient;
  setPatient: (patient: Patient) => void;
  readOnly?: boolean;
}

export const AdministrativeSection = ({ patient, setPatient, readOnly = false }: AdministrativeSectionProps) => {
  
  const handleChange = (field: keyof Patient, value: any) => {
    if (readOnly) return;
    setPatient({ ...patient, [field]: value });
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-6 space-y-1">
        {/* Read-only fields */}
        <InfoRow label="1. Họ và tên" value={patient.fullName} />
        <InfoRow 
          label="2. Sinh ngày" 
          value={
            <span>
              {patient.dob} <span className="text-gray-400 font-normal ml-2">(Tuổi: {patient.age}, Giới tính: {patient.gender})</span>
            </span>
          } 
        />
        <InfoRow label="3. Dân tộc" value={patient.ethnicity} />

        {/* Editable: Job */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-500 font-medium">4. Nghề nghiệp</label>
            <Input 
                value={patient.job} 
                onChange={(e) => handleChange("job", e.target.value)}
                className="h-8 text-sm"
                placeholder="Nhập nghề nghiệp..."
                disabled={readOnly}
            />
        </div>

        <InfoRow label="5. Địa chỉ" value={patient.address} />
        <InfoRow label="6. Nơi làm việc" value={patient.workplace} />

        {/* Editable: Subject Type */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-500 font-medium">7. Đối tượng</label>
            <Select value={patient.subjectType} onValueChange={(val) => handleChange("subjectType", val)} disabled={readOnly}>
                <SelectTrigger className="h-8 w-full md:w-64">
                    <SelectValue placeholder="Chọn đối tượng" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="BHYT">BHYT</SelectItem>
                    <SelectItem value="Thu phí">Thu phí</SelectItem>
                    <SelectItem value="Miễn">Miễn</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Mixed: BHYT (Number read-only, Expiry editable) */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-500 font-medium">8. BHYT</label>
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                <span className="text-sm font-medium text-gray-900 mr-2">
                    Số: {patient.insuranceNumber || "---"}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">(Hạn: </span>
                    <Input 
                        value={patient.insuranceExpiry} 
                        onChange={(e) => handleChange("insuranceExpiry", e.target.value)}
                        className="h-8 w-32 text-sm"
                        placeholder="dd/mm/yyyy"
                        disabled={readOnly}
                    />
                    <span className="text-sm text-gray-500">)</span>
                </div>
            </div>
        </div>

        {/* Editable: Relative Info (Large Textarea) */}
        {/* Editable: Relative Info (Large Textarea) */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-start">
            <label className="text-sm text-gray-500 font-medium mt-2">9. Người nhà</label>
            <Textarea 
                value={`${patient.relativeInfo}${patient.relativePhone ? ` - SĐT: ${patient.relativePhone}` : ""}`} 
                onChange={(e) => handleChange("relativeInfo", e.target.value)}
                className="min-h-[100px] text-sm"
                placeholder="Họ tên, địa chỉ, số điện thoại người nhà..."
                disabled={readOnly}
            />
        </div>

        <InfoRow label="10. Số định danh (CCCD)" value={patient.cccd || "---"} />
      </CardContent>
    </Card>
  );
};