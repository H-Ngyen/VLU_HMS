import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressInfoProps {
  formData: any;
  handleChange: (field: string, value: string) => void;
}

export const AddressInfoSection = ({ formData, handleChange }: AddressInfoProps) => {
  return (
    <>
      <div className="flex items-start gap-4 mt-2">
        <span className="font-bold text-gray-500 w-6 mt-8">7.</span>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <Label className="mb-1.5 block">Số nhà, đường phố / Thôn, ấp</Label>
            <Input 
              value={formData.addressStreet}
              onChange={(e) => handleChange('addressStreet', e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1.5 block">Xã, phường</Label>
            <Input 
              value={formData.addressWard}
              onChange={(e) => handleChange('addressWard', e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1.5 block">Huyện (Q, Tx)</Label>
            <Input 
              value={formData.addressDistrict}
              onChange={(e) => handleChange('addressDistrict', e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1.5 block">Tỉnh, thành phố</Label>
            <Input 
              value={formData.addressProvince}
              onChange={(e) => handleChange('addressProvince', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <span className="font-bold text-gray-500 w-6">8.</span>
        <div className="flex-1">
          <Label className="mb-1.5 block">Nơi làm việc</Label>
          <Input 
            value={formData.workplace}
            onChange={(e) => handleChange('workplace', e.target.value)}
          />
        </div>
      </div>
    </>
  );
};