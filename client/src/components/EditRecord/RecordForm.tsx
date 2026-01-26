import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Save, Plus, FileText, User, Activity, LogOut, ClipboardList, Thermometer, Pill, ChevronDown, ChevronRight, Stethoscope, Download as DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Record, Patient } from "@/types";

import { AdministrativeSection } from "./sections/AdministrativeSection";
import { PatientManagementSection } from "./sections/PatientManagementSection";
import { DiagnosisSection } from "./sections/DiagnosisSection";
import { DischargeStatusSection } from "./sections/DischargeStatusSection";
import { MedicalHistorySection } from "./sections/MedicalHistorySection";
import { ExaminationSection } from "./sections/ExaminationSection";
import { TreatmentSection } from "./sections/TreatmentSection";
import { DocumentSection } from "./sections/DocumentSection";

interface RecordFormProps {
  record?: Record;
  patient: Patient;
  mode: "create" | "edit";
  initialType?: "internal" | "surgery";
  onSubmit: (data: Record) => void;
  onCancel: () => void;
  readOnly?: boolean;
}

const createInitialRecord = (patient: Patient, type: "internal" | "surgery" = "internal"): Record => {
  const departmentName = type === "surgery" ? "Ngoại Khoa" : "Nội Khoa";
  return {
    id: `REC${Date.now()}`,
    patientId: patient.id,
    patientName: patient.fullName,
    age: patient.age,
    dob: patient.dob,
    gender: patient.gender,
    admissionDate: new Date().toISOString().split("T")[0],
    dischargeDate: "",
    department: departmentName,
    type: type,
    documents: [],
    managementData: {
      admissionTime: "",
      admissionType: "KKB",
      referralSource: "Tự đến",
      admissionCount: 1,
      hospitalTransfer: { type: "", destination: "" },
      dischargeType: "",
      totalDays: 0,
      transfers: [{ department: departmentName, date: new Date().toISOString().split("T")[0], time: "", days: 0 }],
    },
    diagnosisInfo: {
      transferDiagnosis: { name: "", code: "" },
      kkbDiagnosis: { name: "", code: "" },
      deptDiagnosis: { name: "", code: "", isSurgery: type === "surgery", isProcedure: false },
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
      vitalSigns: { pulse: "", temperature: "", bloodPressure: "", respiratoryRate: "", weight: "" },
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
      admissionDiagnosis: { mainDisease: "", comorbidities: "", differential: "" },
      prognosis: "",
      treatmentPlan: "",
    },
  };
};

