import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Circle, Download as DownloadIcon, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface HematologyStatusLog {
  status: number;
  departmentName: string;
  updatedByName: string;
  createdAt: string;
}

export interface HematologyData {
  id?: number;
  status: number;
  hematologyStatusLogs: HematologyStatusLog[];

  healthDept: string;
  hospital: string;
  testNumber: string;
  isEmergency: boolean;
  
  patientName: string;
  age: string;
  gender: string;
  address: string;
  insuranceCard1: string;
  insuranceCard2: string;
  insuranceCard3: string;
  insuranceCard4: string;
  insuranceCard5: string;
  department: string;
  room: string;
  bed: string;
  diagnosis: string;
  
  // Checkboxes
  check_rbc: boolean; check_hgb: boolean; check_hct: boolean; check_mcv: boolean; check_mch: boolean; check_mchc: boolean; check_nrbc: boolean; check_reticulocytes: boolean;
  check_wbc: boolean; check_neutrophils: boolean; check_eosinophils: boolean; check_basophils: boolean; check_monocytes: boolean; check_lymphocytes: boolean; check_abnormalCells: boolean;
  check_plt: boolean; check_esr: boolean; check_malaria: boolean;
  check_bleedingTime: boolean; check_clottingTime: boolean;
  check_bloodGroupABO: boolean; check_bloodGroupRh: boolean;

  // 1. Tế bào máu ngoại vi
  rbc: string; hgb: string; hct: string; mcv: string; mch: string; mchc: string; nrbc: string; reticulocytes: string;
  wbc: string; neutrophils: string; eosinophils: string; basophils: string; monocytes: string; lymphocytes: string; abnormalCells: string;
  plt: string; esr1: string; esr2: string; malaria: string;
  bleedingTime: string; clottingTime: string;
  bloodGroupABO: string; bloodGroupRh: string;

  doctor: string;
  diagnosis: string;
  requestTime: string;
  requestDateDay: string;
  requestDateMonth: string;
  requestDateYear: string;
  resultTime: string;
  resultDateDay: string;
  resultDateMonth: string;
  resultDateYear: string;
  }
interface HematologyInputFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File, formData?: HematologyData) => void;
  defaultPatientName?: string;
  defaultAge?: number;
  defaultDob?: string;
  defaultGender?: string;
  defaultAddress?: string;
  initialData?: HematologyData;
  readOnly?: boolean;
  recordId?: number;
}

const parseDate = (dateStr?: string) => {
  if (!dateStr) return null;
  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date;
  const parts = dateStr.split(/[\/\-]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
        date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } else {
        date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
    if (!isNaN(date.getTime())) return date;
  }
  return null;
};

const calculateAgeAtDate = (dobString?: string, refDateString?: string) => {
  const dob = parseDate(dobString);
  const ref = parseDate(refDateString);
  if (!dob || !ref) return "";
  let age = ref.getFullYear() - dob.getFullYear();
  const m = ref.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < dob.getDate())) {
    age--;
  }
  return age < 0 ? "0" : age.toString();
};

const STEPS = [
  "Chưa nhận mẫu",
  "Đã nhận mẫu",
  "Đang chạy",
  "Đã có kết quả"
];

