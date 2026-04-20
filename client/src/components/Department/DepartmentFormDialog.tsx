import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Department } from "@/types";

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newId?: number) => void;
  department?: Department; // If provided, we are editing
}

export const DepartmentFormDialog = ({
  open,
  onOpenChange,
  onSuccess,
  department,
}: DepartmentFormDialogProps) => {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (department) {
      setName(department.name);
    } else {
      setName("");
    }
  }, [department, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      if (department) {
        await api.departments.update(department.id, name);
        toast.success("Cập nhật khoa thành công");
        onSuccess();
      } else {
        const newId = await api.departments.create(name);
        toast.success("Thêm khoa mới thành công. Vui lòng chọn Trưởng khoa.");
        onSuccess(newId);
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save department:", error);
      toast.error(error.message || "Lỗi khi lưu thông tin khoa");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{department ? "Chỉnh sửa Khoa" : "Thêm Khoa Mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên Khoa</Label>
            <Input
              id="name"
              placeholder="VD: KHOA XÉT NGHIỆM"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={submitting} className="bg-vlu-red hover:bg-red-700">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {department ? "Lưu thay đổi" : "Tạo Khoa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
