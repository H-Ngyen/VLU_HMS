import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Record, DiagnosisInfo } from "@/types";

interface DiagnosisSectionProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
}

export const DiagnosisSection = ({ formData, setFormData }: DiagnosisSectionProps) => {
  const handleDiagnosisChange = (section: keyof DiagnosisInfo, field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        diagnosisInfo: {
          ...prev.diagnosisInfo,
          [section]: { ...prev.diagnosisInfo[section], [field]: value },
        },
      };
    });
  };

  // Helper for deep nested updates
  const handleDischargeDiagnosisChange = (field: 'mainDisease' | 'comorbidities', subField: 'name' | 'code', value: string) => {
      setFormData((prev) => {
          if(!prev) return null;
          return {
              ...prev,
              diagnosisInfo: {
                  ...prev.diagnosisInfo,
                  dischargeDiagnosis: {
                      ...prev.diagnosisInfo.dischargeDiagnosis,
                      [field]: {
                          ...prev.diagnosisInfo.dischargeDiagnosis[field],
                          [subField]: value
                      }
                  }
              }
          }
      })
  }
  
  const handleDischargeDiagnosisBoolChange = (field: 'isAccident' | 'isComplication', value: boolean) => {
      setFormData((prev) => {
          if(!prev) return null;
          return {
              ...prev,
              diagnosisInfo: {
                  ...prev.diagnosisInfo,
                  dischargeDiagnosis: {
                      ...prev.diagnosisInfo.dischargeDiagnosis,
                      [field]: value
                  }
              }
          }
      })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-800">III. CHẨN ĐOÁN</h3>
      </div>
      <div className="p-8 space-y-6">
        {/* 20. Nơi chuyển đến */}
        <div className="space-y-2">
          <Label className="font-bold text-gray-700 block">20. Nơi chuyển đến</Label>
          <div className="flex gap-4 items-start">
            <Textarea
              rows={2}
              className="flex-1 resize-y"
              value={formData.diagnosisInfo?.transferDiagnosis?.name || ""}
              onChange={(e) => handleDiagnosisChange("transferDiagnosis", "name", e.target.value)}
            />
            <div className="w-32">
              <Input
                placeholder="Mã"
                value={formData.diagnosisInfo?.transferDiagnosis?.code || ""}
                onChange={(e) => handleDiagnosisChange("transferDiagnosis", "code", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 21. KKB, Cấp cứu */}
        <div className="space-y-2">
          <Label className="font-bold text-gray-700 block">21. KKB, Cấp cứu</Label>
          <div className="flex gap-4 items-start">
            <Textarea
              rows={2}
              className="flex-1 resize-y"
              value={formData.diagnosisInfo?.kkbDiagnosis?.name || ""}
              onChange={(e) => handleDiagnosisChange("kkbDiagnosis", "name", e.target.value)}
            />
            <div className="w-32">
              <Input
                placeholder="Mã"
                value={formData.diagnosisInfo?.kkbDiagnosis?.code || ""}
                onChange={(e) => handleDiagnosisChange("kkbDiagnosis", "code", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 22. Khi vào khoa điều trị */}
        <div className="space-y-2">
          <Label className="font-bold text-gray-700 block">22. Khi vào khoa điều trị</Label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <Textarea
                rows={2}
                className="w-full mb-2 resize-y"
                value={formData.diagnosisInfo?.deptDiagnosis?.name || ""}
                onChange={(e) => handleDiagnosisChange("deptDiagnosis", "name", e.target.value)}
              />
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="proc"
                    checked={formData.diagnosisInfo?.deptDiagnosis?.isProcedure || false}
                    onCheckedChange={(checked) => handleDiagnosisChange("deptDiagnosis", "isProcedure", checked)}
                  />
                  <Label htmlFor="proc" className="font-normal cursor-pointer">Thủ thuật</Label>
                </div>
                <div className="flex items-center space-x-2">
                   <Checkbox 
                    id="surg"
                    checked={formData.diagnosisInfo?.deptDiagnosis?.isSurgery || false}
                    onCheckedChange={(checked) => handleDiagnosisChange("deptDiagnosis", "isSurgery", checked)}
                  />
                  <Label htmlFor="surg" className="font-normal cursor-pointer">Phẫu thuật</Label>
                </div>
              </div>
            </div>
            <div className="w-32">
              <Input
                placeholder="Mã"
                value={formData.diagnosisInfo?.deptDiagnosis?.code || ""}
                onChange={(e) => handleDiagnosisChange("deptDiagnosis", "code", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 23. Ra Viện */}
        <div className="space-y-4">
          <Label className="font-bold text-gray-700 block">23. Ra Viện</Label>
          <div className="space-y-2">
            <Label className="text-xs text-gray-500 mb-1 font-medium">+ Bệnh chính</Label>
            <div className="flex gap-4 items-start">
              <Textarea
                rows={2}
                className="flex-1 resize-y"
                value={formData.diagnosisInfo?.dischargeDiagnosis?.mainDisease?.name || ""}
                onChange={(e) => handleDischargeDiagnosisChange('mainDisease', 'name', e.target.value)}
              />
              <div className="w-32">
                <Input
                  placeholder="Mã"
                  value={formData.diagnosisInfo?.dischargeDiagnosis?.mainDisease?.code || ""}
                  onChange={(e) => handleDischargeDiagnosisChange('mainDisease', 'code', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-500 mb-1 font-medium">+ Bệnh kèm theo</Label>
            <div className="flex gap-4 items-start">
              <Textarea
                rows={2}
                className="flex-1 resize-y"
                value={formData.diagnosisInfo?.dischargeDiagnosis?.comorbidities?.name || ""}
                onChange={(e) => handleDischargeDiagnosisChange('comorbidities', 'name', e.target.value)}
              />
              <div className="w-32">
                 <Input
                  placeholder="Mã"
                  value={formData.diagnosisInfo?.dischargeDiagnosis?.comorbidities?.code || ""}
                  onChange={(e) => handleDischargeDiagnosisChange('comorbidities', 'code', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="acc" 
                checked={formData.diagnosisInfo?.dischargeDiagnosis?.isAccident || false}
                onCheckedChange={(c) => handleDischargeDiagnosisBoolChange('isAccident', c as boolean)}
              />
              <Label htmlFor="acc" className="font-normal cursor-pointer">Tai biến</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="comp"
                checked={formData.diagnosisInfo?.dischargeDiagnosis?.isComplication || false}
                onCheckedChange={(c) => handleDischargeDiagnosisBoolChange('isComplication', c as boolean)}
              />
              <Label htmlFor="comp" className="font-normal cursor-pointer">Biến chứng</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
