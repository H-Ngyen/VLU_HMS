import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User as UserIcon, ShieldCheck, UserMinus, Loader2 } from "lucide-react";
import type { Department } from "@/types";
import { RoleBadge } from "../Account/RoleBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/services/api";

interface ViewMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department;
  onRefresh: () => void;
}

export const ViewMembersDialog = ({
  open,
  onOpenChange,
  department,
  onRefresh,
}: ViewMembersDialogProps) => {
  const { isAdmin, currentUser } = useAuth();
  const [removingId, setRemovingId] = useState<number | null>(null);
  const members = department.users || [];
  
  const isHeadOfThisDept = department.headUserId === currentUser?.id;
  const canManageMembers = isAdmin || isHeadOfThisDept;

  const handleRemoveMember = async (userId: number) => {
    setRemovingId(userId);
    try {
      await api.departments.removeUser(department.id, userId);
      toast.success("Đã gỡ thành viên khỏi khoa");
      onRefresh();
    } catch (error: any) {
      toast.error("Lỗi khi gỡ thành viên");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Thành viên khoa: {department.name}
            <span className="text-sm font-normal text-gray-500">
              ({members.length})
            </span>
          </DialogTitle>
          <DialogDescription>
            Danh sách nhân viên và giảng viên thuộc {department.name}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 mt-4 pr-4">
          {members.length > 0 ? (
            <div className="space-y-3">
              {members.map((user) => {
                const isHead = department.headUserId === user.id;
                return (
                  <div 
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isHead ? "border-red-100 bg-red-50/30" : "border-gray-100 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        isHead ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        <UserIcon size={20} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{user.name}</span>
                          {isHead && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                              <ShieldCheck size={10} /> Trưởng khoa
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <RoleBadge role={user.roleName} />
                      
                      {canManageMembers && !isHead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(user.id)}
                          disabled={removingId !== null}
                          className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          title="Gỡ khỏi khoa"
                        >
                          {removingId === user.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <UserMinus size={14} />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <UserIcon size={48} strokeWidth={1} className="mb-2 opacity-20" />
              <p>Khoa này chưa có nhân viên nào.</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
