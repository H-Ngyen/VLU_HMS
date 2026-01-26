import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface InsuranceInfoProps {
  formData: any;
  handleChange: (field: string, value: string) => void;
}

export const InsuranceInfoSection = ({ formData, handleChange }: InsuranceInfoProps) => {
  return (
    <>
      <div className="flex items-center gap-4">
        <span className="font-bold text-gray-500 w-6">9.</span>
        <div className="flex-1">
          <Label className="mb-2 block">Đối tượng</Label>
          <div className="flex flex-wrap gap-2">
            {['BHYT', 'Thu phí', 'Miễn', 'Khác'].map((type) => (
              <Button
                key={type}
                type="button"
                variant={formData.subjectType === type ? "default" : "outline"}
                className={formData.subjectType === type ? "bg-vlu-red hover:bg-red-700 text-white" : ""}
                onClick={() => handleChange('subjectType', type)}
                size="sm"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <span className="font-bold text-gray-500 w-6">10.</span>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block">BHYT giá trị đến ngày</Label>
            <Input 
              type="date" 
              value={formData.insuranceExpiry}
              onChange={(e) => handleChange('insuranceExpiry', e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1.5 block">Số thẻ BHYT</Label>
            <Input 
              value={formData.insuranceNumber}
              onChange={(e) => handleChange('insuranceNumber', e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
