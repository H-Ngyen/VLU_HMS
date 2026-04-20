import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, User as UserIcon } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";
import type { User } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AssignUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  departmentId: number;
  mode: "member" | "head";
}

export const AssignUserDialog = ({
  open,
  onOpenChange,
  onSuccess,
  departmentId,
  mode,
}: AssignUserDialogProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.identities.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
      setSearchTerm("");
    }
  }, [open]);

  const filteredUsers = users.filter((u) => 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (mode === "head" ? true : u.departmentId !== departmentId)
  );

  const handleAssign = async (userId: number) => {
    setSubmittingId(userId);
    try {
      if (mode === "head") {
        await api.departments.assignHead(departmentId, userId);
        toast.success("Gán trưởng khoa thành công");
      } else {
        await api.departments.assignUser(departmentId, userId);
        toast.success("Thêm nhân viên vào khoa thành công");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to assign user:", error);
      toast.error(error.message || "Lỗi khi thực hiện gán");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] flex flex-col h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {mode === "head" ? "Chọn Trưởng Khoa" : "Thêm Nhân Viên Vào Khoa"}
          </DialogTitle>
          <DialogDescription>
            {mode === "head" ? "Chọn một người dùng để làm trưởng khoa." : "Chọn nhân viên để thêm vào khoa."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ScrollArea className="flex-1 pr-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-vlu-red" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <UserIcon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{user.name}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                      {user.departmentName && (
                        <span className="text-[10px] text-blue-600 font-medium">
                          Thuộc: {user.departmentName}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAssign(user.id)}
                    disabled={submittingId !== null}
                    className="h-8"
                  >
                    {submittingId === user.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Chọn"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">Không tìm thấy người dùng phù hợp.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
