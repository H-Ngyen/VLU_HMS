import { useState, useEffect } from "react";
import { Search, Loader2, Plus } from "lucide-react";
import { DepartmentTable } from "./DepartmentTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DepartmentFormDialog } from "./DepartmentFormDialog";
import { AssignUserDialog } from "./AssignUserDialog";
import type { Department } from "@/types";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const DepartmentManagementView = () => {
  const { isAdmin } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignHeadOpen, setIsAssignHeadOpen] = useState(false);
  const [newDepartmentId, setNewDepartmentId] = useState<number | null>(null);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await api.departments.getAll();
      setDepartments(data);
    } catch (error: any) {
      console.error("Failed to fetch departments:", error);
      toast.error("Không thể tải danh sách khoa");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (newId?: number) => {
    fetchDepartments();
    setIsDialogOpen(false); // Luôn đóng Dialog Tạo Khoa
    if (newId) {
      setNewDepartmentId(newId);
      setTimeout(() => setIsAssignHeadOpen(true), 150); // Mở Dialog Gán Trưởng Khoa sau một độ trễ nhỏ để UI mượt hơn
    }
  };

  const handleAssignHeadSuccess = () => {
    fetchDepartments();
    setNewDepartmentId(null);
    setIsAssignHeadOpen(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter((dept) => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.headUser?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vlu-red" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản Lý Khoa</h1>
          <p className="text-gray-500">
            Quản lý danh sách các khoa, trưởng khoa và nhân viên thuộc khoa.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <Input
              placeholder="Tìm kiếm khoa, trưởng khoa..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <Button onClick={() => setIsDialogOpen(true)} className="bg-vlu-red hover:bg-red-700">
              <Plus size={16} className="mr-2" /> Thêm Khoa
            </Button>
          )}
        </div>
      </div>

      <DepartmentTable 
        departments={filteredDepartments} 
        onRefresh={fetchDepartments}
      />

      <DepartmentFormDialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          // Không cho phép đóng Dialog tạo khoa nếu đang chờ gán Trưởng khoa
          if (!isAssignHeadOpen) {
            setIsDialogOpen(open);
          }
        }} 
        onSuccess={handleCreateSuccess}
      />

      {newDepartmentId && (
        <AssignUserDialog 
          open={isAssignHeadOpen} 
          onOpenChange={(open) => {
            // Không cho phép tắt Dialog gán trưởng khoa bằng cách click ra ngoài
            // Bắt buộc phải chọn trưởng khoa (hoặc xử lý nút Hủy cụ thể)
            if (!open) {
              toast.warning("Bạn chưa gán Trưởng khoa. Có thể gán sau trong Menu thao tác.");
              setIsAssignHeadOpen(false);
              setIsDialogOpen(false);
            }
          }} 
          onSuccess={handleAssignHeadSuccess}
          departmentId={newDepartmentId}
          mode="head"
        />
      )}
    </div>
  );
};
