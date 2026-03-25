import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InfoRow } from "./InfoRow";
import type { Patient } from "@/types";

interface AdministrativeSectionProps {
  patient: Patient;
  setPatient: (patient: Patient) => void;
  readOnly?: boolean;
}

export const AdministrativeSection = ({ patient, setPatient, readOnly = false }: AdministrativeSectionProps) => {
  
  // Use `any` for address-part fields because the Patient type currently
  // only defines the "base" patient info for the patient table.
  const handleChange = (field: string, value: any) => {
    if (readOnly) return;
    setPatient({ ...(patient as any), [field]: value });
  };

  const buildFullAddress = (parts: {
    houseNumber?: string;
    village?: string;
    wardName?: string;
    districtName?: string;
    provinceName?: string;
  }) => {
    const house = parts.houseNumber?.trim();
    const village = parts.village?.trim();
    const ward = parts.wardName?.trim();
    const district = parts.districtName?.trim();
    const province = parts.provinceName?.trim();

    // Keep it simple: join with commas, without trying to normalize Vietnamese address formats.
    return [house, village, ward, district, province].filter(Boolean).join(", ");
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-6 space-y-2">
        {/* 1. Họ và tên */}
        <InfoRow
          label="1. Họ và tên"
          value={<span className="font-bold uppercase">{(patient as any).fullName}</span>}
        />

        {/* 2. Sinh ngày & Tuổi */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
             <label className="text-sm text-gray-700 font-medium">2. Sinh ngày</label>
             <div className="flex items-center gap-4">
                 <span>{(patient as any).dob}</span>
                 <span className="text-gray-400">|</span>
                 <span className="text-gray-700">Tuổi: {(patient as any).age}</span>
             </div>
        </div>

        {/* 3. Giới tính */}
        <InfoRow label="3. Giới tính" value={patient.gender} />

        {/* 4. Nghề nghiệp & Mã nghề */}
         <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-700 font-medium">4. Nghề nghiệp</label>
            <div className="flex items-center gap-2">
                <Input
                    value={(patient as any).job}
                    onChange={(e) => handleChange("job", e.target.value)}
                    className="h-8 text-sm flex-1"
                    placeholder="Nhập nghề nghiệp..."
                    disabled={readOnly}
                />
                <Input 
                    value={(patient as any).jobCode || ""} 
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
                value={(patient as any).ethnicity} 
                readOnly
                className="h-8 text-sm w-full md:w-64 bg-gray-50 text-gray-900 pointer-events-none"
            />
        </div>

        {/* 6. Địa chỉ */}
        <div className="py-2 border-b border-gray-100 last:border-0">
          <label className="text-sm text-gray-700 font-medium">6. Địa chỉ</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="space-y-2">
              <Label className="text-xs text-gray-700 font-medium">Số nhà</Label>
              <Input
                value={(patient as any).houseNumber || ""}
                onChange={(e) => {
                  const houseNumber = e.target.value;
                  const next = buildFullAddress({
                    houseNumber,
                    village: (patient as any).village,
                    wardName: (patient as any).wardName,
                    districtName: (patient as any).districtName,
                    provinceName: (patient as any).provinceName,
                  });
                  setPatient({
                    ...(patient as any),
                    houseNumber,
                    address: next,
                  });
                }}
                className="h-9 text-sm"
                placeholder="Ví dụ: 12"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-700 font-medium">Thôn, phố</Label>
              <Input
                value={(patient as any).village || ""}
                onChange={(e) => {
                  const village = e.target.value;
                  const next = buildFullAddress({
                    houseNumber: (patient as any).houseNumber,
                    village,
                    wardName: (patient as any).wardName,
                    districtName: (patient as any).districtName,
                    provinceName: (patient as any).provinceName,
                  });
                  setPatient({
                    ...(patient as any),
                    village,
                    address: next,
                  });
                }}
                className="h-9 text-sm"
                placeholder="Ví dụ: Thôn/Phố ABC"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-700 font-medium">Xã, phường</Label>
              <Input
                value={(patient as any).wardName || ""}
                onChange={(e) => {
                  const wardName = e.target.value;
                  const next = buildFullAddress({
                    houseNumber: (patient as any).houseNumber,
                    village: (patient as any).village,
                    wardName,
                    districtName: (patient as any).districtName,
                    provinceName: (patient as any).provinceName,
                  });
                  setPatient({
                    ...(patient as any),
                    wardName,
                    address: next,
                  });
                }}
                className="h-9 text-sm"
                placeholder="Ví dụ: Phường XYZ"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-700 font-medium">Huyện(Q.Tx)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={(patient as any).districtCode ?? ""}
                  onChange={(e) => {
                    const districtCodeRaw = e.target.value;
                    const districtCode = districtCodeRaw === "" ? null : Number(districtCodeRaw);
                    const next = buildFullAddress({
                      houseNumber: (patient as any).houseNumber,
                      village: (patient as any).village,
                      wardName: (patient as any).wardName,
                      districtName: (patient as any).districtName,
                      provinceName: (patient as any).provinceName,
                    });
                    setPatient({
                      ...(patient as any),
                      districtCode,
                      address: next,
                    });
                  }}
                  className="h-9 w-24"
                  placeholder="Số"
                  disabled={readOnly}
                />
                <Input
                  value={(patient as any).districtName || ""}
                  onChange={(e) => {
                    const districtName = e.target.value;
                    const next = buildFullAddress({
                      houseNumber: (patient as any).houseNumber,
                      village: (patient as any).village,
                      wardName: (patient as any).wardName,
                      districtName,
                      provinceName: (patient as any).provinceName,
                    });
                    setPatient({
                      ...(patient as any),
                      districtName,
                      address: next,
                    });
                  }}
                  className="h-9 flex-1"
                  placeholder="Tên huyện"
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs text-gray-700 font-medium">Tỉnh, thành phố</Label>
              <div className="flex gap-2 items-start">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={(patient as any).provinceCode ?? ""}
                  onChange={(e) => {
                    const provinceCodeRaw = e.target.value;
                    const provinceCode = provinceCodeRaw === "" ? null : Number(provinceCodeRaw);
                    setPatient({
                      ...(patient as any),
                      provinceCode,
                    });
                  }}
                  className="h-9 w-24"
                  placeholder="Mã"
                  disabled={readOnly}
                />

                <Input
                  value={(patient as any).provinceName || ""}
                  onChange={(e) => {
                    const provinceName = e.target.value;
                    const next = buildFullAddress({
                      houseNumber: (patient as any).houseNumber,
                      village: (patient as any).village,
                      wardName: (patient as any).wardName,
                      districtName: (patient as any).districtName,
                      provinceName,
                    });
                    setPatient({
                      ...(patient as any),
                      provinceName,
                      address: next,
                    });
                  }}
                  className="h-9 text-sm flex-1"
                  placeholder="Ví dụ: TP.HCM"
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 7. Nơi làm việc */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-700 font-medium">7. Nơi làm việc</label>
            <Input
                value={(patient as any).workplace}
                onChange={(e) => handleChange("workplace", e.target.value)}
                className="h-8 text-sm bg-white"
                placeholder="Nhập nơi làm việc..."
                disabled={readOnly}
            />
        </div>

        {/* 8. Đối tượng */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-700 font-medium">8. Đối tượng</label>
            <Select value={(patient as any).subjectType} onValueChange={(val) => handleChange("subjectType", val)} disabled={readOnly}>
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

        {/* 9. BHYT */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-center">
            <label className="text-sm text-gray-700 font-medium">9. BHYT giá trị đến ngày</label>
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                 <Input 
                    type="date"
                    value={(patient as any).insuranceExpiry}
                    onChange={(e) => handleChange("insuranceExpiry", e.target.value)}
                    className="h-8 w-36 text-sm"
                    disabled={readOnly}
                />
                <div className="flex items-center gap-2 ml-2">
                    <span className="text-sm text-gray-700">Số thẻ BHYT:</span>
                    <Input 
                        value={(patient as any).insuranceNumber || ""} 
                        readOnly
                        className="h-8 w-48 text-sm bg-gray-50 text-gray-900 pointer-events-none"
                        placeholder="Số thẻ..."
                    />
                </div>
            </div>
        </div>

        {/* 10. Người nhà */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-2 border-b border-gray-100 last:border-0 items-start">
            <label className="text-sm text-gray-700 font-medium mt-2">10. Họ tên, địa chỉ người nhà</label>
            <div className="w-full space-y-2">
                <Textarea 
                    value={(patient as any).relativeInfo} 
                    onChange={(e) => handleChange("relativeInfo", e.target.value)}
                    className="min-h-[60px] text-sm"
                    placeholder="Họ tên, địa chỉ người nhà cần báo tin..."
                    disabled={readOnly}
                />
                 <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 w-24 flex-shrink-0">Điện thoại số:</span>
                    <Input 
                        value={(patient as any).relativePhone || ""} 
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