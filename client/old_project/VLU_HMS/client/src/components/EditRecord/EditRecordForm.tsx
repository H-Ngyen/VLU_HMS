import { useState, useEffect, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Record } from "@/types";
import { AdministrativeSection } from "./AdministrativeSection";
import { PatientManagementSection } from "./PatientManagementSection";
import { DiagnosisSection } from "./DiagnosisSection";
import { DischargeStatusSection } from "./DischargeStatusSection";
import { MedicalRecordForm } from "./MedicalRecordForm";

// Helper function to prepare initial data (ensuring deep structure)
const prepareRecordData = (record: Record | undefined): Record | null => {
  if (!record) return null;

  let transfers = record.managementData?.transfers || [];
  if (transfers.length === 0) {
    transfers = [
      {
        department: record.department || "",
        date: record.admissionDate || "",
        time: "",
        days: 0,
      },
    ];
  }

  const initializedData: Record = {
    ...record,
    managementData: {
      ...record.managementData,
      transfers: transfers,
    },
    diagnosisInfo: record.diagnosisInfo || {
      transferDiagnosis: { name: "", code: "" },
      kkbDiagnosis: { name: "", code: "" },
      deptDiagnosis: {
        name: "",
        code: "",
        isSurgery: false,
        isProcedure: false,
      },
      dischargeDiagnosis: {
        mainDisease: { name: "", code: "" },
        comorbidities: { name: "", code: "" },
        isAccident: false,
        isComplication: false,
      },
    },
    dischargeStatusInfo: record.dischargeStatusInfo || {
      treatmentResult: "",
      pathology: "",
      deathStatus: { description: "", cause: "", time: "" },
      mainCauseOfDeath: { name: "", code: "" },
      isAutopsy: false,
      autopsyDiagnosis: { name: "", code: "" },
    },
    medicalRecordContent: {
      ...record.medicalRecordContent,
    },
  };

  // Deep merge to ensure optional nested objects exist
  if (record.medicalRecordContent?.relatedCharacteristics) {
    initializedData.medicalRecordContent.relatedCharacteristics = {
      ...initializedData.medicalRecordContent.relatedCharacteristics,
      ...record.medicalRecordContent.relatedCharacteristics,
    };
  }
  if (record.medicalRecordContent?.vitalSigns) {
    initializedData.medicalRecordContent.vitalSigns = {
      ...initializedData.medicalRecordContent.vitalSigns,
      ...record.medicalRecordContent.vitalSigns,
    };
  }
  if (record.medicalRecordContent?.organs) {
    initializedData.medicalRecordContent.organs = {
      ...initializedData.medicalRecordContent.organs,
      ...record.medicalRecordContent.organs,
    };
  }
  if (record.medicalRecordContent?.admissionDiagnosis) {
    initializedData.medicalRecordContent.admissionDiagnosis = {
      ...initializedData.medicalRecordContent.admissionDiagnosis,
      ...record.medicalRecordContent.admissionDiagnosis,
    };
  }

  return initializedData;
};

export const EditRecordForm = () => {
  const { records, patients, updateRecord } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const recordToEdit = records.find((r) => r.id === id);
  const patient = recordToEdit
    ? patients.find((p) => p.id === recordToEdit.patientId)
    : null;

  const initialFormData = useMemo(() => prepareRecordData(recordToEdit), [recordToEdit]);
  const [formData, setFormData] = useState<Record | null>(initialFormData);

  const [step, setStep] = useState(1);
  const [lastStepChange, setLastStepChange] = useState(0);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      setLastStepChange(Date.now());
      return;
    }

    if (Date.now() - lastStepChange < 500) return;

    if (formData) {
      updateRecord(formData);
      alert("Cập nhật hồ sơ bệnh án thành công!");
      navigate("/repository");
    }
  };

  if (!recordToEdit) return <div className="p-8 text-center">Hồ sơ không tồn tại</div>;
  if (!formData) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => (step === 1 ? navigate("/repository") : setStep(1))}
            className="mr-4 h-10 w-10 p-0 rounded-lg border-gray-300 text-gray-500 hover:text-vlu-red hover:border-vlu-red hover:bg-white"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chỉnh Sửa Hồ Sơ Bệnh Án
            </h1>
            <p className="text-gray-500 text-sm">
              Mã hồ sơ: {id} - Trang {step}/2
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <>
            {patient ? (
              <AdministrativeSection patient={patient} />
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-xs font-semibold text-orange-600 uppercase mb-1">
                      Họ tên
                    </Label>
                    <Input
                      readOnly
                      value={formData.patientName}
                      className="bg-white border-orange-100 font-medium"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-semibold text-orange-600 uppercase mb-1">
                      Mã BN
                    </Label>
                    <Input
                      readOnly
                      value={formData.patientId || "N/A"}
                      className="bg-white border-orange-100 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <PatientManagementSection
              formData={formData}
              setFormData={setFormData}
            />
            <DiagnosisSection formData={formData} setFormData={setFormData} />
            <DischargeStatusSection
              formData={formData}
              setFormData={setFormData}
            />
          </>
        )}

        {step === 2 && (
          <MedicalRecordForm formData={formData} setFormData={setFormData} />
        )}

        <div className="flex justify-end gap-4 mt-6">
          {step === 2 && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(1)}
              className="px-6 py-6 font-bold flex items-center bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              <ArrowLeft size={20} className="mr-2" /> Quay lại
            </Button>
          )}
          {step === 1 ? (
            <Button
              type="button"
              onClick={() => {
                setStep(2);
                setLastStepChange(Date.now());
              }}
              className="px-8 py-6 bg-vlu-red text-white hover:bg-red-700 font-bold flex items-center"
            >
              Tiếp tục <ArrowRight size={20} className="ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="px-8 py-6 bg-yellow-500 text-white hover:bg-yellow-600 font-bold flex items-center"
            >
              <Save size={20} className="mr-2" /> Lưu Thay Đổi
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
