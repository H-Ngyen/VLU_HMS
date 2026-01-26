import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Record } from "@/types";

interface MedicalHistorySectionProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
  readOnly?: boolean;
}

export const MedicalHistorySection = ({ formData, setFormData, readOnly = false }: MedicalHistorySectionProps) => {
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

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label>1. Lý do vào viện</Label>
          <Textarea 
            value={content.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            className="min-h-[60px]"
            disabled={readOnly}
          />
        </div>
        
        <div className="space-y-2">
          <Label>2. Hỏi bệnh (Quá trình bệnh lý)</Label>
          <Textarea 
            value={content.pathologicalProcess}
            onChange={(e) => handleChange("pathologicalProcess", e.target.value)}
            className="min-h-[100px]"
            disabled={readOnly}
          />
        </div>
        
        <div className="space-y-2">
          <Label>3. Tiền sử bệnh</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Bản thân</Label>
                <Textarea 
                    value={content.personalHistory}
                    onChange={(e) => handleChange("personalHistory", e.target.value)}
                    className="min-h-[80px]"
                    disabled={readOnly}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Gia đình</Label>
                <Textarea 
                    value={content.familyHistory}
                    onChange={(e) => handleChange("familyHistory", e.target.value)}
                    className="min-h-[80px]"
                    disabled={readOnly}
                />
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
