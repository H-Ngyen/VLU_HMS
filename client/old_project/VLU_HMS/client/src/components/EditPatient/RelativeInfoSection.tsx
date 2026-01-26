import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RelativeInfoProps {
  formData: any;
  handleChange: (field: string, value: string) => void;
}

export const RelativeInfoSection = ({ formData, handleChange }: RelativeInfoProps) => {
  return (
    <div className="flex items-start gap-4 mt-6">
      <span className="font-bold text-gray-500 w-6 mt-8">11.</span>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label className="mb-1.5 block">Họ tên, địa chỉ người nhà cần báo tin</Label>
          <Textarea 
            rows={2}
            value={formData.relativeInfo}
            onChange={(e) => handleChange('relativeInfo', e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-1.5 block">Điện thoại số</Label>
          <Input 
            value={formData.relativePhone}
            onChange={(e) => handleChange('relativePhone', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};