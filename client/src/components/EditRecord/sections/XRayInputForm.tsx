import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface XRayInputFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File, formData?: any) => void;
  defaultPatientName?: string;
  defaultAge?: number;
  defaultGender?: string;
  defaultAddress?: string;
  initialData?: any;
  readOnly?: boolean;
}

export const XRayInputForm = ({ 
  isOpen, 
  onClose, 
  onSave,
  defaultPatientName = "",
  defaultAge,
  defaultGender = "",
  defaultAddress = "",
  initialData,
  readOnly = false
}: XRayInputFormProps) => {
  
  const [formData, setFormData] = useState({
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
    requestDateDay: "",
    requestDateMonth: "",
    requestDateYear: "",
    resultDateDay: "",
    resultDateMonth: "",
    resultDateYear: "",
  });

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Reset to defaults
            setFormData({
                healthDept: "",
                hospital: "",
                xrayNumber: "",
                times: "", 
                patientName: defaultPatientName,
                age: defaultAge?.toString() || "",
                gender: defaultGender,
                address: defaultAddress,
                department: "",
                room: "",
                bed: "",
                diagnosis: "",
                request: "",
                result: "",
                doctor: "",
                specialist: "",
                advice: "",
                requestDateDay: new Date().getDate().toString(),
                requestDateMonth: (new Date().getMonth() + 1).toString(),
                requestDateYear: new Date().getFullYear().toString(),
                resultDateDay: new Date().getDate().toString(),
                resultDateMonth: (new Date().getMonth() + 1).toString(),
                resultDateYear: new Date().getFullYear().toString(),
            });
        }
    }
  }, [isOpen, initialData, defaultPatientName, defaultAge, defaultGender, defaultAddress]);

  const printRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePDF = async () => {
    if (!printRef.current) return;

    try {
        const canvas = await html2canvas(printRef.current, {
            scale: 2, 
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
                const root = clonedDoc.documentElement;
                root.style.setProperty('--background', '#ffffff');
                root.style.setProperty('--foreground', '#000000');
                root.style.setProperty('--primary', '#000000');
                root.style.setProperty('--card', '#ffffff');
                root.style.setProperty('--popover', '#ffffff');
                root.style.setProperty('--muted', '#f3f4f6');
                root.style.setProperty('--border', '#e5e7eb');
            }
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Since we want full width usually:
        const printWidth = pdfWidth; 
        const printHeight = (imgHeight * pdfWidth) / imgWidth;

        pdf.addImage(imgData, "PNG", 0, 0, printWidth, printHeight);
        
        const file = new File([pdf.output("blob")], `XQuang_${formData.patientName}_${Date.now()}.pdf`, { type: "application/pdf" });
        onSave(file, formData);
        onClose();
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] !max-w-none max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Phiếu Chiếu/ Chụp X-Quang</DialogTitle>
          <DialogDescription>Nhập thông tin chi tiết phiếu X-Quang</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* New Horizontal Header Layout (3 Columns) */}
          <div className="grid grid-cols-3 gap-4 items-start border-b border-gray-100 pb-4">
            {/* Left Col */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="w-20 shrink-0 text-xs">Sở Y tế:</Label>
                <Input name="healthDept" value={formData.healthDept} onChange={handleChange} className="h-7 text-xs border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" placeholder="...................." disabled={readOnly} />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-20 shrink-0 text-xs">Bệnh viện:</Label>
                <Input name="hospital" value={formData.hospital} onChange={handleChange} className="h-7 text-xs border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" placeholder="...................." disabled={readOnly} />
              </div>
            </div>

            {/* Center Col */}
            <div className="text-center space-y-1">
              <h2 className="text-sm font-bold uppercase text-vlu-red">Phiếu chiếu/ chụp X-Quang</h2>
              <div className="flex justify-center items-center gap-1">
                <span className="text-xs italic">(lần thứ</span>
                <Input 
                    name="times" 
                    value={formData.times} 
                    onChange={handleChange} 
                    className="w-10 h-5 p-0 text-center text-xs border-b border-x-0 border-t-0 rounded-none focus-visible:ring-0 bg-transparent" 
                    disabled={readOnly}
                />
                <span className="text-xs italic">)</span>
              </div>
            </div>

            {/* Right Col */}
            <div className="space-y-1 text-right">
              <p className="text-xs font-bold">MS: 08/BV-02</p>
              <div className="flex items-center justify-end gap-2">
                <Label className="shrink-0 text-xs">Số:</Label>
                <Input name="xrayNumber" value={formData.xrayNumber} onChange={handleChange} className="w-24 h-7 text-xs border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 text-right" placeholder="................" disabled={readOnly} />
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 flex items-end gap-2 min-w-[200px]">
                <Label className="shrink-0">Họ tên người bệnh:</Label>
                <Input name="patientName" value={formData.patientName} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" disabled={readOnly} />
              </div>
              <div className="w-24 flex items-end gap-2">
                <Label className="shrink-0">Tuổi:</Label>
                <Input name="age" value={formData.age} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" disabled={readOnly} />
              </div>
              <div className="w-32 flex items-end gap-2">
                <Label className="shrink-0">Nam/Nữ:</Label>
                <Input name="gender" value={formData.gender} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" disabled={readOnly} />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <Label className="shrink-0">Địa chỉ:</Label>
              <Input name="address" value={formData.address} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" disabled={readOnly} />
            </div>

            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 flex items-end gap-2">
                <Label className="shrink-0">Khoa:</Label>
                <Input name="department" value={formData.department} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" disabled={readOnly} />
              </div>
              <div className="w-32 flex items-end gap-2">
                <Label className="shrink-0">Buồng:</Label>
                <Input name="room" value={formData.room} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" disabled={readOnly} />
              </div>
              <div className="w-32 flex items-end gap-2">
                <Label className="shrink-0">Giường:</Label>
                <Input name="bed" value={formData.bed} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" disabled={readOnly} />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <Label className="shrink-0">Chẩn đoán:</Label>
              <Input name="diagnosis" value={formData.diagnosis} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" disabled={readOnly} />
            </div>
          </div>

          {/* Request Section */}
          <div className="border border-gray-300 rounded-sm">
             <div className="bg-gray-50 p-2 border-b border-gray-300">
                <Label className="font-bold text-base">Yêu cầu chiếu/ chụp</Label>
             </div>
             <div className="p-0">
                <Textarea 
                name="request" 
                value={formData.request} 
                onChange={handleChange} 
                className="min-h-[200px] resize-none leading-loose border-0 rounded-none focus-visible:ring-0 w-full p-3"
                placeholder="Nhập yêu cầu..."
                disabled={readOnly}
                />
             </div>
          </div>
            
          {/* Treatment Doctor Signature */}
           <div className="flex justify-end pt-4">
                <div className="text-center w-1/3 space-y-2">
                    <div className="flex justify-center gap-1 italic text-sm mb-2">
                    <span>Ngày</span>
                    <Input name="requestDateDay" value={formData.requestDateDay} onChange={handleChange} className="w-10 h-6 p-0 text-center border-b border-x-0 border-t-0 rounded-none" disabled={readOnly} />
                    <span>tháng</span>
                    <Input name="requestDateMonth" value={formData.requestDateMonth} onChange={handleChange} className="w-10 h-6 p-0 text-center border-b border-x-0 border-t-0 rounded-none" disabled={readOnly} />
                    <span>năm</span>
                    <Input name="requestDateYear" value={formData.requestDateYear} onChange={handleChange} className="w-16 h-6 p-0 text-center border-b border-x-0 border-t-0 rounded-none" disabled={readOnly} />
                    </div>
                    <p className="font-bold">Bác sĩ điều trị</p>
                    <div className="pt-16">
                         <div className="flex items-center gap-2">
                            <Label className="shrink-0 font-normal">Họ tên:</Label>
                            <Input name="doctor" value={formData.doctor} onChange={handleChange} placeholder="................" className="text-center border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0" disabled={readOnly} />
                         </div>
                    </div>
                </div>
             </div>

          {/* Result Section */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="border border-gray-300 rounded-sm">
                <div className="bg-gray-50 p-2 border-b border-gray-300">
                    <Label className="font-bold text-base">Kết quả chiếu/ chụp</Label>
                </div>
                <div className="p-0">
                    <Textarea 
                    name="result" 
                    value={formData.result} 
                    onChange={handleChange} 
                    className="min-h-[350px] resize-none leading-loose border-0 rounded-none focus-visible:ring-0 w-full p-3"
                    placeholder="Nhập kết quả..."
                    disabled={readOnly}
                    />
                </div>
            </div>

            {/* Specialist Doctor Signature */}
             <div className="flex justify-between items-start pt-2">
                 <div className="w-1/2 space-y-2 pr-4">
                     <Label className="font-bold block">Lời dặn của BS chuyên khoa:</Label>
                     <Textarea 
                        name="advice" 
                        value={formData.advice} 
                        onChange={handleChange} 
                        className="min-h-[80px] resize-none border-gray-300 mt-2"
                        placeholder="................................"
                        disabled={readOnly}
                    />
                 </div>
                 
                <div className="text-center w-1/3 space-y-2">
                    <div className="flex justify-center gap-1 italic text-sm mb-2">
                    <span>Ngày</span>
                    <Input name="resultDateDay" value={formData.resultDateDay} onChange={handleChange} className="w-10 h-6 p-0 text-center border-b border-x-0 border-t-0 rounded-none" disabled={readOnly} />
                    <span>tháng</span>
                    <Input name="resultDateMonth" value={formData.resultDateMonth} onChange={handleChange} className="w-10 h-6 p-0 text-center border-b border-x-0 border-t-0 rounded-none" disabled={readOnly} />
                    <span>năm</span>
                    <Input name="resultDateYear" value={formData.resultDateYear} onChange={handleChange} className="w-16 h-6 p-0 text-center border-b border-x-0 border-t-0 rounded-none" disabled={readOnly} />
                    </div>
                    <p className="font-bold">Bác sĩ chuyên khoa</p>
                    <div className="pt-16">
                         <div className="flex items-center gap-2">
                            <Label className="shrink-0 font-normal">Họ tên:</Label>
                            <Input name="specialist" value={formData.specialist} onChange={handleChange} placeholder="................" className="text-center border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0" disabled={readOnly} />
                         </div>
                    </div>
                </div>
             </div>
          </div>
        </div>

        <div 
            ref={printRef}
            className="fixed"
            style={{
                position: 'fixed',
                left: '-10000px', // Move off-screen instead of invisible
                top: '0',
                width: '210mm',
                padding: '10mm',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: '10pt',
                lineHeight: '1.4',
                // Explicitly reset variables to safe values just in case
                ['--background' as any]: '#ffffff',
                ['--foreground' as any]: '#000000',
            }}
        >
            <div>
                {/* Header - 3 Column Layout */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    {/* Left */}
                    <div style={{ width: '30%' }}>
                        <p style={{ margin: 0 }}>Sở Y tế: {formData.healthDept || "..................."}</p>
                        <p style={{ margin: 0 }}>BV: {formData.hospital || "..................."}</p>
                    </div>
                    
                    {/* Center */}
                    <div style={{ width: '40%', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Phiếu chiếu/ chụp X-Quang</h1>
                        <p style={{ fontStyle: 'italic', margin: 0, fontSize: '9pt' }}>(lần thứ {formData.times || "................."})</p>
                    </div>

                    {/* Right */}
                    <div style={{ width: '30%', textAlign: 'right' }}>
                         <p style={{ margin: 0, fontWeight: 'bold' }}>MS: 08/BV-02</p>
                         <p style={{ margin: 0 }}>Số: {formData.xrayNumber || "................"}</p>
                    </div>
                </div>

                {/* Info */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ width: '50%' }}>Họ tên người bệnh: <b style={{ fontWeight: 'bold' }}>{formData.patientName}</b></span>
                        <span style={{ width: '25%' }}>Tuổi: {formData.age}</span>
                        <span style={{ width: '25%', textAlign: 'right' }}>Nam/Nữ: {formData.gender}</span>
                    </div>
                    <p style={{ margin: '0 0 8px 0' }}>Địa chỉ: {formData.address}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ width: '50%' }}>Khoa: {formData.department}</span>
                        <span style={{ width: '25%' }}>Buồng: {formData.room}</span>
                        <span style={{ width: '25%', textAlign: 'right' }}>Giường: {formData.bed}</span>
                    </div>
                    <p style={{ margin: 0 }}>Chẩn đoán: {formData.diagnosis}</p>
                </div>

                {/* Request Table */}
                <div style={{ marginBottom: '24px', border: '1px solid #000000' }}>
                     <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #000000', padding: '8px', fontWeight: 'bold', textAlign: 'left', color: '#000000' }}>Yêu cầu chiếu/ chụp</div>
                     <div style={{ padding: '8px', minHeight: '30mm', whiteSpace: 'pre-wrap', color: '#000000' }}>{formData.request}</div>
                </div>

                {/* Treatment Sig */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
                    <div style={{ textAlign: 'center', width: '33%' }}>
                        <p style={{ fontStyle: 'italic', margin: 0 }}>Ngày {formData.requestDateDay} tháng {formData.requestDateMonth} năm {formData.requestDateYear}</p>
                        <p style={{ fontWeight: 'bold', marginTop: '4px', marginBottom: '0' }}>Bác sĩ điều trị</p>
                        <div style={{ height: '20mm' }}></div>
                        <p style={{ margin: 0 }}>Họ tên: {formData.doctor}</p>
                    </div>
                </div>

                {/* Result Table */}
                <div style={{ marginBottom: '24px', border: '1px solid #000000' }}>
                     <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #000000', padding: '8px', fontWeight: 'bold', textAlign: 'left', color: '#000000' }}>Kết quả chiếu/ chụp</div>
                     <div style={{ padding: '8px', minHeight: '40mm', whiteSpace: 'pre-wrap', color: '#000000' }}>{formData.result}</div>
                </div>

                 {/* Specialist Sig */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '50%', paddingRight: '16px' }}>
                        <p style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '8px' }}>Lời dặn của BS chuyên khoa:</p>
                        <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{formData.advice}</p>
                    </div>
                    <div style={{ textAlign: 'center', width: '33%' }}>
                        <p style={{ fontStyle: 'italic', margin: 0 }}>Ngày {formData.resultDateDay} tháng {formData.resultDateMonth} năm {formData.resultDateYear}</p>
                        <p style={{ fontWeight: 'bold', marginTop: '4px', marginBottom: '0' }}>Bác sĩ chuyên khoa</p>
                        <div style={{ height: '20mm' }}></div>
                        <p style={{ margin: 0 }}>Họ tên: {formData.specialist}</p>
                    </div>
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleGeneratePDF} className="bg-vlu-red hover:bg-red-700 text-white">Lưu phiếu & Tạo file</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
