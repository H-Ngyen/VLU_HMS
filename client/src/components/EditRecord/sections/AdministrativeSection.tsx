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
      <CardContent className="p-6 space-y-2">
        {/* 1. Họ và tên */}
        <InfoRow label="1. Họ và tên" value={<span className="font-bold uppercase">{patient.fullName}</span>} />

        {/* 2. Sinh ngày & Tuổi */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
             <label className="text-sm text-gray-700 font-medium">2. Sinh ngày</label>
             <div className="flex items-center gap-4">
                 <span>{patient.dob}</span>
                 <span className="text-gray-400">|</span>
                 <span className="text-gray-700">Tuổi: {patient.age}</span>
             </div>
        </div>

        {/* 3. Giới tính */}
        <InfoRow label="3. Giới tính" value={patient.gender} />

        {/* 4. Nghề nghiệp & Mã nghề */}
         <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-700 font-medium">4. Nghề nghiệp</label>
            <div className="flex items-center gap-2">
                <Input 
                    value={patient.job} 
                    onChange={(e) => handleChange("job", e.target.value)}
                    className="h-8 text-sm flex-1"
                    placeholder="Nhập nghề nghiệp..."
                    disabled={readOnly}
                />
                <Input 
                    value={patient.jobCode || ""} 
                    onChange={(e) => handleChange("jobCode", e.target.value)}
                    className="h-8 text-sm w-24"
                    placeholder="Mã"
                    disabled={readOnly}
                />
            </div>
        </div>

        {/* 5. Dân tộc */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-700 font-medium">5. Dân tộc</label>
            <Input 
                value={patient.ethnicity} 
                readOnly
                className="h-8 text-sm w-full md:w-64 bg-gray-50 text-gray-900 pointer-events-none"
            />
        </div>

        {/* 6. Ngoại kiều */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-700 font-medium">6. Ngoại kiều</label>
             <Input 
                value={patient.nationality} 
                readOnly
                className="h-8 text-sm w-full md:w-64 bg-gray-50 text-gray-900 pointer-events-none"
                placeholder="Việt Nam"
            />
        </div>

        {/* 7. Địa chỉ */}
        <InfoRow label="7. Địa chỉ" value={patient.address} />

        {/* 8. Nơi làm việc */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-700 font-medium">8. Nơi làm việc</label>
            <Input 
                value={patient.workplace} 
                readOnly
                className="h-8 text-sm bg-gray-50 text-gray-900 pointer-events-none"
            />
        </div>

        {/* 9. Đối tượng */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-700 font-medium">9. Đối tượng</label>
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

        {/* 10. BHYT */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-700 font-medium">10. BHYT giá trị đến ngày</label>
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                 <Input 
                    type="date"
                    value={patient.insuranceExpiry} 
                    onChange={(e) => handleChange("insuranceExpiry", e.target.value)}
                    className="h-8 w-36 text-sm"
                    disabled={readOnly}
                />
                <div className="flex items-center gap-2 ml-2">
                    <span className="text-sm text-gray-700">Số thẻ BHYT:</span>
                    <Input 
                        value={patient.insuranceNumber || ""} 
                        readOnly
                        className="h-8 w-48 text-sm bg-gray-50 text-gray-900 pointer-events-none"
                        placeholder="Số thẻ..."
                    />
                </div>
            </div>
        </div>

        {/* 11. Người nhà */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-start">
            <label className="text-sm text-gray-700 font-medium mt-2">11. Họ tên, địa chỉ người nhà</label>
            <div className="w-full space-y-2">
                <Textarea 
                    value={patient.relativeInfo} 
                    onChange={(e) => handleChange("relativeInfo", e.target.value)}
                    className="min-h-[60px] text-sm"
                    placeholder="Họ tên, địa chỉ người nhà cần báo tin..."
                    disabled={readOnly}
                />
                 <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 w-24 flex-shrink-0">Điện thoại số:</span>
                    <Input 
                        value={patient.relativePhone || ""} 
                        onChange={(e) => handleChange("relativePhone", e.target.value)}
                        className="h-8 w-40 text-sm"
                        placeholder="SĐT..."
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};