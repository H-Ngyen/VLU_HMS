import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Record, DischargeStatusInfo } from "@/types";

interface DischargeStatusProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
}

export const DischargeStatusSection = ({ formData, setFormData }: DischargeStatusProps) => {
  const handleDischargeStatusChange = (field: keyof DischargeStatusInfo, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        dischargeStatusInfo: { ...prev.dischargeStatusInfo, [field]: value },
      };
    });
  };

  const handleDeathStatusChange = (field: 'description' | 'cause' | 'time', value: string) => {
      setFormData((prev) => {
          if(!prev) return null;
          return {
              ...prev,
              dischargeStatusInfo: {
                  ...prev.dischargeStatusInfo,
                  deathStatus: {
                      ...prev.dischargeStatusInfo.deathStatus,
                      [field]: value
                  }
              }
          }
      })
  }

  const handleSubDiagnosisChange = (field: 'mainCauseOfDeath' | 'autopsyDiagnosis', subField: 'name' | 'code', value: string) => {
     setFormData((prev) => {
          if(!prev) return null;
          return {
              ...prev,
              dischargeStatusInfo: {
                  ...prev.dischargeStatusInfo,
                  [field]: {
                      ...prev.dischargeStatusInfo[field],
                      [subField]: value
                  }
              }
          }
      }) 
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-800">IV. TÌNH TRẠNG RA VIỆN</h3>
      </div>
      <div className="p-8 space-y-6">
        {/* 24. Kết quả điều trị */}
        <div className="space-y-2">
          <Label className="font-bold text-gray-700 block">24. Kết quả điều trị</Label>
          <RadioGroup
            value={formData.dischargeStatusInfo?.treatmentResult}
            onValueChange={(val) => handleDischargeStatusChange("treatmentResult", val)}
            className="flex gap-6 flex-wrap"
          >
            {[
              "1. Khỏi",
              "2. Đỡ, giảm",
              "3. Không thay đổi",
              "4. Nặng hơn",
              "5. Tử vong",
            ].map((opt) => (
              <div key={opt} className="flex items-center space-x-2">
                <RadioGroupItem value={opt} id={`tr-${opt}`} />
                <Label htmlFor={`tr-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* 25. Giải phẫu bệnh */}
        <div className="space-y-2">
          <Label className="font-bold text-gray-700 block">25. Giải phẫu bệnh</Label>
          <RadioGroup
            value={formData.dischargeStatusInfo?.pathology}
            onValueChange={(val) => handleDischargeStatusChange("pathology", val)}
            className="flex gap-6 flex-wrap"
          >
            {["1. Lành tính", "2. Nghi ngờ", "3. Ác tính"].map((opt) => (
              <div key={opt} className="flex items-center space-x-2">
                <RadioGroupItem value={opt} id={`path-${opt}`} />
                <Label htmlFor={`path-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* 26. Tình hình tử vong */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
          <Label className="font-bold text-gray-700 block">26. Tình hình tử vong</Label>
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Ghi chú về tình hình tử vong..."
              value={formData.dischargeStatusInfo?.deathStatus?.description || ""}
              onChange={(e) => handleDeathStatusChange('description', e.target.value)}
            />
            
            <div className="pt-2 border-t border-gray-100">
               <RadioGroup
                value={formData.dischargeStatusInfo?.deathStatus?.cause}
                onValueChange={(val) => handleDeathStatusChange('cause', val)}
                className="flex gap-6 flex-wrap"
              >
                {["1. Do bệnh", "2. Do tai biến điều trị", "3. Khác"].map((opt) => (
                  <div key={opt} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`dc-${opt}`} />
                    <Label htmlFor={`dc-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="pt-2 border-t border-gray-100">
               <RadioGroup
                value={formData.dischargeStatusInfo?.deathStatus?.time}
                onValueChange={(val) => handleDeathStatusChange('time', val)}
                className="flex gap-6 flex-wrap"
              >
                 {[
                    "1. Trong 24 giờ vào viện",
                    "2. Sau 24 giờ vào viện",
                  ].map((opt) => (
                  <div key={opt} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`dt-${opt}`} />
                    <Label htmlFor={`dt-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* 27. Nguyên nhân chính tử vong */}
        <div className="space-y-2">
          <Label className="font-bold text-gray-700 block">27. Nguyên nhân chính tử vong</Label>
          <div className="flex gap-4 items-start">
            <Textarea
              rows={2}
              className="flex-1 resize-y"
              value={formData.dischargeStatusInfo?.mainCauseOfDeath?.name || ""}
              onChange={(e) => handleSubDiagnosisChange('mainCauseOfDeath', 'name', e.target.value)}
            />
            <div className="w-32">
              <Input
                placeholder="Mã"
                value={formData.dischargeStatusInfo?.mainCauseOfDeath?.code || ""}
                onChange={(e) => handleSubDiagnosisChange('mainCauseOfDeath', 'code', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 28. Khám nghiệm tử thi */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
             <Checkbox 
                id="autopsy"
                checked={formData.dischargeStatusInfo?.isAutopsy || false}
                onCheckedChange={(c) => handleDischargeStatusChange("isAutopsy", c as boolean)}
            />
            <Label htmlFor="autopsy" className="font-bold text-gray-700 cursor-pointer">28. Khám nghiệm tử thi</Label>
          </div>
        </div>

        {/* 29. Chẩn đoán giải phẫu tử thi */}
        <div className="space-y-2">
          <Label className="font-bold text-gray-700 block">29. Chẩn đoán giải phẫu tử thi</Label>
          <div className="flex gap-4 items-start">
            <Textarea
              rows={2}
              className="flex-1 resize-y"
              value={formData.dischargeStatusInfo?.autopsyDiagnosis?.name || ""}
              onChange={(e) => handleSubDiagnosisChange('autopsyDiagnosis', 'name', e.target.value)}
            />
            <div className="w-32">
              <Input
                placeholder="Mã"
                value={formData.dischargeStatusInfo?.autopsyDiagnosis?.code || ""}
                onChange={(e) => handleSubDiagnosisChange('autopsyDiagnosis', 'code', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
