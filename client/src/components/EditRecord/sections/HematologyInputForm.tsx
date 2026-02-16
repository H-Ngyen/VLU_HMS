import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface HematologyInputFormProps {
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

export const HematologyInputForm = ({ 
  isOpen, 
  onClose, 
  onSave,
  defaultPatientName = "",
  defaultAge,
  defaultGender = "",
  defaultAddress = "",
  initialData,
  readOnly = false
}: HematologyInputFormProps) => {
  
  const [formData, setFormData] = useState({
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
    rbc: "", // Số lượng HC
    hgb: "", // Huyết sắc tố
    hct: "", // Hematocrit
    mcv: "", 
    mch: "",
    mchc: "",
    nrbc: "", // Hồng cầu có nhân
    reticulocytes: "", // Hồng cầu lưới
    
    wbc: "", // Số lượng BC
    neutrophils: "",
    eosinophils: "",
    basophils: "",
    monocytes: "",
    lymphocytes: "",
    abnormalCells: "", // Tế bào bất thường
    
    plt: "", // Số lượng tiểu cầu
    esr1: "", // Máu lắng giờ 1
    esr2: "", // Máu lắng giờ 2
    malaria: "", // KSV sốt rét

    // 2. Đông máu
    bleedingTime: "", // Thời gian máu chảy
    clottingTime: "", // Thời gian máu đông

    // 3. Nhóm máu
    bloodGroupABO: "",
    bloodGroupRh: "",

    doctor: "",
    technician: "", // Trưởng khoa xét nghiệm
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
                testNumber: "",
                isEmergency: false,
                patientName: defaultPatientName,
                age: defaultAge?.toString() || "",
                gender: defaultGender,
                address: defaultAddress,
                insuranceCard1: "", insuranceCard2: "", insuranceCard3: "", insuranceCard4: "", insuranceCard5: "",
                department: "",
                room: "",
                bed: "",
                diagnosis: "",
                
                check_rbc: false, check_hgb: false, check_hct: false, check_mcv: false, check_mch: false, check_mchc: false, check_nrbc: false, check_reticulocytes: false,
                check_wbc: false, check_neutrophils: false, check_eosinophils: false, check_basophils: false, check_monocytes: false, check_lymphocytes: false, check_abnormalCells: false,
                check_plt: false, check_esr: false, check_malaria: false,
                check_bleedingTime: false, check_clottingTime: false,
                check_bloodGroupABO: false, check_bloodGroupRh: false,

                rbc: "", hgb: "", hct: "", mcv: "", mch: "", mchc: "", nrbc: "", reticulocytes: "",
                wbc: "", neutrophils: "", eosinophils: "", basophils: "", monocytes: "", lymphocytes: "", abnormalCells: "",
                plt: "", esr1: "", esr2: "", malaria: "",
                
                bleedingTime: "", clottingTime: "",
                bloodGroupABO: "", bloodGroupRh: "",

                doctor: "",
                technician: "",
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

  const handleCheckChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCheckboxChange = (checked: boolean) => {
      setFormData(prev => ({ ...prev, isEmergency: checked }));
  }

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
        
        const printWidth = pdfWidth; 
        const printHeight = (imgHeight * pdfWidth) / imgWidth;

        pdf.addImage(imgData, "PNG", 0, 0, printWidth, printHeight);
        
        const file = new File([pdf.output("blob")], `XNHuyetHoc_${formData.patientName}_${Date.now()}.pdf`, { type: "application/pdf" });
        onSave(file, formData);
        onClose();
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] !max-w-none max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Phiếu Xét Nghiệm Huyết Học</DialogTitle>
          <DialogDescription>Nhập kết quả xét nghiệm huyết học</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 items-start border-b border-gray-100 pb-4">
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

            <div className="text-center space-y-1">
              <h2 className="text-sm font-bold uppercase">Phiếu xét nghiệm</h2>
              <h3 className="text-base font-bold uppercase text-vlu-red">Huyết học</h3>
            </div>

            <div className="space-y-1 text-right">
              <p className="text-xs font-bold">MS: 17/BV-02</p>
              <div className="flex items-center justify-end gap-2">
                <Label className="shrink-0 text-xs">Số:</Label>
                <Input name="testNumber" value={formData.testNumber} onChange={handleChange} className="w-24 h-7 text-xs border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 text-right" placeholder="................" disabled={readOnly} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-start gap-8 text-sm pl-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="normal" checked={!formData.isEmergency} onCheckedChange={() => handleCheckboxChange(false)} disabled={readOnly} />
                <label htmlFor="normal" className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Thường</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="emergency" checked={formData.isEmergency} onCheckedChange={() => handleCheckboxChange(true)} disabled={readOnly} />
                <label htmlFor="emergency" className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Cấp cứu</label>
              </div>
          </div>

          {/* Patient Info */}
          <div className="space-y-3">
             <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 flex items-end gap-2 min-w-[200px]">
                <Label className="shrink-0">Họ tên người bệnh:</Label>
                <Input name="patientName" value={formData.patientName} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 font-bold uppercase" disabled={readOnly} />
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

            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 flex items-end gap-2">
                    <Label className="shrink-0">Địa chỉ:</Label>
                    <Input name="address" value={formData.address} onChange={handleChange} className="border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0" disabled={readOnly} />
                </div>
                <div className="flex-1 flex items-end gap-2">
                    <Label className="shrink-0">Số thẻ BHYT:</Label>
                    <div className="flex flex-1 items-end">
                        <Input name="insuranceCard1" value={formData.insuranceCard1} onChange={handleChange} className="w-16 border-r-0 rounded-r-none text-center px-1 focus-visible:ring-0" maxLength={2} disabled={readOnly} />
                        <Input name="insuranceCard2" value={formData.insuranceCard2} onChange={handleChange} className="w-16 border-r-0 rounded-none text-center px-1 focus-visible:ring-0" maxLength={1} disabled={readOnly} />
                        <Input name="insuranceCard3" value={formData.insuranceCard3} onChange={handleChange} className="w-16 border-r-0 rounded-none text-center px-1 focus-visible:ring-0" maxLength={2} disabled={readOnly} />
                        <Input name="insuranceCard4" value={formData.insuranceCard4} onChange={handleChange} className="w-16 border-r-0 rounded-none text-center px-1 focus-visible:ring-0" maxLength={2} disabled={readOnly} />
                        <Input name="insuranceCard5" value={formData.insuranceCard5} onChange={handleChange} className="flex-1 rounded-l-none px-2 focus-visible:ring-0" maxLength={10} disabled={readOnly} />
                    </div>
                </div>
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

          {/* Body Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-6">
            
            {/* Column 1: RBC Series */}
            <div className="space-y-4">
                <h4 className="font-bold">1. Tế bào máu ngoại vi:</h4>
                <div className="border border-gray-300 rounded p-4 space-y-3 bg-gray-50/50">
                    <div className="grid grid-cols-3 gap-2 items-center text-sm font-semibold border-b border-gray-300 pb-2 mb-2">
                        <div className="col-span-2">Chỉ số</div>
                        <div className="text-center">Kết quả</div>
                    </div>

                    {[
                        { label: "Số lượng HC", sub: "nam (4,0-5,8); nữ (3,9-5,4 x10^12/l)", name: "rbc", check: "check_rbc" },
                        { label: "Huyết sắc tố", sub: "nam (140-160); nữ (125-145 g/l)", name: "hgb", check: "check_hgb" },
                        { label: "Hematocrit", sub: "nam (0,38-0,50); nữ (0,35-0,47 l/l)", name: "hct", check: "check_hct" },
                        { label: "MCV", sub: "(83-92 fl)", name: "mcv", check: "check_mcv" },
                        { label: "MCH", sub: "(27-32 pg)", name: "mch", check: "check_mch" },
                        { label: "MCHC", sub: "(320-356 g/l)", name: "mchc", check: "check_mchc" },
                        { label: "Hồng cầu có nhân", sub: "(0 x 10^9/l)", name: "nrbc", check: "check_nrbc" },
                        { label: "Hồng cầu lưới", sub: "(0,1-0,5 %)", name: "reticulocytes", check: "check_reticulocytes" },
                    ].map(item => (
                        <div key={item.name} className="grid grid-cols-3 gap-2 items-start text-sm">
                            <div className="col-span-2">
                                <span className="font-medium flex items-center">
                                    <Checkbox 
                                        checked={(formData as any)[item.check]} 
                                        onCheckedChange={(c) => handleCheckChange(item.check, c as boolean)}
                                        className="mr-2 h-4 w-4 rounded-sm border-gray-400" 
                                        disabled={readOnly}
                                    />
                                    {item.label}
                                </span>
                                <div className="text-xs text-gray-500 italic ml-6">{item.sub}</div>
                            </div>
                            <Input name={item.name} value={(formData as any)[item.name]} onChange={handleChange} className="h-8 text-center bg-white" disabled={readOnly} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Column 2: WBC Series & Others */}
            <div className="space-y-4">
                {/* Spacer */}
                <h4 className="font-bold text-transparent select-none">.</h4> 
                <div className="border border-gray-300 rounded p-4 space-y-3 bg-gray-50/50">
                     <div className="grid grid-cols-3 gap-2 items-center text-sm font-semibold border-b border-gray-300 pb-2 mb-2">
                        <div className="col-span-2">Chỉ số</div>
                        <div className="text-center">Kết quả</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-start text-sm">
                        <div className="col-span-2">
                            <span className="font-medium flex items-center">
                                <Checkbox 
                                    checked={formData.check_wbc} 
                                    onCheckedChange={(c) => handleCheckChange("check_wbc", c as boolean)}
                                    className="mr-2 h-4 w-4 rounded-sm border-gray-400" 
                                    disabled={readOnly}
                                />
                                Số lượng BC
                            </span>
                            <div className="text-xs text-gray-500 italic ml-6">(4-10 x 10^9/l)</div>
                        </div>
                        <Input name="wbc" value={formData.wbc} onChange={handleChange} className="h-8 text-center bg-white" disabled={readOnly} />
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm font-medium flex items-center">
                            <span className="inline-block w-4 h-4 mr-2"></span> {/* Placeholder alignment */}
                            Thành phần bạch cầu (%):
                        </div>
                        {[
                            { label: "- Đoạn trung tính", name: "neutrophils" },
                            { label: "- Đoạn ưa a xít", name: "eosinophils" },
                            { label: "- Đoạn ưa ba zơ", name: "basophils" },
                            { label: "- Mono", name: "monocytes" },
                            { label: "- Lympho", name: "lymphocytes" },
                            { label: "- Tế bào bất thường", name: "abnormalCells" },
                        ].map(item => (
                            <div key={item.name} className="grid grid-cols-3 gap-2 items-center text-sm">
                                <div className="col-span-2 pl-6 text-gray-700 flex items-center">
                                    {item.label}
                                </div>
                                <Input name={item.name} value={(formData as any)[item.name]} onChange={handleChange} className="h-7 text-center bg-white" disabled={readOnly} />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-start text-sm border-t border-gray-200 pt-2">
                        <div className="col-span-2">
                            <span className="font-medium flex items-center">
                                <Checkbox 
                                    checked={formData.check_plt} 
                                    onCheckedChange={(c) => handleCheckChange("check_plt", c as boolean)}
                                    className="mr-2 h-4 w-4 rounded-sm border-gray-400" 
                                    disabled={readOnly}
                                />
                                Số lượng tiểu cầu
                            </span>
                            <div className="text-xs text-gray-500 italic ml-6">(150-400 x10^9/l)</div>
                        </div>
                        <Input name="plt" value={formData.plt} onChange={handleChange} className="h-8 text-center bg-white" disabled={readOnly} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-start text-sm">
                        <div className="col-span-2">
                            <span className="font-medium flex items-center">
                                <Checkbox 
                                    checked={formData.check_esr} 
                                    onCheckedChange={(c) => handleCheckChange("check_esr", c as boolean)}
                                    className="mr-2 h-4 w-4 rounded-sm border-gray-400" 
                                    disabled={readOnly}
                                />
                                Máu lắng:
                            </span>
                            <div className="text-xs text-gray-500 italic ml-6">giờ 1 (&lt; 15 mm) / giờ 2 (&lt; 20 mm)</div>
                        </div>
                        <div className="flex gap-1">
                             <Input name="esr1" value={formData.esr1} onChange={handleChange} className="h-8 text-center bg-white w-1/2" placeholder="1h" disabled={readOnly} />
                             <Input name="esr2" value={formData.esr2} onChange={handleChange} className="h-8 text-center bg-white w-1/2" placeholder="2h" disabled={readOnly} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-start text-sm">
                        <div className="col-span-2 font-medium flex items-center">
                            <Checkbox 
                                checked={formData.check_malaria} 
                                onCheckedChange={(c) => handleCheckChange("check_malaria", c as boolean)}
                                className="mr-2 h-4 w-4 rounded-sm border-gray-400" 
                                disabled={readOnly}
                            />
                            KSV sốt rét:
                        </div>
                        <Input name="malaria" value={formData.malaria} onChange={handleChange} className="h-8 text-center bg-white" disabled={readOnly} />
                    </div>
                </div>
            </div>
          </div>

          {/* Section 2 & 3: Coagulation & Blood Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                  <h4 className="font-bold">2. Đông máu:</h4>
                  <div className="space-y-2 text-sm pl-4">
                      <div className="flex items-center gap-2">
                          <Checkbox 
                                checked={formData.check_bleedingTime} 
                                onCheckedChange={(c) => handleCheckChange("check_bleedingTime", c as boolean)}
                                className="mr-1 h-4 w-4 rounded-sm border-gray-400" 
                                disabled={readOnly}
                            />
                          <span>Thời gian máu chảy:</span>
                          <Input name="bleedingTime" value={formData.bleedingTime} onChange={handleChange} className="w-20 h-7 inline-block" disabled={readOnly} />
                          <span>phút</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <Checkbox 
                                checked={formData.check_clottingTime} 
                                onCheckedChange={(c) => handleCheckChange("check_clottingTime", c as boolean)}
                                className="mr-1 h-4 w-4 rounded-sm border-gray-400" 
                                disabled={readOnly}
                            />
                          <span>Thời gian máu đông:</span>
                          <Input name="clottingTime" value={formData.clottingTime} onChange={handleChange} className="w-20 h-7 inline-block" disabled={readOnly} />
                          <span>phút</span>
                      </div>
                  </div>
              </div>

              <div className="space-y-3">
                  <h4 className="font-bold">3. Nhóm máu:</h4>
                  <div className="space-y-2 text-sm pl-4">
                      <div className="flex items-center gap-2">
                          <Checkbox 
                                checked={formData.check_bloodGroupABO} 
                                onCheckedChange={(c) => handleCheckChange("check_bloodGroupABO", c as boolean)}
                                className="mr-1 h-4 w-4 rounded-sm border-gray-400" 
                                disabled={readOnly}
                            />
                          <span>Hệ ABO:</span>
                          <Input name="bloodGroupABO" value={formData.bloodGroupABO} onChange={handleChange} className="w-24 h-7 inline-block" disabled={readOnly} />
                      </div>
                      <div className="flex items-center gap-2">
                          <Checkbox 
                                checked={formData.check_bloodGroupRh} 
                                onCheckedChange={(c) => handleCheckChange("check_bloodGroupRh", c as boolean)}
                                className="mr-1 h-4 w-4 rounded-sm border-gray-400" 
                                disabled={readOnly}
                            />
                          <span>Hệ Rh:</span>
                          <Input name="bloodGroupRh" value={formData.bloodGroupRh} onChange={handleChange} className="w-24 h-7 inline-block" disabled={readOnly} />
                      </div>
                  </div>
              </div>
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-start pt-6 border-t border-gray-200 mt-4">
                <div className="text-center w-1/3 space-y-2">
                    <div className="flex justify-center gap-1 italic text-sm mb-2">
                        <span>....... Giờ ........ ngày</span>
                        <Input name="requestDateDay" value={formData.requestDateDay} onChange={handleChange} className="w-8 h-5 p-0 text-center border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0" disabled={readOnly} />
                        <span>tháng</span>
                        <Input name="requestDateMonth" value={formData.requestDateMonth} onChange={handleChange} className="w-8 h-5 p-0 text-center border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0" disabled={readOnly} />
                        <span>năm</span>
                        <Input name="requestDateYear" value={formData.requestDateYear} onChange={handleChange} className="w-12 h-5 p-0 text-center border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0" disabled={readOnly} />
                    </div>
                    <p className="font-bold uppercase text-sm">Bác sĩ điều trị</p>
                    <div className="pt-16">
                         <div className="flex items-center gap-2 justify-center">
                            <span className="text-sm">Họ tên</span>
                            <Input name="doctor" value={formData.doctor} onChange={handleChange} placeholder="........................" className="text-center border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 w-32" disabled={readOnly} />
                         </div>
                    </div>
                </div>

                <div className="text-center w-1/3 space-y-2">
                    <div className="flex justify-center gap-1 italic text-sm mb-2">
                        <span>....... Giờ ........ ngày</span>
                        <Input name="resultDateDay" value={formData.resultDateDay} onChange={handleChange} className="w-8 h-5 p-0 text-center border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0" disabled={readOnly} />
                        <span>tháng</span>
                        <Input name="resultDateMonth" value={formData.resultDateMonth} onChange={handleChange} className="w-8 h-5 p-0 text-center border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0" disabled={readOnly} />
                        <span>năm</span>
                        <Input name="resultDateYear" value={formData.resultDateYear} onChange={handleChange} className="w-12 h-5 p-0 text-center border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0" disabled={readOnly} />
                    </div>
                    <p className="font-bold uppercase text-sm">Trưởng khoa xét nghiệm</p>
                    <div className="pt-16">
                         <div className="flex items-center gap-2 justify-center">
                            <span className="text-sm">Họ tên</span>
                            <Input name="technician" value={formData.technician} onChange={handleChange} placeholder="........................" className="text-center border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 w-32" disabled={readOnly} />
                         </div>
                    </div>
                </div>
          </div>
          
          <div className="text-xs text-gray-500 italic border-t border-gray-200 pt-2 mt-4 space-y-1">
            <p className="font-bold underline">Hướng dẫn:</p>
            <p>- Quy ước quốc tế: số lượng hồng cầu, bạch cầu... tính trong đơn vị lít (l).</p>
            <p>- Vì: 1.000.000.000 = 10^9 = G (Giga); 1.000.000.000.000 = 10^12 = T (Tera).</p>
            <p>- Số lượng hồng cầu trước đây tính trong 1ml, ví dụ là 4 triệu; nay quy ra trong 1 lít là 4 triệu triệu/ l hay 4 x 10^12/ l hay 4T/l.</p>
          </div>
        </div>

        {/* Hidden Print Template */}
        <div 
            ref={printRef}
            className="fixed"
            style={{
                position: 'fixed',
                left: '-10000px',
                top: '0',
                width: '210mm',
                padding: '10mm',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontFamily: 'Times New Roman, serif',
                fontSize: '11pt',
                lineHeight: '1.2',
                ['--background' as any]: '#ffffff',
                ['--foreground' as any]: '#000000',
            }}
        >
            <div>
                 {/* Header */}
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ width: '30%' }}>
                        <p style={{ margin: 0 }}>Sở Y tế: {formData.healthDept}</p>
                        <p style={{ margin: 0 }}>BV: {formData.hospital}</p>
                    </div>
                    <div style={{ width: '40%', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '13pt', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Phiếu Xét Nghiệm</h1>
                        <h2 style={{ fontSize: '13pt', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Huyết Học</h2>
                    </div>
                    <div style={{ width: '30%', textAlign: 'right' }}>
                         <p style={{ margin: 0, fontWeight: 'bold' }}>MS: 17/BV-02</p>
                         <p style={{ margin: 0 }}>Số: {formData.testNumber}</p>
                    </div>
                </div>

                <div style={{ marginTop: '5px', marginBottom: '10px', fontSize: '10pt' }}>
                     <span style={{ marginRight: '30px' }}>
                        <span style={{ verticalAlign: 'middle' }}>Thường: </span>
                        <span style={{ border: '1px solid #000', width: '14px', height: '14px', display: 'inline-block', textAlign: 'center', lineHeight: '12px', fontSize: '12px', verticalAlign: 'middle', marginLeft: '5px' }}>
                            {formData.isEmergency ? '' : 'x'}
                        </span>
                     </span>
                     <span>
                        <span style={{ verticalAlign: 'middle' }}>Cấp cứu: </span>
                        <span style={{ border: '1px solid #000', width: '14px', height: '14px', display: 'inline-block', textAlign: 'center', lineHeight: '12px', fontSize: '12px', verticalAlign: 'middle', marginLeft: '5px' }}>
                            {formData.isEmergency ? 'x' : ''}
                        </span>
                     </span>
                </div>

                {/* Patient Info */}
                <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <div style={{ flex: 1 }}>- Họ tên người bệnh: <b style={{ textTransform: 'uppercase' }}>{formData.patientName}</b></div>
                        <div style={{ width: '15%' }}>Tuổi: {formData.age}</div>
                        <div style={{ width: '15%', textAlign: 'right' }}>Nam/Nữ: {formData.gender}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <div style={{ flex: 1 }}>- Địa chỉ: {formData.address}</div>
                        <div style={{ width: '40%' }}>Số thẻ BHYT: {formData.insuranceCard1} {formData.insuranceCard2} {formData.insuranceCard3} {formData.insuranceCard4} {formData.insuranceCard5}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <div style={{ flex: 1 }}>- Khoa: {formData.department}</div>
                        <div style={{ width: '25%' }}>Buồng: {formData.room}</div>
                        <div style={{ width: '25%', textAlign: 'right' }}>Giường: {formData.bed}</div>
                    </div>
                    <div>- Chẩn đoán: {formData.diagnosis}</div>
                </div>

                {/* Content Body - Table Layout for PDF */}
                <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>1. Tế bào máu ngoại vi:</div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', border: '1px solid black' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'left', width: '30%' }}>Chỉ số</th>
                            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center', width: '20%' }}>Kết quả</th>
                            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'left', width: '30%' }}>Chỉ số</th>
                            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center', width: '20%' }}>Kết quả</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            // Row 1
                            { 
                                l1: { l: "Số lượng HC", s: "nam (4,0-5,8); nữ (3,9-5,4 x10^12/l)", c: formData.check_rbc }, v1: formData.rbc,
                                l2: { l: "Số lượng BC", s: "(4-10 x 10^9/l)", c: formData.check_wbc }, v2: formData.wbc
                            },
                            // Row 2
                            { 
                                l1: { l: "Huyết sắc tố", s: "nam (140-160); nữ (125-145 g/l)", c: formData.check_hgb }, v1: formData.hgb,
                                l2: { type: 'header', l: "Thành phần bạch cầu (%):" }, v2: null
                            },
                            // Row 3
                            { 
                                l1: { l: "Hematocrit", s: "nam (0,38-0,50); nữ (0,35-0,47 l/l)", c: formData.check_hct }, v1: formData.hct,
                                l2: { l: "- Đoạn trung tính", c: null, indent: true }, v2: formData.neutrophils
                            },
                            // Row 4
                            { 
                                l1: { l: "MCV", s: "(83-92 fl)", c: formData.check_mcv }, v1: formData.mcv,
                                l2: { l: "- Đoạn ưa a xít", c: null, indent: true }, v2: formData.eosinophils
                            },
                            // Row 5
                            { 
                                l1: { l: "MCH", s: "(27-32 pg)", c: formData.check_mch }, v1: formData.mch,
                                l2: { l: "- Đoạn ưa ba zơ", c: null, indent: true }, v2: formData.basophils
                            },
                            // Row 6
                            { 
                                l1: { l: "MCHC", s: "(320-356 g/l)", c: formData.check_mchc }, v1: formData.mchc,
                                l2: { l: "- Mono", c: null, indent: true }, v2: formData.monocytes
                            },
                            // Row 7
                            { 
                                l1: { l: "Hồng cầu có nhân", s: "(0 x 10^9/l)", c: formData.check_nrbc }, v1: formData.nrbc,
                                l2: { l: "- Lympho", c: null, indent: true }, v2: formData.lymphocytes
                            },
                            // Row 8
                            { 
                                l1: { l: "Hồng cầu lưới", s: "(0,1-0,5 %)", c: formData.check_reticulocytes }, v1: formData.reticulocytes,
                                l2: { l: "- Tế bào bất thường", c: null, indent: true }, v2: formData.abnormalCells
                            },
                            // Row 9
                            { 
                                l1: null, v1: null,
                                l2: { l: "Số lượng tiểu cầu", s: "(150-400 x10^9/l)", c: formData.check_plt }, v2: formData.plt
                            },
                            // Row 10 (ESR special case)
                            { 
                                l1: null, v1: null,
                                l2: { type: 'esr', l: "Máu lắng", c: formData.check_esr }, v2: { v1: formData.esr1, v2: formData.esr2 }
                            },
                            // Row 11
                            { 
                                l1: null, v1: null,
                                l2: { l: "KSV sốt rét", c: formData.check_malaria }, v2: formData.malaria
                            },
                        ].map((row, idx) => (
                            <tr key={idx}>
                                {/* Left Side */}
                                <td style={{ border: '1px solid black', padding: '4px', verticalAlign: 'middle' }}>
                                    {row.l1 && (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{ border: '1px solid #000', width: '12px', height: '12px', display: 'inline-block', textAlign: 'center', lineHeight: '10px', fontSize: '10px', verticalAlign: 'middle', marginRight: '5px' }}>
                                                    {row.l1.c ? 'x' : ''}
                                                </span>
                                                <span style={{ verticalAlign: 'middle' }}>{row.l1.l}</span>
                                            </div>
                                            {row.l1.s && <div style={{ fontSize: '9pt', fontStyle: 'italic', color: '#444', marginLeft: '20px' }}>{row.l1.s}</div>}
                                        </>
                                    )}
                                </td>
                                <td style={{ border: '1px solid black', padding: '4px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle' }}>
                                    {row.v1}
                                </td>

                                {/* Right Side */}
                                <td style={{ border: '1px solid black', padding: '4px', verticalAlign: 'middle' }}>
                                    {row.l2 && (
                                        <>
                                            {row.l2.type === 'header' ? (
                                                <div style={{ fontStyle: 'italic' }}>{row.l2.l}</div>
                                            ) : row.l2.type === 'esr' ? (
                                                <>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <span style={{ border: '1px solid #000', width: '12px', height: '12px', display: 'inline-block', textAlign: 'center', lineHeight: '10px', fontSize: '10px', verticalAlign: 'middle', marginRight: '5px' }}>
                                                            {row.l2.c ? 'x' : ''}
                                                        </span>
                                                        <span style={{ verticalAlign: 'middle' }}>{row.l2.l}</span>
                                                    </div>
                                                    <div style={{ fontSize: '9pt', fontStyle: 'italic', paddingLeft: '20px' }}>giờ 1 (&lt; 15 mm)</div>
                                                    <div style={{ fontSize: '9pt', fontStyle: 'italic', paddingLeft: '20px' }}>giờ 2 (&lt; 20 mm)</div>
                                                </>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: row.l2.indent ? '20px' : '0' }}>
                                                    {row.l2.c !== null && (
                                                        <span style={{ border: '1px solid #000', width: '12px', height: '12px', display: 'inline-block', textAlign: 'center', lineHeight: '10px', fontSize: '10px', verticalAlign: 'middle', marginRight: '5px', flexShrink: 0 }}>
                                                            {row.l2.c ? 'x' : ''}
                                                        </span>
                                                    )}
                                                    <span style={{ verticalAlign: 'middle' }}>{row.l2.l}</span>
                                                </div>
                                            )}
                                            {row.l2.s && <div style={{ fontSize: '9pt', fontStyle: 'italic', color: '#444', marginLeft: '20px' }}>{row.l2.s}</div>}
                                        </>
                                    )}
                                </td>
                                <td style={{ border: '1px solid black', padding: '4px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle' }}>
                                    {row.l2?.type === 'esr' && typeof row.v2 === 'object' && row.v2 ? (
                                        <>
                                            <div style={{ marginBottom: '5px' }}>{(row.v2 as any).v1}</div>
                                            <div>{(row.v2 as any).v2}</div>
                                        </>
                                    ) : (
                                        row.v2 as React.ReactNode
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Section 2 & 3 - Side by Side */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '50%', verticalAlign: 'top', border: 'none', paddingRight: '10px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>2. Đông máu:</div>
                                <div style={{ paddingLeft: '15px' }}>
                                    <div style={{ marginBottom: '5px' }}>
                                        <span style={{ border: '1px solid #000', width: '12px', height: '12px', display: 'inline-block', textAlign: 'center', lineHeight: '10px', fontSize: '10px', verticalAlign: 'middle', marginRight: '5px' }}>
                                            {formData.check_bleedingTime ? 'x' : ''}
                                        </span>
                                        <span style={{ verticalAlign: 'middle' }}>Thời gian máu chảy: ...........{formData.bleedingTime}......... phút ............</span>
                                    </div>
                                    <div>
                                        <span style={{ border: '1px solid #000', width: '12px', height: '12px', display: 'inline-block', textAlign: 'center', lineHeight: '10px', fontSize: '10px', verticalAlign: 'middle', marginRight: '5px' }}>
                                            {formData.check_clottingTime ? 'x' : ''}
                                        </span>
                                        <span style={{ verticalAlign: 'middle' }}>Thời gian máu đông: ...........{formData.clottingTime}......... phút ............</span>
                                    </div>
                                </div>
                            </td>
                            <td style={{ width: '50%', verticalAlign: 'top', border: 'none', paddingLeft: '10px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>3. Nhóm máu:</div>
                                <div style={{ paddingLeft: '15px' }}>
                                    <div style={{ marginBottom: '5px' }}>
                                        <span style={{ border: '1px solid #000', width: '12px', height: '12px', display: 'inline-block', textAlign: 'center', lineHeight: '10px', fontSize: '10px', verticalAlign: 'middle', marginRight: '5px' }}>
                                            {formData.check_bloodGroupABO ? 'x' : ''}
                                        </span>
                                        <span style={{ verticalAlign: 'middle', marginRight: '5px' }}>Hệ ABO: <b>{formData.bloodGroupABO}</b></span>
                                    </div>
                                    <div>
                                        <span style={{ border: '1px solid #000', width: '12px', height: '12px', display: 'inline-block', textAlign: 'center', lineHeight: '10px', fontSize: '10px', verticalAlign: 'middle', marginRight: '5px' }}>
                                            {formData.check_bloodGroupRh ? 'x' : ''}
                                        </span>
                                        <span style={{ verticalAlign: 'middle', marginRight: '5px' }}>Hệ Rh: <b>{formData.bloodGroupRh}</b></span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Footer Signatures */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt' }}>
                    <div style={{ textAlign: 'center', width: '45%' }}>
                        <div>....... Giờ ........ ngày {formData.requestDateDay} tháng {formData.requestDateMonth} năm {formData.requestDateYear}</div>
                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase', marginTop: '5px' }}>Bác sĩ điều trị</div>
                        <div style={{ height: '25mm' }}></div>
                        <div>Họ tên: {formData.doctor}</div>
                    </div>
                    <div style={{ textAlign: 'center', width: '45%' }}>
                        <div>....... Giờ ........ ngày {formData.resultDateDay} tháng {formData.resultDateMonth} năm {formData.resultDateYear}</div>
                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase', marginTop: '5px' }}>Trưởng khoa xét nghiệm</div>
                        <div style={{ height: '25mm' }}></div>
                        <div>Họ tên: {formData.technician}</div>
                    </div>
                </div>

                {/* Instructions */}
                <div style={{ marginTop: '20px', fontSize: '9pt', borderTop: '1px solid #000', paddingTop: '5px' }}>
                    <b>Hướng dẫn:</b>
                    <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                        <li>Quy ước quốc tế: số lượng hồng cầu, bạch cầu... tính trong đơn vị lít (l).</li>
                        <li>Vì: 1.000.000.000 = 10^9 = G (Giga); 1.000.000.000.000 = 10^12 = T (Tera).</li>
                        <li>Số lượng hồng cầu trước đây tính trong 1ml, ví dụ là 4 triệu; nay quy ra trong 1 lít là 4 triệu triệu/ l hay 4 x 10^12/ l hay 4T/l.</li>
                    </ul>
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