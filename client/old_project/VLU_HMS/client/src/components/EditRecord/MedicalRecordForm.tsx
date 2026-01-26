import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Record, MedicalRecordContent, RelatedCharacteristics, VitalSigns, Organs } from "@/types";

interface MedicalRecordFormProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
}

export const MedicalRecordForm = ({ formData, setFormData }: MedicalRecordFormProps) => {
  const handleMedicalRecordChange = (field: keyof MedicalRecordContent, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medicalRecordContent: { ...prev.medicalRecordContent, [field]: value },
      };
    });
  };

  const handleCharacteristicChange = (key: keyof RelatedCharacteristics, field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medicalRecordContent: {
          ...prev.medicalRecordContent,
          relatedCharacteristics: {
            ...prev.medicalRecordContent.relatedCharacteristics,
            [key]: {
              ...prev.medicalRecordContent.relatedCharacteristics[key],
              [field]: value,
            },
          },
        },
      };
    });
  };

  const handleVitalSignsChange = (field: keyof VitalSigns, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medicalRecordContent: {
          ...prev.medicalRecordContent,
          vitalSigns: { ...prev.medicalRecordContent.vitalSigns, [field]: value },
        },
      };
    });
  };

  const handleOrgansChange = (field: keyof Organs, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medicalRecordContent: {
          ...prev.medicalRecordContent,
          organs: { ...prev.medicalRecordContent.organs, [field]: value },
        },
      };
    });
  };
  
  const handleAdmissionDiagnosisChange = (field: 'mainDisease' | 'comorbidities' | 'differential', value: string) => {
      setFormData((prev) => {
          if (!prev) return null;
          return {
              ...prev,
              medicalRecordContent: {
                  ...prev.medicalRecordContent,
                  admissionDiagnosis: {
                      ...prev.medicalRecordContent.admissionDiagnosis,
                      [field]: value
                  }
              }
          }
      })
  }

  const characteristicsList = [
    { key: "allergy", label: "Dị ứng" },
    { key: "drugs", label: "Ma túy" },
    { key: "alcohol", label: "Rượu bia" },
    { key: "tobacco", label: "Thuốc lá" },
    { key: "pipeTobacco", label: "Thuốc lào" },
    { key: "other", label: "Khác" },
  ];

  const organFields = [
    { key: "circulatory", label: "+ Tuần hoàn" },
    { key: "respiratory", label: "+ Hô hấp" },
    { key: "digestive", label: "+ Tiêu hóa" },
    { key: "kidneyUrology", label: "+ Thận - Tiết niệu - Sinh dục" },
    { key: "neurological", label: "+ Thần kinh" },
    { key: "musculoskeletal", label: "+ Cơ - Xương - Khớp" },
    { key: "ent", label: "+ Tai - Mũi - Họng" },
    { key: "maxillofacial", label: "+ Răng - Hàm - Mặt" },
    { key: "eye", label: "+ Mắt" },
    {
      key: "endocrineAndOthers",
      label: "+ Nội tiết, dinh dưỡng và các bệnh lý khác",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-800">A. BỆNH ÁN</h3>
      </div>

      <div className="p-8 space-y-8">
        {/* I. Lý do vào viện */}
        <div>
          <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">I. Lý do vào viện</h4>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label className="mb-1 block">Lý do</Label>
              <Input
                value={formData.medicalRecordContent?.reason || ""}
                onChange={(e) => handleMedicalRecordChange("reason", e.target.value)}
                placeholder="Nhập lý do vào viện"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Vào ngày thứ</span>
              <Input
                className="w-20 text-center"
                value={formData.medicalRecordContent?.dayOfIllness || ""}
                onChange={(e) => handleMedicalRecordChange("dayOfIllness", e.target.value)}
              />
              <span className="text-gray-700">của bệnh</span>
            </div>
          </div>
        </div>

        {/* II. Hỏi bệnh */}
        <div>
          <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">II. Hỏi bệnh</h4>
          <div className="mb-6">
            <Label className="font-bold text-gray-700 mb-2 block">1. Quá trình bệnh lý</Label>
            <Textarea
              rows={4}
              className="resize-y"
              value={formData.medicalRecordContent?.pathologicalProcess || ""}
              onChange={(e) => handleMedicalRecordChange("pathologicalProcess", e.target.value)}
            />
          </div>
          <div className="mb-6">
            <Label className="font-bold text-gray-700 mb-4 block">2. Tiền sử bệnh</Label>
            <div className="ml-4 mb-6">
              <Label className="font-semibold text-gray-700 mb-1 block">+ Bản thân</Label>
              <Textarea
                rows={4}
                className="resize-y"
                value={formData.medicalRecordContent?.personalHistory || ""}
                onChange={(e) => handleMedicalRecordChange("personalHistory", e.target.value)}
              />
            </div>
            <div className="ml-4 mb-6">
              <Label className="font-semibold text-gray-700 mb-3 block">- Đặc điểm liên quan đến bệnh</Label>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">TT</th>
                    <th className="border p-2">Ký hiệu</th>
                    <th className="border p-2">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {characteristicsList.map((item, index) => {
                    const data = formData.medicalRecordContent?.relatedCharacteristics?.[item.key] || {
                      isChecked: false,
                      time: "",
                    };
                    return (
                      <tr key={item.key}>
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                                id={`char-${item.key}`}
                                checked={data.isChecked || false}
                                onCheckedChange={(c) => handleCharacteristicChange(item.key as keyof RelatedCharacteristics, "isChecked", c as boolean)}
                            />
                            <Label htmlFor={`char-${item.key}`} className="font-normal cursor-pointer w-24">{item.label}</Label>
                          </div>
                        </td>
                        <td className="border p-2">
                          <Input
                            className="h-8"
                            value={data.time || ""}
                            onChange={(e) => handleCharacteristicChange(item.key as keyof RelatedCharacteristics, "time", e.target.value)}
                            disabled={!data.isChecked}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="ml-4">
              <Label className="font-semibold text-gray-700 mb-1 block">+ Gia đình</Label>
              <Textarea
                rows={4}
                className="resize-y"
                value={formData.medicalRecordContent?.familyHistory || ""}
                onChange={(e) => handleMedicalRecordChange("familyHistory", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* III. Khám bệnh */}
        <div>
          <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">III. Khám bệnh</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="font-bold text-gray-700 mb-2 block">1. Toàn thân</Label>
              <Textarea
                rows={8}
                className="resize-y"
                value={formData.medicalRecordContent?.overallExamination || ""}
                onChange={(e) => handleMedicalRecordChange("overallExamination", e.target.value)}
              />
            </div>
            <div>
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  {[
                    { f: "pulse", l: "Mạch", u: "lần/ph" },
                    { f: "temperature", l: "Nhiệt độ", u: "°C" },
                    { f: "bloodPressure", l: "Huyết áp", u: "mmHg" },
                    { f: "respiratoryRate", l: "Nhịp thở", u: "lần/ph" },
                    { f: "weight", l: "Cân nặng", u: "kg" },
                  ].map((v) => (
                    <tr key={v.f}>
                      <td className="border p-2 bg-gray-50">{v.l}</td>
                      <td className="border p-2">
                        <Input
                          className="text-center h-8"
                          value={formData.medicalRecordContent?.vitalSigns?.[v.f as keyof VitalSigns] || ""}
                          onChange={(e) => handleVitalSignsChange(v.f as keyof VitalSigns, e.target.value)}
                        />
                      </td>
                      <td className="border p-2 text-right">{v.u}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <Label className="font-bold text-gray-700 mb-4 block">2. Các cơ quan</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {organFields.map((field) => (
                <div key={field.key} className="flex flex-col">
                  <Label className="font-semibold text-gray-700 mb-1">{field.label}</Label>
                  <Textarea
                    rows={2}
                    className="resize-y"
                    value={formData.medicalRecordContent?.organs?.[field.key as keyof Organs] || ""}
                    onChange={(e) => handleOrgansChange(field.key as keyof Organs, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <Label className="font-bold text-gray-700 mb-2 block">3. Các xét nghiệm lâm sàng cần làm</Label>
            <Textarea
              rows={3}
              className="resize-y"
              value={formData.medicalRecordContent?.clinicalTests || ""}
              onChange={(e) => handleMedicalRecordChange("clinicalTests", e.target.value)}
            />
          </div>

          <div className="mb-6">
            <Label className="font-bold text-gray-700 mb-2 block">4. Tóm tắt bệnh án</Label>
            <Textarea
              rows={4}
              className="resize-y"
              value={formData.medicalRecordContent?.summary || ""}
              onChange={(e) => handleMedicalRecordChange("summary", e.target.value)}
            />
          </div>
        </div>

        {/* IV. Chẩn đoán khi vào khoa điều trị */}
        <div>
          <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">IV. Chẩn đoán khi vào khoa điều trị</h4>
          <div className="space-y-4">
            <div>
              <Label className="font-semibold text-gray-700 mb-1 block">+ Bệnh chính</Label>
              <Textarea
                rows={2}
                className="resize-y"
                value={formData.medicalRecordContent?.admissionDiagnosis?.mainDisease || ""}
                onChange={(e) => handleAdmissionDiagnosisChange('mainDisease', e.target.value)}
              />
            </div>
            <div>
              <Label className="font-semibold text-gray-700 mb-1 block">+ Bệnh kèm theo (nếu có)</Label>
              <Input
                value={formData.medicalRecordContent?.admissionDiagnosis?.comorbidities || ""}
                onChange={(e) => handleAdmissionDiagnosisChange('comorbidities', e.target.value)}
              />
            </div>
            <div>
              <Label className="font-semibold text-gray-700 mb-1 block">+ Phân biệt</Label>
              <Input
                value={formData.medicalRecordContent?.admissionDiagnosis?.differential || ""}
                onChange={(e) => handleAdmissionDiagnosisChange('differential', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* V. Tiên lượng */}
        <div>
          <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">V. Tiên lượng</h4>
          <Input
            value={formData.medicalRecordContent?.prognosis || ""}
            onChange={(e) => handleMedicalRecordChange("prognosis", e.target.value)}
          />
        </div>

        {/* VI. Hướng điều trị */}
        <div>
          <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">VI. Hướng điều trị</h4>
          <Textarea
            rows={3}
            className="resize-y"
            value={formData.medicalRecordContent?.treatmentPlan || ""}
            onChange={(e) => handleMedicalRecordChange("treatmentPlan", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