const prepareRecordData = (record: Record): Record => {
  let transfers = record.managementData?.transfers || [];
  if (transfers.length === 0) {
    transfers = [{ department: record.department || "", date: record.admissionDate || "", time: "", days: 0 }];
  }
  const initializedData: Record = {
    ...record,
    managementData: { ...record.managementData, transfers: transfers },
    diagnosisInfo: record.diagnosisInfo || {
      transferDiagnosis: { name: "", code: "" },
      kkbDiagnosis: { name: "", code: "" },
      deptDiagnosis: { name: "", code: "", isSurgery: false, isProcedure: false },
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
    medicalRecordContent: { ...record.medicalRecordContent },
  };
  if (record.medicalRecordContent?.vitalSigns) {
    initializedData.medicalRecordContent.vitalSigns = { ...initializedData.medicalRecordContent.vitalSigns, ...record.medicalRecordContent.vitalSigns };
  }
  if (record.medicalRecordContent?.organs) {
    initializedData.medicalRecordContent.organs = { ...initializedData.medicalRecordContent.organs, ...record.medicalRecordContent.organs };
  }
  return initializedData;
};

interface SectionItem {
  id: string;
  label: string;
  icon: any;
  subSections?: SectionItem[];
}

const FORM_SECTIONS: SectionItem[] = [
  { id: "administrative", label: "I. Hành Chính", icon: User },
  { id: "management", label: "II. Quản Lý Người Bệnh", icon: LogOut },
  { id: "diagnosis", label: "III. Chẩn Đoán", icon: Activity },
  { id: "discharge", label: "IV. Tình Trạng Ra Viện", icon: FileText },
  {
    id: "medical_record_group",
    label: "A. Bệnh Án",
    icon: ClipboardList,
    subSections: [
      { id: "history", label: "1. Bệnh Sử & Tiền Sử", icon: ClipboardList },
      { id: "examination", label: "2. Khám Bệnh", icon: Thermometer },
      { id: "treatment", label: "3. Tiên Lượng & Điều Trị", icon: Pill },
    ],
  },
];

// Helper to flatten sections for navigation
const getFlattenedSections = () => {
  const flattened: { id: string; label: string }[] = [];
  FORM_SECTIONS.forEach((section) => {
    if (section.subSections) {
      section.subSections.forEach((sub) => {
        flattened.push({ id: sub.id, label: sub.label });
      });
    } else {
      flattened.push({ id: section.id, label: section.label });
    }
  });
  return flattened;
};

export const RecordForm = ({ record, patient, mode, initialType = "internal", onSubmit, onCancel, readOnly = false }: RecordFormProps) => {
  const [formData, setFormData] = useState<Record | null>(null);
  const [editablePatient, setEditablePatient] = useState<Patient>(patient);
  const [activeTab, setActiveTab] = useState("details"); // 'details' or 'documents'
  
  // Initialize with the first section
  const [activeSection, setActiveSection] = useState("administrative");
  
  // State for collapsible sidebar group
  const [isMedicalGroupOpen, setIsMedicalGroupOpen] = useState(true);

  useEffect(() => {
    if (mode === "create" && patient) {
      setFormData(createInitialRecord(patient, initialType));
      setEditablePatient(patient);
    } else if (mode === "edit" && record) {
      setFormData(prepareRecordData(record));
      // In edit mode, we might want to update patient info from record if it was stored there, 
      // but currently record only has patientId. We assume patient prop is up to date or passed correctly.
      setEditablePatient(patient); 
    }
  }, [mode, record, patient, initialType]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (formData && !readOnly) {
      // In a real app, we would also submit editablePatient to update patient details
      onSubmit(formData);
    }
  };

  if (!formData) return null;

  const isCreate = mode === "create";
  const typeLabel = (formData?.type || initialType) === "surgery" ? "Ngoại Khoa" : "Nội Khoa";
  const flattenedSections = getFlattenedSections();
  const currentSectionIndex = flattenedSections.findIndex((s) => s.id === activeSection);

  const handleNextSection = () => {
    if (currentSectionIndex < flattenedSections.length - 1) {
      const nextId = flattenedSections[currentSectionIndex + 1].id;
      setActiveSection(nextId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Auto-open group if navigating into it
      if (["history", "examination", "treatment"].includes(nextId)) {
        setIsMedicalGroupOpen(true);
      }
    } else {
      setActiveTab("documents");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      const prevId = flattenedSections[currentSectionIndex - 1].id;
      setActiveSection(prevId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Auto-open group if navigating into it
       if (["history", "examination", "treatment"].includes(prevId)) {
        setIsMedicalGroupOpen(true);
      }
    }
  };

  const pageTitle = readOnly 
    ? "Chi Tiết Hồ Sơ Bệnh Án"
    : isCreate ? "Tạo Hồ Sơ Bệnh Án Mới" : "Chỉnh Sửa Hồ Sơ Bệnh Án";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex-none flex items-center justify-between mb-2 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {pageTitle}
            <span className="text-gray-400 font-light">|</span>
            <span className="text-vlu-red">{typeLabel}</span>
          </h1>
          <p className="text-gray-500">
            {isCreate ? `Bệnh nhân: ${patient.fullName}` : `Mã hồ sơ: ${record?.id}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>{readOnly ? "Quay lại" : "Hủy bỏ"}</Button>
          {readOnly && (
            <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <DownloadIcon size={18} />
              Xuất PDF
            </Button>
          )}
          {!readOnly && (
            <Button type="button" onClick={() => handleSubmit()} className="bg-vlu-red hover:bg-red-800 text-white min-w-[120px]">
                {isCreate ? <Plus size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
                {isCreate ? "Tạo Hồ Sơ" : "Lưu Thay Đổi"}
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 lg:w-[600px] flex-none">
          <TabsTrigger value="details">Thông Tin Chi Tiết</TabsTrigger>
          <TabsTrigger value="documents">Tài Liệu Đính Kèm</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6 animate-in fade-in slide-in-from-bottom-2 flex-1 overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 items-start h-full">
            {/* Sidebar */}
            <div className="w-full lg:w-72 flex-shrink-0 space-y-1 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {FORM_SECTIONS.map((section) => {
                const Icon = section.icon;
                
                if (section.subSections) {
                  const isChildActive = section.subSections.some(sub => sub.id === activeSection);
                  
                  return (
                    <Collapsible
                      key={section.id}
                      open={isMedicalGroupOpen}
                      onOpenChange={setIsMedicalGroupOpen}
                      className="space-y-1"
                    >
                      <CollapsibleTrigger asChild>
                         <Button
                          type="button"
                          variant="ghost"
                          className={`w-full justify-between text-left h-auto py-3 px-4 rounded-lg font-bold transition-all ${
                            isChildActive ? "text-vlu-red bg-red-50" : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center">
                            <Icon size={18} className="mr-3" />
                            {section.label}
                          </div>
                          {isMedicalGroupOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 space-y-1">
                        {section.subSections.map((sub) => {
                           const isSubActive = activeSection === sub.id;
                           return (
                             <Button
                              key={sub.id}
                              type="button"
                              variant="ghost"
                              onClick={() => { setActiveSection(sub.id); }}
                              className={`w-full justify-start text-left h-auto py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                                isSubActive 
                                  ? "bg-vlu-red text-white hover:bg-red-800 shadow-sm" 
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              }`}
                            >
                              <span className="mr-2 opacity-70">•</span>
                              {sub.label}
                            </Button>
                           );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }

                const isActive = activeSection === section.id;
                return (
                  <Button
                    key={section.id}
                    type="button"
                    variant="ghost"
                    onClick={() => { setActiveSection(section.id); }}
                    className={`w-full justify-start text-left h-auto py-3 px-4 rounded-lg font-medium transition-all ${
                      isActive ? "bg-vlu-red text-white hover:bg-red-800 shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                    }`}
                  >
                    <Icon size={18} className={`mr-3 ${isActive ? "text-white" : "text-gray-500"}`} />
                    {section.label}
                  </Button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full min-w-0 h-full overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-full flex flex-col">
                 <div className="flex-1">
                    {activeSection === "administrative" && <AdministrativeSection patient={editablePatient} setPatient={setEditablePatient} readOnly={readOnly} />}
                    {activeSection === "management" && <PatientManagementSection formData={formData} setFormData={setFormData} readOnly={readOnly} />}
                    {activeSection === "diagnosis" && <DiagnosisSection formData={formData} setFormData={setFormData} readOnly={readOnly} />}
                    {activeSection === "discharge" && <DischargeStatusSection formData={formData} setFormData={setFormData} readOnly={readOnly} />}
                    
                    {activeSection === "history" && <MedicalHistorySection formData={formData} setFormData={setFormData} readOnly={readOnly} />}
                    {activeSection === "examination" && <ExaminationSection formData={formData} setFormData={setFormData} readOnly={readOnly} />}
                    {activeSection === "treatment" && <TreatmentSection formData={formData} setFormData={setFormData} readOnly={readOnly} />}
                 </div>
              
                  {/* Navigation Footer */}
                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200 pb-10">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handlePrevSection} 
                      disabled={currentSectionIndex === 0} 
                      className={currentSectionIndex === 0 ? "opacity-0 pointer-events-none" : ""}
                    >
                      <ArrowLeft size={16} className="mr-2" /> Quay lại
                    </Button>
                    
                    <Button type="button" onClick={handleNextSection} className="bg-black hover:bg-gray-800 text-white">
                      {currentSectionIndex < flattenedSections.length - 1 
                        ? `Tiếp tục: ${flattenedSections[currentSectionIndex + 1].label.replace(/^[IV0-9]+\.\s/, "")}` 
                        : "Tiếp tục: Tài Liệu Đính Kèm"}
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6 animate-in fade-in slide-in-from-bottom-2 flex-1 overflow-hidden">
             <div className="h-full overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-10">
                <DocumentSection formData={formData} setFormData={setFormData} readOnly={readOnly} />
                
                <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                    <Button type="button" variant="outline" onClick={() => { setActiveTab("details"); setActiveSection("treatment"); }}>
                      <ArrowLeft size={16} className="mr-2" /> Quay lại: Chi Tiết Bệnh Án
                    </Button>
                    {!readOnly && (
                        <Button type="button" onClick={() => handleSubmit()} className="bg-vlu-red hover:bg-red-800 text-white min-w-[150px]">
                            {isCreate ? <Plus size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
                            {isCreate ? "Hoàn tất & Tạo" : "Lưu Thay Đổi"}
                        </Button>
                    )}
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};