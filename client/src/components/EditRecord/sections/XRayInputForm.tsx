import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, CheckCircle2, Circle, Loader2, FileUp } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { Department } from "@/types";

interface XRayStatusLog {
  status: number;
  departmentName: string;
  updatedByName: string;
  createdAt: string;
}

export interface XRayData {
  id?: number;
  status: number;
  healthDept: string;
  hospital: string;
  xrayNumber: string;
  times: string;
  patientName: string;
  age: string;
  gender: string;
  address: string;
  department: string;
  room: string;
  bed: string;
  diagnosis: string;
  request: string;
  result: string;
  doctor: string;
  specialist: string;
  advice: string;
  requestTime: string;
  requestDateDay: string;
  requestDateMonth: string;
  requestDateYear: string;
  resultTime: string;
  resultDateDay: string;
  resultDateMonth: string;
  resultDateYear: string;
  xRayStatusLogs: XRayStatusLog[];
}

interface XRayInputFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPatientName?: string;
  defaultAge?: number;
  defaultDob?: string;
  defaultGender?: string;
  defaultAddress?: string;
  defaultDepartment?: string;
  initialData?: XRayData;
  readOnly?: boolean;
  recordId?: number;
}

const parseDate = (dateStr?: string) => {
  if (!dateStr) return null;
  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date;
  const parts = dateStr.split(/[/ -]/);
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

export const XRayInputForm = ({
  isOpen,
  onClose,
  defaultPatientName = "",
  defaultAge,
  defaultDob = "",
  defaultGender = "",
  defaultAddress = "",
  defaultDepartment = "Nội khoa",
  initialData,
  readOnly = false,
  recordId
}: XRayInputFormProps) => {  const { currentUser } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isImportMode, setIsImportMode] = useState(false);
  
  const defaultState: XRayData = {
    id: undefined,
    status: 0,
    healthDept: "",
    hospital: "",
    xrayNumber: "",
    times: "", 
    patientName: "",
    age: "",
    gender: "",
    address: "",
    department: "",
    room: "",
    bed: "",
    diagnosis: "",
    request: "",
    result: "",
    doctor: "",
    specialist: "",
    advice: "",
    requestTime: "",
    requestDateDay: new Date().getDate().toString(),
    requestDateMonth: (new Date().getMonth() + 1).toString(),
    requestDateYear: new Date().getFullYear().toString(),
    resultTime: "",
    resultDateDay: new Date().getDate().toString(),
    resultDateMonth: (new Date().getMonth() + 1).toString(),
    resultDateYear: new Date().getFullYear().toString(),
    xRayStatusLogs: []
  };

  const getRequestDateString = (data: XRayData) => {
    const year = data.requestDateYear || new Date().getFullYear().toString();
    const month = (data.requestDateMonth || "1").padStart(2, '0');
    const day = (data.requestDateDay || "1").padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState<XRayData>(() => {
    if (initialData) {
        const data: XRayData = {
            ...defaultState,
            ...initialData,
            patientName: defaultPatientName,
            gender: defaultGender,
            address: defaultAddress,
            department: initialData.department || defaultDepartment,
            status: initialData.status !== undefined ? initialData.status : 0,
            xRayStatusLogs: initialData.xRayStatusLogs || []
        };
        
        // Ensure result date is populated if missing
        const now = new Date();
        if (!data.resultDateDay) data.resultDateDay = now.getDate().toString();
        if (!data.resultDateMonth) data.resultDateMonth = (now.getMonth() + 1).toString();
        if (!data.resultDateYear) data.resultDateYear = now.getFullYear().toString();

        const calculatedAge = calculateAgeAtDate(defaultDob, getRequestDateString(data));
        data.age = (calculatedAge === "" && defaultAge && defaultAge > 0) ? defaultAge.toString() : calculatedAge;
        
        if (!readOnly && data.status === 2 && !data.specialist && currentUser?.name) {
            data.specialist = currentUser.name;
        }
        return data;
    } else {
        const data: XRayData = {
            ...defaultState,
            patientName: defaultPatientName,
            gender: defaultGender,
            address: defaultAddress,
            department: defaultDepartment,
            doctor: currentUser?.name || ""
        };
        const calculatedAge = calculateAgeAtDate(defaultDob, getRequestDateString(data));
        data.age = (calculatedAge === "" && defaultAge && defaultAge > 0) ? defaultAge.toString() : calculatedAge;
        return data;
    }
  });
  const [isDeptDialogOpen, setIsDeptDialogOpen] = useState(false);
  const [departmentInput, setDepartmentInput] = useState("");
  const [openConfirmCombobox, setOpenConfirmCombobox] = useState(false);
  const [targetAction, setTargetAction] = useState<"SAVE" | "NEXT" | "PDF" | "FAST_TRACK" | null>(null);
  const [isGenerating, setIsGenerating] = useState(!!(isOpen && initialData && readOnly));

  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);

  useEffect(() => {
    if (isDeptDialogOpen) {
      const fetchDepts = async () => {
        try {
          const data = await api.departments.getAll();
          setDepartmentsList(data);
        } catch (error) {
          console.error("Failed to fetch departments", error);
        }
      };
      fetchDepts();
    }
  }, [isDeptDialogOpen]);

  const generateAndOpenPDF = async (dataToSave: XRayData) => {
    if (!printRef.current) return;
    try {
        const canvas = await html2canvas(printRef.current, {
            scale: 2, 
            useCORS: true,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
                const root = clonedDoc.documentElement;
                root.style.backgroundColor = 'white';
                root.style.color = 'black';
            }
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
        
        console.log(`Opening PDF for ${dataToSave.patientName}`);
        
        window.open(URL.createObjectURL(pdf.output("blob")), "_blank");
    } catch (error) {
        console.error("Error direct viewing PDF:", error);
        toast.error("Không thể tạo bản xem trước PDF");
    }
  };

  const generateAndSavePDF = async (dataToSave: XRayData) => {
    if (!printRef.current) return;
    try {
        const canvas = await html2canvas(printRef.current, { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
                const root = clonedDoc.documentElement;
                root.style.backgroundColor = 'white';
                root.style.color = 'black';
            }
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
        pdf.save(`XQuang_${dataToSave.patientName}.pdf`);
    } catch (error) { console.error(error); }
  };

  const handleImportPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !recordId) return;

    if (file.type !== "application/pdf") {
      toast.error("Vui lòng chọn file PDF");
      return;
    }

    setIsImporting(true);
    const toastId = toast.loading("Đang xử lý PDF X-Quang...");

    try {
      const result = await api.xRays.importPdf(recordId, file);
      
      const reqDate = result.requestedAt ? new Date(result.requestedAt) : new Date();
      const resDate = result.completedAt ? new Date(result.completedAt) : new Date();

      setFormData(prev => ({
        ...prev,
        request: result.requestDescription || "",
        result: result.resultDescription || "",
        advice: result.doctorAdvice || "",
        department: result.performDepartmentName || prev.department || defaultDepartment,
        diagnosis: result.admissionDiagnosis || prev.diagnosis,
        requestDateDay: reqDate.getDate().toString(),
        requestDateMonth: (reqDate.getMonth() + 1).toString(),
        requestDateYear: reqDate.getFullYear().toString(),
        resultDateDay: resDate.getDate().toString(),
        resultDateMonth: (resDate.getMonth() + 1).toString(),
        resultDateYear: resDate.getFullYear().toString(),
      }));
      
      setIsImportMode(true);
      toast.success("Trích xuất dữ liệu X-Quang thành công", { id: toastId });
    } catch (error: any) {
      console.error("X-Ray PDF Import error:", error);
      toast.error(error.message || "Lỗi khi import PDF", { id: toastId });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (isGenerating) {
        const timer = setTimeout(async () => {
            await generateAndOpenPDF(formData);
            setIsGenerating(false);
            onClose();
        }, 1000);
        return () => clearTimeout(timer);
    }
  }, [isGenerating, formData, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newData = { ...prev, [name]: value };
        if (["requestDateDay", "requestDateMonth", "requestDateYear"].includes(name) && defaultDob && !readOnly) {
            const newAge = calculateAgeAtDate(defaultDob, getRequestDateString(newData));
            if (newAge !== "" && newAge !== newData.age) {
                newData.age = newAge;
            }
        }
        return newData;
    });
  };

  const validateForm = (action: "SAVE" | "NEXT" | "FAST_TRACK") => {
    if (!formData.request?.trim()) {
        toast.error("Vui lòng nhập 'Yêu cầu chiếu/ chụp'.");
        return false;
    }
    if (!formData.requestDateDay?.trim() || !formData.requestDateMonth?.trim() || !formData.requestDateYear?.trim()) {
        toast.error("Vui lòng nhập đầy đủ ngày, tháng, năm của ngày yêu cầu.");
        return false;
    }
    if (action === "NEXT" && formData.status === 2) {
        if (!formData.result?.trim()) {
            toast.error("Vui lòng nhập 'Kết quả chiếu/ chụp'.");
            return false;
        }
        if (!formData.advice?.trim()) {
            toast.error("Vui lòng nhập 'Lời dặn của BS chuyên khoa'.");
            return false;
        }
        if (!formData.resultDateDay?.trim() || !formData.resultDateMonth?.trim() || !formData.resultDateYear?.trim()) {
            toast.error("Vui lòng nhập đầy đủ ngày, tháng, năm của ngày trả kết quả.");
            return false;
        }
    }
    return true;
  };

  const handleActionClick = (action: "SAVE" | "NEXT" | "PDF" | "FAST_TRACK") => {
    if (action !== "PDF" && !validateForm(action)) return;
    setTargetAction(action);
    if (action === "PDF") {
      generateAndSavePDF(formData);
      return;
    }
    setDepartmentInput("");
    setIsDeptDialogOpen(true);
  };

  const handleConfirmDepartment = async () => {
    setIsDeptDialogOpen(false);
    if (!recordId) {
        toast.error("Không tìm thấy ID Hồ sơ bệnh án. Vui lòng lưu hồ sơ trước khi tạo phiếu X-Quang.");
        return;
    }

    try {
        if (isImportMode && (targetAction === "SAVE" || targetAction === "NEXT")) {
            const completedAt = `${formData.resultDateYear}-${formData.resultDateMonth.padStart(2, '0')}-${formData.resultDateDay.padStart(2, '0')}`;
            const requestedAt = `${formData.requestDateYear}-${formData.requestDateMonth.padStart(2, '0')}-${formData.requestDateDay.padStart(2, '0')}`;
            
            const importPayload = {
                medicalRecordId: recordId,
                requestDepartmentName: formData.department || defaultDepartment,
                performDepartmentName: departmentInput || "Khoa Chẩn đoán hình ảnh",
                requestDescription: formData.request,
                requestedAt: requestedAt,
                resultDescription: formData.result,
                doctorAdvice: formData.advice,
                completedAt: completedAt
            };
            
            await api.xRays.importCompleted(recordId, importPayload);
            toast.success("Đã nhập hồ sơ X-Quang từ PDF thành công");
            setTimeout(() => { window.location.search = "?tab=forms"; }, 1000);
            return;
        }

        let currentXrayId = formData.id;
        const requestedAt = getRequestDateString(formData);
        
        if (!currentXrayId) {
            // Find department ID from name
            const selectedDept = departmentsList.find(d => d.name === departmentInput);
            const deptIds = selectedDept ? [selectedDept.id] : [];

            const createPayload = {
                listDepartmentId: deptIds,
                requestDescription: formData.request || "Yêu cầu chụp X-Quang",
                requestedAt: requestedAt
            };
            const newIdStr = await api.xRays.create(recordId, createPayload);
            currentXrayId = parseInt(newIdStr, 10);
            if (!isNaN(currentXrayId)) {
                setFormData(prev => ({ ...prev, id: currentXrayId }));
            }
        }

        let newStatus = formData.status;
        const newLogs: XRayStatusLog[] = [];

        if (targetAction === "NEXT") {
            newStatus = Math.min(formData.status + 1, 3);
            if (newStatus === 1 || newStatus === 2) {
                 if (currentXrayId) {
                     await api.xRays.changeStatus(recordId, currentXrayId, {
                         status: newStatus,
                         departmentName: departmentInput
                     });
                 }
            } else if (newStatus === 3) {
                 if (currentXrayId) {
                     const completedAt = `${formData.resultDateYear}-${formData.resultDateMonth.padStart(2, '0')}-${formData.resultDateDay.padStart(2, '0')}`;
                     await api.xRays.complete(recordId, currentXrayId, {
                         resultDescription: formData.result,
                         doctorAdvice: formData.advice,
                         completedAt: completedAt
                     });
                     await api.xRays.changeStatus(recordId, currentXrayId, {
                         status: 3,
                         departmentName: departmentInput
                     });
                 }
            }
            newLogs.push({ status: newStatus, departmentName: departmentInput, updatedByName: currentUser?.name || "Người dùng", createdAt: new Date().toISOString() });
        } else if (targetAction === "FAST_TRACK") {
            if (currentXrayId) {
                await api.xRays.changeStatus(recordId, currentXrayId, { status: 1, departmentName: departmentInput });
                await api.xRays.changeStatus(recordId, currentXrayId, { status: 2, departmentName: departmentInput });
                newStatus = 2;
                newLogs.push({ status: 1, departmentName: departmentInput, updatedByName: currentUser?.name || "Người dùng", createdAt: new Date().toISOString() });
                newLogs.push({ status: 2, departmentName: departmentInput, updatedByName: currentUser?.name || "Người dùng", createdAt: new Date().toISOString() });
            }
        }

        setFormData(prev => {
            const updated = { ...prev, status: newStatus, xRayStatusLogs: [...(prev.xRayStatusLogs || []), ...newLogs] };
            if (!readOnly && updated.status === 2) {
                if (!updated.specialist && currentUser?.name) {
                    updated.specialist = currentUser.name;
                }
                const now = new Date();
                updated.resultDateDay = now.getDate().toString();
                updated.resultDateMonth = (now.getMonth() + 1).toString();
                updated.resultDateYear = now.getFullYear().toString();
            }
            return updated;
        });
        toast.success(`Cập nhật thành công`);
        setTimeout(() => { window.location.search = "?tab=forms"; }, 1000);
    } catch (error: unknown) {
        console.error("XRAY_ERROR:", error);
        const message = error instanceof Error ? error.message : "Lỗi đồng bộ server.";
        toast.error(message);
    }
  };

  const isRequestReadOnly = readOnly || (formData.status > 0 && !isImportMode) || !!initialData;
  const showResultSection = formData.status >= 2 || isImportMode;
  const isResultReadOnly = readOnly || (formData.status === 3 && !isImportMode);

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] !max-w-none max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Phiếu Chiếu/ Chụp X-Quang</DialogTitle>
          <DialogDescription>Xem hoặc chỉnh sửa phiếu X-Quang</DialogDescription>
        </DialogHeader>
        
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf" 
            onChange={handleImportPdf}
        />

        {isGenerating || isImporting ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-vlu-red" />
                <p className="text-lg font-medium text-gray-600">
                    {isGenerating ? "Đang chuẩn bị bản in PDF..." : "Đang trích xuất dữ liệu từ PDF X-Quang..."}
                </p>
            </div>
        ) : (
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between mb-8 px-8 relative mt-2 print:hidden">
            {isImportMode ? (
              <>
                <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
                <div className="absolute left-10 top-1/2 -translate-y-1/2 h-1 bg-vlu-red z-0 transition-all duration-300" style={{ width: `50%` }}></div>
                <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-vlu-red border-vlu-red text-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-vlu-red">Đã Import PDF</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white border-gray-300 text-gray-300">
                    <Circle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Chờ hoàn tất</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
                <div className="absolute left-10 top-1/2 -translate-y-1/2 h-1 bg-vlu-red z-0 transition-all duration-300" style={{ width: `calc(${(formData.status / 3) * 100}% - 40px)` }}></div>
                {STEPS.map((step, index) => {
                  const isActive = formData.status >= index;
                  const logForStep = formData.xRayStatusLogs?.find(l => l.status === index);
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
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 items-start border-b pb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="w-20 shrink-0 text-xs">Sở Y tế:</Label>
                <Input name="healthDept" value={formData.healthDept} onChange={handleChange} className="h-7 text-xs border-b border-t-0 border-x-0 rounded-none px-0" disabled={isRequestReadOnly} />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-20 shrink-0 text-xs">Bệnh viện:</Label>
                <Input name="hospital" value={formData.hospital} onChange={handleChange} className="h-7 text-xs border-b border-t-0 border-x-0 rounded-none px-0" disabled={isRequestReadOnly} />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-sm font-bold uppercase text-vlu-red">Phiếu chiếu/ chụp X-Quang</h2>
              <div className="flex justify-center items-center gap-1">
                <span className="text-xs italic">(lần thứ</span>
                <Input name="times" value={formData.times} onChange={handleChange} className="w-10 h-5 p-0 text-center text-xs border-b border-x-0 border-t-0 rounded-none bg-transparent" disabled={isRequestReadOnly} />
                <span className="text-xs italic">)</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold">MS: 08/BV-02</p>
              <div className="flex items-center justify-end gap-2">
                <Label className="shrink-0 text-xs">Số:</Label>
                <Input name="xrayNumber" value={formData.xrayNumber} onChange={handleChange} className="w-24 h-7 text-xs border-b border-t-0 border-x-0 rounded-none text-right" disabled={isRequestReadOnly} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
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
            <div className="flex items-end gap-2">
              <Label className="shrink-0">Địa chỉ:</Label>
              <Input name="address" value={formData.address} className="border-b border-t-0 border-x-0 rounded-none px-0" disabled={true} />
            </div>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 flex items-end gap-2">
                <Label className="shrink-0">Khoa: <span className="text-red-500">*</span></Label>
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
              <Label className="shrink-0">Chẩn đoán:</Label>
              <Input name="diagnosis" value={formData.diagnosis} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0" disabled={isRequestReadOnly} />
            </div>
          </div>

          <div className="border border-gray-300 rounded-sm">
             <div className="bg-gray-50 p-2 border-b border-gray-300 font-bold">Yêu cầu chiếu/ chụp <span className="text-red-500">*</span></div>
             <Textarea name="request" value={formData.request} onChange={handleChange} className="min-h-[150px] border-0 rounded-none p-3" disabled={isRequestReadOnly} />
          </div>
            
          <div className="flex justify-end pt-4">
                <div className="text-center w-1/3 space-y-2 italic text-sm">
                    <div className="flex justify-center gap-1">
                    <span>Ngày</span>
                    <Input name="requestDateDay" value={formData.requestDateDay} onChange={handleChange} className="w-8 h-6 p-0 text-center border-b border-x-0 border-t-0" disabled={isRequestReadOnly} />
                    <span>tháng</span>
                    <Input name="requestDateMonth" value={formData.requestDateMonth} onChange={handleChange} className="w-8 h-6 p-0 text-center border-b border-x-0 border-t-0" disabled={isRequestReadOnly} />
                    <span>năm <span className="text-red-500">*</span></span>
                    <Input name="requestDateYear" value={formData.requestDateYear} onChange={handleChange} className="w-14 h-6 p-0 text-center border-b border-x-0 border-t-0" disabled={isRequestReadOnly} />
                    </div>
                    <p className="font-bold not-italic uppercase text-xs">Bác sĩ điều trị</p>
                    <div className="pt-12">
                        <Input name="doctor" value={formData.doctor} onChange={handleChange} placeholder="Họ tên" className="text-center border-b border-t-0 border-x-0 font-bold uppercase h-7 px-0" disabled={isRequestReadOnly} />
                    </div>
                </div>
          </div>

          {showResultSection && (
            <div className="space-y-4 border-t pt-4">
              <div className="border border-gray-300 rounded-sm">
                  <div className="bg-gray-50 p-2 border-b border-gray-300 font-bold">Kết quả chiếu/ chụp <span className="text-red-500">*</span></div>
                  <Textarea name="result" value={formData.result} onChange={handleChange} className="min-h-[200px] border-0 rounded-none p-3 font-bold" disabled={isResultReadOnly} />
              </div>
              <div className="flex justify-between items-start pt-2">
                  <div className="w-1/2 pr-4">
                      <Label className="font-bold block">Lời dặn của BS chuyên khoa: <span className="text-red-500">*</span></Label>
                      <Textarea name="advice" value={formData.advice} onChange={handleChange} className="min-h-[80px] mt-2 italic" disabled={isResultReadOnly} />
                  </div>
                  <div className="text-center w-1/3 space-y-2 italic text-sm">
                      <div className="flex justify-center gap-1">
                      <span>Ngày</span>
                      <Input name="resultDateDay" value={formData.resultDateDay} onChange={handleChange} className="w-8 h-6 p-0 text-center border-b border-x-0 border-t-0" disabled={isResultReadOnly} />
                      <span>tháng</span>
                      <Input name="resultDateMonth" value={formData.resultDateMonth} onChange={handleChange} className="w-8 h-6 p-0 text-center border-b border-x-0 border-t-0" disabled={isResultReadOnly} />
                      <span>năm <span className="text-red-500">*</span></span>
                      <Input name="resultDateYear" value={formData.resultDateYear} onChange={handleChange} className="w-14 h-6 p-0 text-center border-b border-x-0 border-t-0" disabled={isResultReadOnly} />
                      </div>
                      <p className="font-bold not-italic uppercase text-xs">Bác sĩ chuyên khoa</p>
                      <div className="pt-12">
                          <Input name="specialist" value={formData.specialist} onChange={handleChange} placeholder="Họ tên" className="text-center border-b border-t-0 border-x-0 font-bold uppercase h-7 px-0" disabled={isResultReadOnly} />
                      </div>
                  </div>
              </div>
            </div>
          )}
        </div>
        )}

        <div 
            ref={printRef} 
            className="fixed left-[-10000px] top-0 w-[210mm] p-[10mm] bg-white text-black font-sans text-[10pt] leading-[1.4]"
        >
            <div className="flex justify-between items-start mb-5">
                <div className="w-[30%]">
                    <p className="m-0">Sở Y tế: {formData.healthDept || "..................."}</p>
                    <p className="m-0">BV: {formData.hospital || "..................."}</p>
                </div>
                <div className="w-[40%] text-center">
                    <h1 className="text-[10pt] font-bold uppercase m-0">Phiếu chiếu/ chụp X-Quang</h1>
                    <p className="italic m-0 text-[9pt]">(lần thứ {formData.times || "................."})</p>
                </div>
                <div className="w-[30%] text-right">
                     <p className="m-0 font-bold">MS: 08/BV-02</p>
                     <p className="m-0">Số: {formData.xrayNumber || "................"}</p>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between mb-2">
                    <span className="w-1/2">Họ tên người bệnh: <b className="font-bold uppercase">{formData.patientName}</b></span>
                    <span className="w-1/4">Tuổi: {formData.age}</span>
                    <span className="w-1/4 text-right">Nam/Nữ: {formData.gender}</span>
                </div>
                <p className="m-0 mb-2">Địa chỉ: {formData.address}</p>
                <div className="flex justify-between mb-2">
                    <span className="w-1/2">Khoa: {formData.department}</span>
                    <span className="w-1/4">Buồng: {formData.room}</span>
                    <span className="w-1/4 text-right">Giường: {formData.bed}</span>
                </div>
                <p className="m-0">Chẩn đoán: {formData.diagnosis}</p>
            </div>

            <div className="mb-6 border border-black">
                 <div className="bg-white border-b border-black p-2 font-bold text-left text-black">Yêu cầu chiếu/ chụp</div>
                 <div className="p-2 min-h-[30mm] whitespace-pre-wrap text-black">{formData.request}</div>
            </div>

            <div className="flex justify-end mb-8">
                <div className="text-center w-1/3">
                    <p className="italic m-0">Ngày {formData.requestDateDay} tháng {formData.requestDateMonth} năm {formData.requestDateYear}</p>
                    <p className="font-bold mt-1 mb-0 uppercase">Bác sĩ điều trị</p>
                    <div className="h-[20mm]"></div>
                    <p className="m-0 font-bold uppercase">{formData.doctor}</p>
                </div>
            </div>

            {(showResultSection || formData.status === 3) && (
              <>
                <div className="mb-6 border border-black">
                    <div className="bg-white border-b border-black p-2 font-bold text-left text-black">Kết quả chiếu/ chụp</div>
                    <div className="p-2 min-h-[40mm] whitespace-pre-wrap text-black font-bold">{formData.result}</div>
                </div>

                <div className="flex justify-between items-start">
                    <div className="w-1/2 pr-4">
                        <p className="font-bold underline mb-2">Lời dặn của BS chuyên khoa:</p>
                        <p className="whitespace-pre-wrap m-0 italic">{formData.advice}</p>
                    </div>
                    <div className="text-center w-1/3">
                        <p className="italic m-0">Ngày {formData.resultDateDay} tháng {formData.resultDateMonth} năm {formData.resultDateYear}</p>
                        <p className="font-bold mt-1 mb-0 uppercase">Bác sĩ chuyên khoa</p>
                        <div className="h-[20mm]"></div>
                        <p className="m-0 font-bold uppercase">{formData.specialist}</p>
                    </div>
                </div>
              </>
            )}
        </div>

        <DialogFooter className="mt-6 border-t pt-4">
          <div className="flex justify-between w-full items-center">
            <div>
              {!readOnly && !initialData && !isImportMode && (
                <Button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-vlu-red text-white shadow-sm hover:bg-red-800"
                >
                  <FileUp size={18} />
                  Import PDF
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Đóng</Button>
              {!readOnly && (
                <>
                  {isImportMode ? (
                    <Button onClick={() => handleActionClick("SAVE")} className="bg-vlu-red text-white shadow-sm">
                        Lưu & Hoàn Tất Import
                    </Button>
                  ) : (
                    <>
                      {formData.status === 0 && (
                        initialData ? (
                          <Button onClick={() => handleActionClick("FAST_TRACK")} className="bg-orange-500 text-white shadow-sm">Tiếp Nhận & Thực Hiện Ngay (Chuyển TT2)</Button>
                        ) : (
                          <Button onClick={() => handleActionClick("SAVE")} className="bg-vlu-red text-white shadow-sm">Lưu Chỉ Định (Tạo Yêu Cầu)</Button>
                        )
                      )}
                      {formData.status === 1 && <Button onClick={() => handleActionClick("NEXT")} className="bg-orange-500 text-white shadow-sm">Bắt Đầu Chụp (Chuyển TT2)</Button>}
                      {formData.status === 2 && <Button onClick={() => handleActionClick("NEXT")} className="bg-vlu-red text-white shadow-sm">Hoàn Thành & Ký Số</Button>}
                    </>
                  )}
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
            Vui lòng chọn khoa/phòng sẽ thực hiện chỉ định này.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dept" className="text-right">
              Khoa/Phòng
            </Label>
            <div className="col-span-3">
              <Popover open={openConfirmCombobox} onOpenChange={setOpenConfirmCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    id="dept"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openConfirmCombobox}
                    className="w-full justify-between font-normal"
                  >
                    {departmentInput || "Chọn khoa thực hiện..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Tìm khoa..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy khoa phù hợp.</CommandEmpty>
                      <CommandGroup>
                        {departmentsList.map((d) => (
                          <CommandItem
                            key={d.id}
                            value={d.name}
                            onSelect={(currentValue) => {
                              setDepartmentInput(currentValue);
                              setOpenConfirmCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                departmentInput === d.name ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {d.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeptDialogOpen(false)}>Hủy</Button>
          <Button type="button" onClick={handleConfirmDepartment} className="bg-vlu-red text-white hover:bg-vlu-red/90" disabled={!departmentInput || departmentInput === "none"}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};
