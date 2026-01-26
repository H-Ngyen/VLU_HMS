import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Record } from "@/types";

interface DischargeStatusSectionProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
  readOnly?: boolean;
}

export const DischargeStatusSection = ({ formData, setFormData, readOnly = false }: DischargeStatusSectionProps) => {
  const dischargeStatusInfo = formData.dischargeStatusInfo;

  const handleChange = (path: string[], value: any) => {
    if (readOnly) return;
    setFormData((prev) => {
      if (!prev) return null;
      
      const newDischargeStatusInfo = JSON.parse(JSON.stringify(prev.dischargeStatusInfo));
      
      let current = newDischargeStatusInfo;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;

      return {
        ...prev,
        dischargeStatusInfo: newDischargeStatusInfo,
      };
    });
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label>22. Kết quả điều trị</Label>
                <Select 
                  value={dischargeStatusInfo.treatmentResult} 
                  onValueChange={(val) => handleChange(['treatmentResult'], val)}
                  disabled={readOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kết quả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Khoi">Khỏi</SelectItem>
                    <SelectItem value="DoGiam">Đỡ, giảm</SelectItem>
                    <SelectItem value="KhongThayDoi">Không thay đổi</SelectItem>
                    <SelectItem value="NangHon">Nặng hơn</SelectItem>
                    <SelectItem value="TuVong">Tử vong</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>23. Giải phẫu bệnh (nếu có)</Label>
                <Input 
                   value={dischargeStatusInfo.pathology}
                   onChange={(e) => handleChange(['pathology'], e.target.value)}
                   disabled={readOnly}
                />
            </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
             <Label className="font-semibold text-gray-700 block">24. Tình hình tử vong (nếu có)</Label>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs">Thời gian tử vong</Label>
                    <Input 
                        type="datetime-local"
                        value={dischargeStatusInfo.deathStatus.time?.replace(" ", "T") || ""}
                        onChange={(e) => handleChange(['deathStatus', 'time'], e.target.value)}
                        disabled={readOnly}
                    />
                </div>
                 <div className="space-y-2">
                    <Label className="text-xs">Nguyên nhân chính</Label>
                    <Input 
                        value={dischargeStatusInfo.deathStatus.cause}
                        onChange={(e) => handleChange(['deathStatus', 'cause'], e.target.value)}
                        disabled={readOnly}
                    />
                </div>
             </div>
             
             <div className="space-y-2">
                 <Label className="text-xs">Nguyên nhân tử vong (ICD10)</Label>
                 <div className="grid grid-cols-[1fr_150px] gap-4">
                    <Input 
                        placeholder="Tên nguyên nhân"
                        value={dischargeStatusInfo.mainCauseOfDeath.name}
                        onChange={(e) => handleChange(['mainCauseOfDeath', 'name'], e.target.value)}
                        disabled={readOnly}
                    />
                    <Input 
                        placeholder="Mã ICD10"
                        className="font-mono text-center"
                        value={dischargeStatusInfo.mainCauseOfDeath.code}
                        onChange={(e) => handleChange(['mainCauseOfDeath', 'code'], e.target.value)}
                        disabled={readOnly}
                    />
                 </div>
             </div>
             
             <div className="flex gap-6">
                 <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isAutopsy" 
                      checked={dischargeStatusInfo.isAutopsy}
                      onCheckedChange={(checked) => handleChange(['isAutopsy'], checked)}
                      disabled={readOnly}
                    />
                    <label htmlFor="isAutopsy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Có khám nghiệm tử thi
                    </label>
                 </div>
             </div>
             
             {dischargeStatusInfo.isAutopsy && (
                 <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                     <Label className="text-xs">Chẩn đoán giải phẫu tử thi</Label>
                     <div className="grid grid-cols-[1fr_150px] gap-4">
                        <Input 
                            value={dischargeStatusInfo.autopsyDiagnosis.name}
                            onChange={(e) => handleChange(['autopsyDiagnosis', 'name'], e.target.value)}
                            disabled={readOnly}
                        />
                        <Input 
                            className="font-mono text-center"
                            value={dischargeStatusInfo.autopsyDiagnosis.code}
                            onChange={(e) => handleChange(['autopsyDiagnosis', 'code'], e.target.value)}
                            disabled={readOnly}
                        />
                     </div>
                 </div>
             )}
        </div>
      </CardContent>
    </Card>
  );
};
