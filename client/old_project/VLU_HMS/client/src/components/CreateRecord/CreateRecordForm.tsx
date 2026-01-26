import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Record, Patient } from "@/types";
import { AdministrativeSection } from "./AdministrativeSection";
import { PatientManagementSection } from "./PatientManagementSection";
import { DiagnosisSection } from "./DiagnosisSection";
import { DischargeStatusSection } from "./DischargeStatusSection";
import { MedicalRecordForm } from "./MedicalRecordForm";

const createInitialRecord = (patient: Patient): Record => {
  return {
    id: `REC${Date.now()}`,
    patientId: patient.id,
    patientName: patient.fullName,
    age: patient.age,
    dob: patient.dob,
    gender: patient.gender,
    admissionDate: new Date().toISOString().split("T")[0],
    dischargeDate: "",
    department: "Nội Hô Hấp",
    type: "internal",
    documents: [],
    managementData: {
      admissionTime: "",
      admissionType: "KKB",
      referralSource: "Tự đến",
      admissionCount: 1,
      hospitalTransfer: { type: "", destination: "" },
      dischargeType: "",
      totalDays: 0,
      transfers: [
        {
          department: "Nội Hô Hấp",
          date: new Date().toISOString().split("T")[0],
          time: "",
          days: 0,
        },
      ],
    },
    diagnosisInfo: {
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
    dischargeStatusInfo: {
      treatmentResult: "",
      pathology: "",
      deathStatus: { description: "", cause: "", time: "" },
      mainCauseOfDeath: { name: "", code: "" },
      isAutopsy: false,
      autopsyDiagnosis: { name: "", code: "" },
    },
    medicalRecordContent: {
      reason: "",
      dayOfIllness: "",
      pathologicalProcess: "",
      personalHistory: "",
      familyHistory: "",
      relatedCharacteristics: {
        allergy: { isChecked: false, time: "" },
        drugs: { isChecked: false, time: "" },
        alcohol: { isChecked: false, time: "" },
        tobacco: { isChecked: false, time: "" },
        pipeTobacco: { isChecked: false, time: "" },
        other: { isChecked: false, time: "" },
      },
      overallExamination: "",
      vitalSigns: {
        pulse: "",
        temperature: "",
        bloodPressure: "",
        respiratoryRate: "",
        weight: "",
      },
      organs: {
        circulatory: "",
        respiratory: "",
        digestive: "",
        kidneyUrology: "",
        neurological: "",
        musculoskeletal: "",
        ent: "",
        maxillofacial: "",
        eye: "",
        endocrineAndOthers: "",
      },
      clinicalTests: "",
      summary: "",
      admissionDiagnosis: {
        mainDisease: "",
        comorbidities: "",
        differential: "",
      },
      prognosis: "",
      treatmentPlan: "",
    },
  };
};

export const CreateRecordForm = () => {
  const { addRecord, patients } = useApp();
  const navigate = useNavigate();
  const { patientId } = useParams();

  const patient = patients.find((p) => p.id === patientId);

  // Initialize formData only if patient exists
  const [formData, setFormData] = useState<Record | null>(() => {
    if (patient) return createInitialRecord(patient);
    return null;
  });

  const [step, setStep] = useState(1);
  const [lastStepChange, setLastStepChange] = useState(0);

  // Scroll to top on step change
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
      addRecord(formData);
      alert("Tạo hồ sơ bệnh án thành công!");
      navigate("/repository");
    }
  };

  if (!patient) return <div className="p-8 text-center">Bệnh nhân không tồn tại</div>;
  if (!formData) return <div className="p-8 text-center">Đang khởi tạo...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() =>
              step === 1 ? navigate("/patient-management") : setStep(1)
            }
            className="mr-4 h-10 w-10 p-0 rounded-lg border-gray-300 text-gray-500 hover:text-vlu-red hover:border-vlu-red hover:bg-white"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Tạo Hồ Sơ Bệnh Án Mới
            </h1>
            <p className="text-gray-500 text-sm">
              Bệnh nhân: {patient.fullName} - Trang {step}/2
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <>
            <AdministrativeSection patient={patient} />
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
                window.scrollTo({ top: 0, behavior: "smooth" });
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
              <Save size={20} className="mr-2" /> Tạo Hồ Sơ
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};