export const HematologyInputForm = ({ 
  isOpen, 
  onClose, 
  onSave,
  defaultPatientName = "",
  defaultAge,
  defaultDob = "",
  defaultGender = "",
  defaultAddress = "",
  initialData,
  readOnly = false,
  recordId
}: HematologyInputFormProps) => {
  const { currentUser } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);
  
  const defaultState: HematologyData = {
    id: undefined,
    status: 0,
    hematologyStatusLogs: [],

    healthDept: "",
    hospital: "",
    testNumber: "",
    isEmergency: false,
    
    patientName: "",
    age: "",
    gender: "",
    address: "",
    insuranceCard1: "",
    insuranceCard2: "",
    insuranceCard3: "",
    insuranceCard4: "",
    insuranceCard5: "",
    department: "",
    room: "",
    bed: "",
    diagnosis: "",
    
    // Checkboxes
    check_rbc: false, check_hgb: false, check_hct: false, check_mcv: false, check_mch: false, check_mchc: false, check_nrbc: false, check_reticulocytes: false,
    check_wbc: false, check_neutrophils: false, check_eosinophils: false, check_basophils: false, check_monocytes: false, check_lymphocytes: false, check_abnormalCells: false,
    check_plt: false, check_esr: false, check_malaria: false,
    check_bleedingTime: false, check_clottingTime: false,
    check_bloodGroupABO: false, check_bloodGroupRh: false,

    // 1. Tế bào máu ngoại vi
    rbc: "", hgb: "", hct: "", mcv: "", mch: "", mchc: "", nrbc: "", reticulocytes: "",
    wbc: "", neutrophils: "", eosinophils: "", basophils: "", monocytes: "", lymphocytes: "", abnormalCells: "",
    plt: "", esr1: "", esr2: "", malaria: "",
    bleedingTime: "", clottingTime: "",
    bloodGroupABO: "", bloodGroupRh: "",

    doctor: "",
    technician: "",
    requestTime: "",
    requestDateDay: new Date().getDate().toString(),
    requestDateMonth: (new Date().getMonth() + 1).toString(),
    requestDateYear: new Date().getFullYear().toString(),
    resultTime: "",
    resultDateDay: new Date().getDate().toString(),
    resultDateMonth: (new Date().getMonth() + 1).toString(),
    resultDateYear: new Date().getFullYear().toString(),
  };

  const [formData, setFormData] = useState<HematologyData>(defaultState);
  const [isDeptDialogOpen, setIsDeptDialogOpen] = useState(false);
  const [departmentInput, setDepartmentInput] = useState("");
  const [targetAction, setTargetAction] = useState<"SAVE" | "NEXT" | "PDF" | "FAST_TRACK" | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getRequestDateString = (data: HematologyData) => {
    const year = data.requestDateYear || new Date().getFullYear().toString();
    const month = (data.requestDateMonth || "1").padStart(2, '0');
    const day = (data.requestDateDay || "1").padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const generateAndOpenPDF = async (dataToSave: HematologyData) => {
    if (!printRef.current) return;
    try {
        const canvas = await html2canvas(printRef.current, {
            scale: 2, 
            useCORS: true,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
                const styles = clonedDoc.getElementsByTagName('style');
                for (let i = styles.length - 1; i >= 0; i--) styles[i].remove();
                const links = clonedDoc.getElementsByTagName('link');
                for (let i = links.length - 1; i >= 0; i--) {
                    if (links[i].rel === 'stylesheet') links[i].remove();
                }
                const root = clonedDoc.documentElement;
                root.style.setProperty('--background', 'white');
                root.style.setProperty('--foreground', 'black');
                root.style.setProperty('--primary', 'black');
            }
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
        
        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    } catch (error) {
        console.error("Error viewing PDF:", error);
        toast.error("Không thể tạo bản xem trước PDF");
    }
  };

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            const data: HematologyData = {
                ...defaultState,
                ...initialData,
                patientName: defaultPatientName,
                gender: defaultGender,
                address: defaultAddress,
                status: initialData.status !== undefined ? initialData.status : 0,
                hematologyStatusLogs: initialData.hematologyStatusLogs || []
            };
            const calculatedAge = calculateAgeAtDate(defaultDob, getRequestDateString(data));
            data.age = (calculatedAge === "" && defaultAge && defaultAge > 0) ? defaultAge.toString() : calculatedAge;
            setFormData(data);

            if (readOnly) {
                setIsGenerating(true);
                setTimeout(async () => {
                    await generateAndOpenPDF(data);
                    setIsGenerating(false);
                    onClose();
                }, 800);
            }
        } else {
            const data: HematologyData = {
                ...defaultState,
                patientName: defaultPatientName,
                gender: defaultGender,
                address: defaultAddress,
                doctor: currentUser?.name || ""
            };
            const calculatedAge = calculateAgeAtDate(defaultDob, getRequestDateString(data));
            data.age = (calculatedAge === "" && defaultAge && defaultAge > 0) ? defaultAge.toString() : calculatedAge;
            setFormData(data);
        }
    }
  }, [isOpen, initialData, defaultPatientName, defaultAge, defaultDob, defaultGender, defaultAddress, currentUser, readOnly]);

  useEffect(() => {
    if (isOpen && defaultDob && !readOnly) {
        const newAge = calculateAgeAtDate(defaultDob, getRequestDateString(formData));
        if (newAge !== "" && newAge !== formData.age) {
            setFormData(prev => ({ ...prev, age: newAge }));
        }
    }
  }, [formData.requestDateDay, formData.requestDateMonth, formData.requestDateYear, defaultDob, isOpen, readOnly]);

  useEffect(() => {
    if (!readOnly && formData.status === 2 && !formData.technician && currentUser?.name) {
        setFormData(prev => ({ ...prev, technician: currentUser.name }));
    }
  }, [formData.status, currentUser, readOnly]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCheckboxChange = (checked: boolean) => {
      setFormData(prev => ({ ...prev, isEmergency: checked }));
  }

  const validateForm = (action: "SAVE" | "NEXT" | "FAST_TRACK") => {
    if (!formData.diagnosis?.trim()) {
        toast.error("Vui lòng nhập 'Chẩn đoán'.");
        return false;
    }
    if (!formData.requestDateYear?.trim()) {
        toast.error("Vui lòng nhập 'Năm' của ngày yêu cầu.");
        return false;
    }
    if (action === "NEXT" && formData.status === 2) {
        const requiredResults = [
            { field: 'rbc', label: 'Số lượng HC' },
            { field: 'wbc', label: 'Số lượng BC' },
            { field: 'hgb', label: 'Huyết sắc tố' },
            { field: 'hct', label: 'Hematocrit' },
            { field: 'bloodGroupABO', label: 'Nhóm máu hệ ABO' },
            { field: 'bloodGroupRh', label: 'Nhóm máu hệ Rh' },
            { field: 'resultDateYear', label: 'Năm trả kết quả' }
        ];
        for (const item of requiredResults) {
            const val = (formData as any)[item.field];
            if (!val?.toString().trim()) {
                toast.error(`Vui lòng điền '${item.label}' để hoàn thành phiếu.`);
                return false;
            }
        }
    }
    return true;
  };

  const handleActionClick = (action: "SAVE" | "NEXT" | "PDF" | "FAST_TRACK") => {
    if (action !== "PDF" && !validateForm(action)) return;
    setTargetAction(action);
    if (action === "PDF") {
      handleGeneratePDF(formData);
      return;
    }
    setDepartmentInput("");
    setIsDeptDialogOpen(true);
  };

  const handleConfirmDepartment = async () => {
    setIsDeptDialogOpen(false);
    if (!recordId) {
        toast.error("Vui lòng lưu hồ sơ bệnh án trước.");
        return;
    }

    try {
        let currentHematologyId = formData.id;
        const requestedAt = getRequestDateString(formData);
        
        if (!currentHematologyId) {
            const createPayload = {
                departmentName: departmentInput,
                requestDescription: formData.diagnosis || "Yêu cầu xét nghiệm Huyết học",
                requestedAt: requestedAt
            };
            const newIdStr = await api.hematologies.create(recordId, createPayload);
            currentHematologyId = parseInt(newIdStr, 10);
            if (!isNaN(currentHematologyId)) {
                setFormData(prev => ({ ...prev, id: currentHematologyId }));
            }
        }

        let newStatus = formData.status;
        let newLogs: HematologyStatusLog[] = [];

        if (targetAction === "NEXT") {
            newStatus = Math.min(formData.status + 1, 3);
            if (newStatus === 1 || newStatus === 2) {
                 if (currentHematologyId) {
                     await api.hematologies.changeStatus(recordId, currentHematologyId, { status: newStatus, departmentName: departmentInput });
                 }
            } else if (newStatus === 3) {
                 if (currentHematologyId) {
                     const resYear = formData.resultDateYear || "";
                     const resMonth = formData.resultDateMonth || "";
                     const resDay = formData.resultDateDay || "";
                     const completedAt = resYear && resMonth && resDay ? `${resYear}-${resMonth.padStart(2, '0')}-${resDay.padStart(2, '0')}` : new Date().toISOString().split('T')[0];
                     
                     const completePayload = {
                         completedAt: completedAt,
                         redBloodCellCount: formData.rbc ? parseFloat(formData.rbc) : null,
                         whiteBloodCellCount: formData.wbc ? parseFloat(formData.wbc) : null,
                         hemoglobin: formData.hgb ? parseFloat(formData.hgb) : null,
                         hematocrit: formData.hct ? parseFloat(formData.hct) : null,
                         mcv: formData.mcv ? parseFloat(formData.mcv) : null,
                         mch: formData.mch ? parseFloat(formData.mch) : null,
                         mchc: formData.mchc ? parseFloat(formData.mchc) : null,
                         reticulocyteCount: formData.reticulocytes ? parseFloat(formData.reticulocytes) : null,
                         plateletCount: formData.plt ? parseFloat(formData.plt) : null,
                         neutrophil: formData.neutrophils ? parseFloat(formData.neutrophils) : null,
                         eosinophil: formData.eosinophils ? parseFloat(formData.eosinophils) : null,
                         basophil: formData.basophils ? parseFloat(formData.basophils) : null,
                         monocyte: formData.monocytes ? parseFloat(formData.monocytes) : null,
                         lymphocyte: formData.lymphocytes ? parseFloat(formData.lymphocytes) : null,
                         nucleatedRedBloodCell: formData.nrbc || null,
                         abnormalCells: formData.abnormalCells || null,
                         malariaParasite: formData.malaria || null,
                         esr1h: formData.esr1 ? parseFloat(formData.esr1) : null,
                         esr2h: formData.esr2 ? parseFloat(formData.esr2) : null,
                         bleedingTime: formData.bleedingTime ? parseInt(formData.bleedingTime, 10) : null,
                         clottingTime: formData.clottingTime ? parseInt(formData.clottingTime, 10) : null,
                         bloodTypeAbo: formData.bloodGroupABO === "A" ? 1 : formData.bloodGroupABO === "B" ? 2 : formData.bloodGroupABO === "AB" ? 3 : formData.bloodGroupABO === "O" ? 4 : undefined,
                         bloodTypeRh: formData.bloodGroupRh === "+" ? 1 : formData.bloodGroupRh === "-" ? 2 : undefined
                     };

                     await api.hematologies.complete(recordId, currentHematologyId, completePayload);
                     await api.hematologies.changeStatus(recordId, currentHematologyId, { status: 3, departmentName: departmentInput });
                 }
            }
            newLogs.push({ status: newStatus, departmentName: departmentInput, updatedByName: currentUser?.name || "Người dùng", createdAt: new Date().toISOString() });
        } else if (targetAction === "FAST_TRACK") {
            if (currentHematologyId) {
                await api.hematologies.changeStatus(recordId, currentHematologyId, { status: 1, departmentName: departmentInput });
                await api.hematologies.changeStatus(recordId, currentHematologyId, { status: 2, departmentName: departmentInput });
                newStatus = 2;
                newLogs.push({ status: 1, departmentName: departmentInput, updatedByName: currentUser?.name || "Người dùng", createdAt: new Date().toISOString() });
                newLogs.push({ status: 2, departmentName: departmentInput, updatedByName: currentUser?.name || "Người dùng", createdAt: new Date().toISOString() });
            }
        }

        setFormData(prev => prev ? ({ ...prev, status: newStatus, hematologyStatusLogs: [...(prev.hematologyStatusLogs || []), ...newLogs] }) : null);
        toast.success(`Cập nhật thành công`);
        setTimeout(() => { window.location.search = "?tab=forms"; }, 1000);
    } catch (error: unknown) {
        console.error(error);
        const message = error instanceof Error ? error.message : "Lỗi đồng bộ server.";
        toast.error(message);
    }
  };

  const handleGeneratePDF = async (dataToSave: HematologyData) => {
    if (!printRef.current) return;
    try {
        const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff', onclone: (clonedDoc) => {
            const root = clonedDoc.documentElement;
            root.style.setProperty('--background', 'white');
            root.style.setProperty('--foreground', 'black');
            root.style.setProperty('--primary', 'black');
        }});
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
        pdf.save(`XNHuyetHoc_${dataToSave.patientName}.pdf`);
    } catch (error) { console.error(error); }
  };

  const isRequestReadOnly = readOnly || formData.status > 0 || !!initialData;
  const showResultSection = formData.status >= 2;
  const isResultReadOnly = readOnly || formData.status === 3;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] !max-w-none max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Phiếu Xét Nghiệm Huyết Học</DialogTitle>
          <DialogDescription>Xem hoặc nhập kết quả xét nghiệm huyết học</DialogDescription>
        </DialogHeader>
        
        {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-vlu-red" />
                <p className="text-lg font-medium text-gray-600">Đang chuẩn bị bản in PDF...</p>
            </div>
        ) : (
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between mb-8 px-8 relative mt-2 print:hidden">
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
            <div className="absolute left-10 top-1/2 -translate-y-1/2 h-1 bg-vlu-red z-0 transition-all duration-300" style={{ width: `calc(${(formData.status / 3) * 100}% - 40px)` }}></div>
            {STEPS.map((step, index) => {
              const isActive = formData.status >= index;
              const logForStep = formData.hematologyStatusLogs?.find(l => l.status === index);
              return (
                <div key={index} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'bg-vlu-red border-vlu-red text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                    {isActive ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col items-center">
                      <span className={`text-xs font-medium ${isActive ? 'text-vlu-red' : 'text-gray-500'}`}>{step}</span>
                      {logForStep && (
                          <div className="text-[10px] text-gray-400 text-center mt-1 w-24 leading-tight">
                              <p className="font-semibold text-gray-500 truncate">{logForStep.updatedByName}</p>
                              <p>{new Date(logForStep.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 items-start border-b pb-4">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Label className="w-20 shrink-0">Sở Y tế:</Label>
                <Input name="healthDept" value={formData.healthDept} onChange={handleChange} className="h-7 border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" disabled={isRequestReadOnly} />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-20 shrink-0">Bệnh viện:</Label>
                <Input name="hospital" value={formData.hospital} onChange={handleChange} className="h-7 border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" disabled={isRequestReadOnly} />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-sm font-bold uppercase">Phiếu xét nghiệm</h2>
              <h3 className="text-base font-bold uppercase text-vlu-red">Huyết học</h3>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold">MS: 17/BV-02</p>
              <div className="flex items-center justify-end gap-2">
                <Label className="shrink-0">Số:</Label>
                <Input name="testNumber" value={formData.testNumber} onChange={handleChange} className="w-24 h-7 border-b border-t-0 border-x-0 rounded-none text-right focus-visible:ring-0" disabled={isRequestReadOnly} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-start gap-8 text-sm pl-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="normal" checked={!formData.isEmergency} onCheckedChange={() => handleCheckboxChange(false)} disabled={isRequestReadOnly} />
                <label htmlFor="normal" className="font-medium">Thường</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="emergency" checked={formData.isEmergency} onCheckedChange={() => handleCheckboxChange(true)} disabled={isRequestReadOnly} />
                <label htmlFor="emergency" className="font-medium">Cấp cứu</label>
              </div>
          </div>

          <div className="space-y-3 border border-gray-300 rounded-sm p-4 bg-gray-50/20 text-sm">
             <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 flex items-end gap-2 min-w-[200px]">
                <Label className="shrink-0">Họ tên người bệnh:</Label>
                <Input name="patientName" value={formData.patientName} className="border-b border-t-0 border-x-0 rounded-none px-0 font-bold uppercase" disabled={true} />
              </div>
              <div className="w-24 flex items-end gap-2">
                <Label className="shrink-0">Tuổi:</Label>
                <Input name="age" value={formData.age} className="border-b border-t-0 border-x-0 rounded-none px-0" disabled={true} />
              </div>
              <div className="w-32 flex items-end gap-2">
                <Label className="shrink-0">Nam/Nữ:</Label>
                <Input name="gender" value={formData.gender} className="border-b border-t-0 border-x-0 rounded-none px-0" disabled={true} />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 flex items-end gap-2">
                    <Label className="shrink-0">Địa chỉ:</Label>
                    <Input name="address" value={formData.address} className="border-b border-t-0 border-x-0 rounded-none px-0" disabled={true} />
                </div>
                <div className="flex-1 flex items-end gap-2">
                    <Label className="shrink-0">Số thẻ BHYT:</Label>
                    <div className="flex flex-1 items-end">
                        <Input name="insuranceCard1" value={formData.insuranceCard1} onChange={handleChange} className="w-12 text-center" disabled={isRequestReadOnly} />
                        <Input name="insuranceCard2" value={formData.insuranceCard2} onChange={handleChange} className="w-12 text-center" disabled={isRequestReadOnly} />
                        <Input name="insuranceCard3" value={formData.insuranceCard3} onChange={handleChange} className="w-12 text-center" disabled={isRequestReadOnly} />
                        <Input name="insuranceCard4" value={formData.insuranceCard4} onChange={handleChange} className="w-12 text-center" disabled={isRequestReadOnly} />
                        <Input name="insuranceCard5" value={formData.insuranceCard5} onChange={handleChange} className="flex-1 text-center" disabled={isRequestReadOnly} />
                    </div>
                </div>
            </div>
             <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 flex items-end gap-2">
                <Label className="shrink-0">Khoa:</Label>
                <Input name="department" value={formData.department} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0" disabled={isRequestReadOnly} />
              </div>
              <div className="w-32 flex items-end gap-2">
                <Label className="shrink-0">Buồng:</Label>
                <Input name="room" value={formData.room} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0" disabled={isRequestReadOnly} />
              </div>
              <div className="w-32 flex items-end gap-2">
                <Label className="shrink-0">Giường:</Label>
                <Input name="bed" value={formData.bed} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0" disabled={isRequestReadOnly} />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <Label className="shrink-0">Chẩn đoán: <span className="text-red-500">*</span></Label>
              <Input name="diagnosis" value={formData.diagnosis} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0" disabled={isRequestReadOnly} />
            </div>
            <div className="flex justify-end pt-4 italic text-xs">
                  <div className="text-center w-1/3">
                      <div className="flex justify-center gap-1 mb-2">
                          <Input name="requestTime" value={formData.requestTime} onChange={handleChange} className="w-8 h-5 text-center border-b p-0" placeholder="..." disabled={isRequestReadOnly} />
                          <span>Giờ ........ ngày</span>
                          <Input name="requestDateDay" value={formData.requestDateDay} onChange={handleChange} className="w-8 h-5 text-center border-b" disabled={isRequestReadOnly} />
                          <span>tháng</span>
                          <Input name="requestDateMonth" value={formData.requestDateMonth} onChange={handleChange} className="w-8 h-5 text-center border-b" disabled={isRequestReadOnly} />
                          <span>năm <span className="text-red-500">*</span></span>
                          <Input name="requestDateYear" value={formData.requestDateYear} onChange={handleChange} className="w-12 h-5 text-center border-b" disabled={isRequestReadOnly} />
                      </div>
                      <p className="font-bold uppercase not-italic">Bác sĩ điều trị</p>
                      <div className="pt-12">
                          <Input name="doctor" value={formData.doctor} onChange={handleChange} placeholder="Họ tên bác sĩ" className="text-center border-b border-t-0 border-x-0 font-bold uppercase h-7 px-0" disabled={isRequestReadOnly} />
                      </div>
                  </div>
            </div>
          </div>

          <div className="relative">
              {!showResultSection && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
                      <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-gray-500 border border-gray-200">
                          {formData.status === 0 ? "Chưa nhận mẫu xét nghiệm" : "Đã nhận mẫu. Chuyển sang 'Đang chạy' để nhập KQ."}
                      </div>
                  </div>
              )}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-200 rounded-lg p-4 bg-gray-50/10 ${!showResultSection ? 'opacity-30 pointer-events-none' : ''}`}>
                <div className="col-span-full border-b pb-2 flex justify-between items-center"><Label className="font-bold text-base">Kết quả xét nghiệm</Label></div>
                <div className="space-y-4">
                    <h4 className="font-bold">1. Tế bào máu ngoại vi:</h4>
                    <div className="border border-gray-300 rounded p-4 space-y-3 bg-white text-xs">
                        {[
                            { label: "Số lượng HC", sub: "nam (4,0-5,8); nữ (3,9-5,4 x10^12/l)", name: "rbc", check: "check_rbc", r: true },
                            { label: "Huyết sắc tố", sub: "nam (140-160); nữ (125-145 g/l)", name: "hgb", check: "check_hgb", r: true },
                            { label: "Hematocrit", sub: "nam (0,38-0,50); nữ (0,35-0,47 l/l)", name: "hct", check: "check_hct", r: true },
                            { label: "MCV", sub: "(83-92 fl)", name: "mcv", check: "check_mcv" },
                            { label: "MCH", sub: "(27-32 pg)", name: "mch", check: "check_mch" },
                            { label: "MCHC", sub: "(320-356 g/l)", name: "mchc", check: "check_mchc" },
                            { label: "Hồng cầu có nhân", sub: "(0 x 10^9/l)", name: "nrbc", check: "check_nrbc" },
                            { label: "Hồng cầu lưới", sub: "(0,1-0,5 %)", name: "reticulocytes", check: "check_reticulocytes" },
                        ].map(item => (
                            <div key={item.name} className="grid grid-cols-3 gap-2 items-center">
                                <div className="col-span-2 flex items-start gap-2">
                                    <Checkbox checked={(formData as any)[item.check]} onCheckedChange={(c) => handleCheckChange(item.check, c as boolean)} disabled={isRequestReadOnly} />
                                    <div><p className="font-medium">{item.label} {item.r && <span className="text-red-500">*</span>}</p><p className="text-[10px] text-gray-500 italic">{item.sub}</p></div>
                                </div>
                                <Input name={item.name} value={(formData as any)[item.name]} onChange={handleChange} className="h-7 text-center font-bold" disabled={isResultReadOnly} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold invisible">.</h4>
                    <div className="border border-gray-300 rounded p-4 space-y-3 bg-white text-xs">
                        <div className="grid grid-cols-3 gap-2 items-center">
                            <div className="col-span-2 flex items-start gap-2">
                                <Checkbox checked={formData.check_wbc} onCheckedChange={(c) => handleCheckChange("check_wbc", c as boolean)} disabled={isRequestReadOnly} />
                                <div><p className="font-medium">Số lượng BC <span className="text-red-500">*</span></p><p className="text-[10px] text-gray-500 italic">(4-10 x 10^9/l)</p></div>
                            </div>
                            <Input name="wbc" value={formData.wbc} onChange={handleChange} className="h-7 text-center font-bold" disabled={isResultReadOnly} />
                        </div>
                        <div className="pl-6 space-y-2 text-xs">
                            <p className="font-medium italic text-gray-600">Thành phần bạch cầu (%):</p>
                            {[ { label: "- Đoạn trung tính", name: "neutrophils" }, { label: "- Đoạn ưa a xít", name: "eosinophils" }, { label: "- Đoạn ưa ba zơ", name: "basophils" }, { label: "- Mono", name: "monocytes" }, { label: "- Lympho", name: "lymphocytes" }, { label: "- Tế bào bất thường", name: "abnormalCells" } ].map(item => (
                                <div key={item.name} className="grid grid-cols-3 gap-2 items-center"><span className="col-span-2 pl-2">{item.label}</span><Input name={item.name} value={(formData as any)[item.name]} onChange={handleChange} className="h-6 text-center font-bold" disabled={isResultReadOnly} /></div>
                            ))}
                        </div>
                        {[ { label: "Số lượng tiểu cầu", sub: "(150-400 x10^9/l)", name: "plt", check: "check_plt" }, { label: "KSV sốt rét", sub: "", name: "malaria", check: "check_malaria" } ].map(item => (
                            <div key={item.name} className="grid grid-cols-3 gap-2 items-center">
                                <div className="col-span-2 flex items-start gap-2">
                                    <Checkbox checked={(formData as any)[item.check]} onCheckedChange={(c) => handleCheckChange(item.check, c as boolean)} disabled={isRequestReadOnly} />
                                    <div><p className="font-medium">{item.label}</p>{item.sub && <p className="text-[10px] text-gray-500 italic">{item.sub}</p>}</div>
                                </div>
                                <Input name={item.name} value={(formData as any)[item.name]} onChange={handleChange} className="h-7 text-center font-bold" disabled={isResultReadOnly} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-full grid grid-cols-2 gap-8 text-xs">
                    <div className="border border-gray-300 rounded p-4 space-y-2 bg-white">
                        <h4 className="font-bold underline">2. Đông máu:</h4>
                        {[ {l:"Máu chảy:", n:"bleedingTime", c:"check_bleedingTime"}, {l:"Máu đông:", n:"clottingTime", c:"check_clottingTime"} ].map(i => (
                            <div key={i.n} className="flex items-center gap-2"><Checkbox checked={(formData as any)[i.c]} onCheckedChange={(c) => handleCheckChange(i.c, c as boolean)} disabled={isRequestReadOnly} /><span>{i.l}</span><Input name={i.n} value={(formData as any)[i.n]} onChange={handleChange} className="w-16 h-6 text-center font-bold" disabled={isResultReadOnly} /><span>phút</span></div>
                        ))}
                    </div>
                    <div className="border border-gray-300 rounded p-4 space-y-2 bg-white">
                        <h4 className="font-bold underline">3. Nhóm máu:</h4>
                        {[ {l:"Hệ ABO:", n:"bloodGroupABO", c:"check_bloodGroupABO", p:"A, B, AB, O", r:true}, {l:"Hệ Rh:", n:"bloodGroupRh", c:"check_bloodGroupRh", p:"+ / -", r:true} ].map(i => (
                            <div key={i.n} className="flex items-center gap-2"><Checkbox checked={(formData as any)[i.c]} onCheckedChange={(c) => handleCheckChange(i.c, c as boolean)} disabled={isRequestReadOnly} /><span>{i.l} {i.r && <span className="text-red-500">*</span>}</span><Input name={i.n} value={(formData as any)[i.n]} onChange={handleChange} className="w-20 h-6 text-center font-bold" disabled={isResultReadOnly} placeholder={i.p} /></div>
                        ))}
                    </div>
                </div>
                <div className="col-span-full flex justify-end pt-6 border-t italic text-xs">
                      <div className="text-center w-1/3">
                          <div className="flex justify-center gap-1 mb-2">
                              <Input name="resultTime" value={formData.resultTime} onChange={handleChange} className="w-8 h-5 text-center border-b p-0" placeholder="..." disabled={isResultReadOnly} />
                              <span>Giờ ........ ngày</span>
                              <Input name="resultDateDay" value={formData.resultDateDay} onChange={handleChange} className="w-8 h-5 text-center border-b" disabled={isResultReadOnly} />
                              <span>tháng</span>
                              <Input name="resultDateMonth" value={formData.resultDateMonth} onChange={handleChange} className="w-8 h-5 text-center border-b" disabled={isResultReadOnly} />
                              <span>năm <span className="text-red-500">*</span></span>
                              <Input name="resultDateYear" value={formData.resultDateYear} onChange={handleChange} className="w-12 h-5 text-center border-b" disabled={isResultReadOnly} />
                          </div>
                          <p className="font-bold uppercase not-italic">Trưởng khoa xét nghiệm</p>
                          <div className="pt-12">
                              <Input name="technician" value={formData.technician} onChange={handleChange} placeholder="Họ tên" className="text-center border-b border-t-0 border-x-0 font-bold uppercase h-7 px-0" disabled={isResultReadOnly} />
                          </div>
                      </div>
                </div>
              </div>
          </div>
        </div>
        )}

        {/* Hidden PDF Template */}
        <div ref={printRef} className="fixed" style={{ position: 'fixed', left: '-10000px', top: '0', width: '210mm', padding: '10mm', backgroundColor: '#fff', color: '#000', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '10pt', lineHeight: '1.2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ width: '30%' }}><p style={{ margin: 0 }}>Sở Y tế: {formData.healthDept}</p><p style={{ margin: 0 }}>BV: {formData.hospital}</p></div>
                <div style={{ width: '40%', textAlign: 'center' }}><h1 style={{ fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Phiếu Xét Nghiệm</h1><h2 style={{ fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Huyết Học</h2></div>
                <div style={{ width: '30%', textAlign: 'right' }}><p style={{ fontWeight: 'bold', margin: 0 }}>MS: 17/BV-02</p><p>Số: {formData.testNumber}</p></div>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <p>Họ tên người bệnh: <b style={{ textTransform: 'uppercase' }}>{formData.patientName}</b> - Tuổi: {formData.age} - Nam/Nữ: {formData.gender}</p>
                <p>Địa chỉ: {formData.address}</p>
                <p>Khoa: {formData.department} - Buồng: {formData.room} - Giường: {formData.bed}</p>
                <p>Số thẻ BHYT: {formData.insuranceCard1} {formData.insuranceCard2} {formData.insuranceCard3} {formData.insuranceCard4} {formData.insuranceCard5}</p>
                <p>Chẩn đoán: {formData.diagnosis}</p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
                <thead><tr><th style={{ border: '1px solid black', padding: '4px' }}>CHỈ SỐ</th><th style={{ border: '1px solid black', padding: '4px' }}>KẾT QUẢ</th><th style={{ border: '1px solid black', padding: '4px' }}>CHỈ SỐ</th><th style={{ border: '1px solid black', padding: '4px' }}>KẾT QUẢ</th></tr></thead>
                <tbody>
                    <tr><td style={{ border: '1px solid black', padding: '4px' }}>Số lượng HC (x10^12/l)</td><td style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}><b>{formData.rbc}</b></td><td style={{ border: '1px solid black', padding: '4px' }}>Số lượng BC (x10^9/l)</td><td style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}><b>{formData.wbc}</b></td></tr>
                    <tr><td style={{ border: '1px solid black', padding: '4px' }}>Huyết sắc tố (g/l)</td><td style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}><b>{formData.hgb}</b></td><td style={{ border: '1px solid black', padding: '4px' }}>Trung tính (%)</td><td style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}><b>{formData.neutrophils}</b></td></tr>
                    <tr><td style={{ border: '1px solid black', padding: '4px' }}>Hematocrit (l/l)</td><td style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}><b>{formData.hct}</b></td><td style={{ border: '1px solid black', padding: '4px' }}>Tiểu cầu (x10^9/l)</td><td style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}><b>{formData.plt}</b></td></tr>
                    <tr><td style={{ border: '1px solid black', padding: '4px' }}>Nhóm máu ABO</td><td style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}><b>{formData.bloodGroupABO}</b></td><td style={{ border: '1px solid black', padding: '4px' }}>Nhóm máu Rh</td><td style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}><b>{formData.bloodGroupRh}</b></td></tr>
                </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <div style={{ textAlign: 'center', width: '45%' }}>
                    <p style={{ margin: 0 }}>{formData.requestTime && `${formData.requestTime} Giờ `}Ngày {formData.requestDateDay} tháng {formData.requestDateMonth} năm {formData.requestDateYear}</p>
                    <p style={{ fontWeight: 'bold', textTransform: 'uppercase', margin: '4px 0 0 0' }}>Bác sĩ điều trị</p>
                    <div style={{ height: '20mm' }}></div>
                    <b style={{ textTransform: 'uppercase' }}>{formData.doctor}</b>
                </div>
                <div style={{ textAlign: 'center', width: '45%' }}>
                    <p style={{ margin: 0 }}>{formData.resultTime && `${formData.resultTime} Giờ `}Ngày {formData.resultDateDay} tháng {formData.resultDateMonth} năm {formData.resultDateYear}</p>
                    <p style={{ fontWeight: 'bold', textTransform: 'uppercase', margin: '4px 0 0 0' }}>TRƯỞNG KHOA XÉT NGHIỆM</p>
                    <div style={{ height: '20mm' }}></div>
                    <b style={{ textTransform: 'uppercase' }}>{formData.technician}</b>
                </div>
            </div>
        </div>

        <DialogFooter className="mt-6 border-t pt-4">
          <div className="flex justify-between w-full items-center">
            {(initialData || formData.id) && (
              <Button type="button" variant="outline" onClick={() => handleActionClick("PDF")} className="border-vlu-red text-vlu-red"><DownloadIcon size={16} className="mr-2" /> Xuất File PDF</Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Đóng</Button>
              {!readOnly && (
                <>
                  {formData.status === 0 && (initialData ? <Button onClick={() => handleActionClick("FAST_TRACK")} className="bg-orange-500 text-white shadow-sm">Tiếp Nhận & Thực Hiện Ngay (Chuyển TT2)</Button> : <Button onClick={() => handleActionClick("SAVE")} className="bg-vlu-red text-white shadow-sm">Lưu Chỉ Định (Tạo Yêu Cầu)</Button>)}
                  {formData.status === 1 && <Button onClick={() => handleActionClick("NEXT")} className="bg-orange-500 text-white shadow-sm">Bắt Đầu Chạy (Chuyển TT2)</Button>}
                  {formData.status === 2 && <Button onClick={() => handleActionClick("NEXT")} className="bg-vlu-red text-white shadow-sm">Hoàn Thành Kết Quả</Button>}
                </>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Dialog xác nhận đơn vị thực hiện */}
    <Dialog open={isDeptDialogOpen} onOpenChange={setIsDeptDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận đơn vị thực hiện</DialogTitle>
          <DialogDescription>
            Vui lòng nhập tên khoa/phòng sẽ thực hiện chỉ định này.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dept" className="text-right">
              Khoa/Phòng
            </Label>
            <Input
              id="dept"
              value={departmentInput}
              onChange={(e) => setDepartmentInput(e.target.value)}
              placeholder="Ví dụ: Khoa Xét nghiệm Huyết học"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeptDialogOpen(false)}>Hủy</Button>
          <Button type="button" onClick={handleConfirmDepartment} className="bg-vlu-red text-white hover:bg-vlu-red/90" disabled={!departmentInput.trim()}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};
