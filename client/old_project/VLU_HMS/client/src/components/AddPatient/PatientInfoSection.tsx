import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PatientInfoProps {
  formData: any;
  handleChange: (field: string, value: string | number) => void;
}

export const PatientInfoSection = ({ formData, handleChange }: PatientInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="font-bold text-gray-500 w-6">1.</span>
        <div className="flex-1">
          <Label className="mb-1.5 block">Họ và tên (In hoa) <span className="text-red-500">*</span></Label>
          <Input 
            required
            className="uppercase font-bold"
            placeholder="NGUYỄN VĂN A"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value.toUpperCase())}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold text-gray-500 w-6">2.</span>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label className="mb-1.5 block">Sinh ngày</Label>
            <Input 
              type="date" 
              value={formData.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1.5 block">Tuổi</Label>
            <Input 
              readOnly
              className="bg-gray-50"
              value={formData.age}
              placeholder="Auto"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold text-gray-500 w-6">3.</span>
        <div className="flex-1">
          <Label className="mb-2 block">Giới tính</Label>
          <RadioGroup 
            value={formData.gender} 
            onValueChange={(val) => handleChange('gender', val)}
            className="flex gap-6 mt-1.5"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Nam" id="r1" />
              <Label htmlFor="r1" className="font-normal cursor-pointer">Nam</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Nữ" id="r2" />
              <Label htmlFor="r2" className="font-normal cursor-pointer">Nữ</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold text-gray-500 w-6">4.</span>
        <div className="flex-1 grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label className="mb-1.5 block">Nghề nghiệp</Label>
            <Input 
              value={formData.job}
              onChange={(e) => handleChange('job', e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1.5 block">Mã nghề</Label>
            <Input 
              value={formData.jobCode}
              onChange={(e) => handleChange('jobCode', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold text-gray-500 w-6">5.</span>
        <div className="flex-1">
          <Label className="mb-1.5 block">Dân tộc</Label>
          <Input 
            value={formData.ethnicity}
            onChange={(e) => handleChange('ethnicity', e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold text-gray-500 w-6">6.</span>
        <div className="flex-1">
          <Label className="mb-1.5 block">Ngoại kiều</Label>
          <Input 
            placeholder="Việt Nam"
            value={formData.nationality}
            onChange={(e) => handleChange('nationality', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
