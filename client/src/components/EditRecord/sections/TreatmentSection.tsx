import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Record } from "@/types";

interface TreatmentSectionProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
  readOnly?: boolean;
}

export const TreatmentSection = ({ formData, setFormData, readOnly = false }: TreatmentSectionProps) => {
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
            <Label>Tiên lượng</Label>
            <Textarea 
              value={content.prognosis}
              onChange={(e) => handleChange("prognosis", e.target.value)}
              className="min-h-[60px]"
              disabled={readOnly}
            />
        </div>
        <div className="space-y-2">
            <Label>Hướng điều trị</Label>
            <Textarea 
              value={content.treatmentPlan}
              onChange={(e) => handleChange("treatmentPlan", e.target.value)}
              className="min-h-[80px]"
              disabled={readOnly}
            />
        </div>
      </CardContent>
    </Card>
  );
};
