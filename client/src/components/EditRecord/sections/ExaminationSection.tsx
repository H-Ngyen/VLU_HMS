import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { Record } from "@/types";

interface ExaminationSectionProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
  readOnly?: boolean;
}

export const ExaminationSection = ({ formData, setFormData, readOnly = false }: ExaminationSectionProps) => {
  const content = formData.medicalRecordContent;

  const handleChange = (field: string, value: any) => {
    if (readOnly) return;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medicalRecordContent: {
          ...prev.medicalRecordContent,
          [field]: value,
        },
      };
    });
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    if (readOnly) return;
    setFormData((prev) => {
      if (!prev) return null;
      // @ts-ignore
      const parentObj = prev.medicalRecordContent[parent] || {};
      
      return {
        ...prev,
        medicalRecordContent: {
          ...prev.medicalRecordContent,
          [parent]: {
              ...parentObj,
              [field]: value
          }
        },
      };
    });
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
            <Label>1. Toàn thân</Label>
            <Textarea 
              value={content.overallExamination}
              onChange={(e) => handleChange("overallExamination", e.target.value)}
              className="min-h-[80px]"
              disabled={readOnly}
            />
        </div>
        
        <div className="space-y-4 border border-gray-100 rounded-lg p-4 bg-gray-50/30">
            <Label className="font-semibold text-blue-600">Dấu hiệu sinh tồn</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                    <Label className="text-xs">Mạch (lần/phút)</Label>
                    <Input 
                        value={content.vitalSigns?.pulse || ""}
                        onChange={(e) => handleNestedChange("vitalSigns", "pulse", e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Nhiệt độ (độ C)</Label>
                    <Input 
                        value={content.vitalSigns?.temperature || ""}
                        onChange={(e) => handleNestedChange("vitalSigns", "temperature", e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Huyết áp (mmHg)</Label>
                    <Input 
                        value={content.vitalSigns?.bloodPressure || ""}
                        onChange={(e) => handleNestedChange("vitalSigns", "bloodPressure", e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Nhịp thở (lần/phút)</Label>
                    <Input 
                        value={content.vitalSigns?.respiratoryRate || ""}
                        onChange={(e) => handleNestedChange("vitalSigns", "respiratoryRate", e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Cân nặng (kg)</Label>
                    <Input 
                        value={content.vitalSigns?.weight || ""}
                        onChange={(e) => handleNestedChange("vitalSigns", "weight", e.target.value)}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
        
        <div className="space-y-2">
            <Label>2. Các cơ quan</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Tuần hoàn</Label>
                      <Textarea 
                        className="h-20"
                        value={content.organs?.circulatory || ""}
                        onChange={(e) => handleNestedChange("organs", "circulatory", e.target.value)}
                        disabled={readOnly}
                      />
                </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Hô hấp</Label>
                      <Textarea 
                        className="h-20"
                        value={content.organs?.respiratory || ""}
                        onChange={(e) => handleNestedChange("organs", "respiratory", e.target.value)}
                        disabled={readOnly}
                      />
                </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Tiêu hóa</Label>
                      <Textarea 
                        className="h-20"
                        value={content.organs?.digestive || ""}
                        onChange={(e) => handleNestedChange("organs", "digestive", e.target.value)}
                        disabled={readOnly}
                      />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Thần kinh</Label>
                      <Textarea 
                        className="h-20"
                        value={content.organs?.neurological || ""}
                        onChange={(e) => handleNestedChange("organs", "neurological", e.target.value)}
                        disabled={readOnly}
                      />
                </div>
                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <Label className="text-xs text-gray-500">Các cơ quan khác</Label>
                      <Textarea 
                        className="h-20"
                        value={content.organs?.endocrineAndOthers || ""}
                        onChange={(e) => handleNestedChange("organs", "endocrineAndOthers", e.target.value)}
                        disabled={readOnly}
                      />
                </div>
            </div>
        </div>
        
          <div className="space-y-2">
            <Label>3. Các xét nghiệm cận lâm sàng đã làm</Label>
            <Textarea 
              value={content.clinicalTests}
              onChange={(e) => handleChange("clinicalTests", e.target.value)}
              className="min-h-[80px]"
              disabled={readOnly}
            />
        </div>
          <div className="space-y-2">
            <Label>4. Tóm tắt bệnh án</Label>
            <Textarea 
              value={content.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
              className="min-h-[100px]"
              disabled={readOnly}
            />
        </div>
      </CardContent>
    </Card>
  );
};
