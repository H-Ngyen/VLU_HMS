import { useState } from "react";
import type { User as UserType } from "@/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Save, Trash2, X } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import { StatusBadge } from "./StatusBadge";

interface UserTableRowProps {
  user: UserType;
  onUpdate: (username: string, updates: Partial<UserType>) => void;
  onDelete: (username: string) => void;
}

export const UserTableRow = ({ user, onUpdate, onDelete }: UserTableRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [selectedStatus, setSelectedStatus] = useState(user.status || "active");

  const handleSave = () => {
    onUpdate(user.username, { role: selectedRole, status: selectedStatus });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSelectedRole(user.role);
    setSelectedStatus(user.status || "active");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Xóa tài khoản ${user.username}?`)) {
      onDelete(user.username);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
      <TableCell className="font-mono text-xs text-gray-600">
        {user.username}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Sinh Viên</SelectItem>
              <SelectItem value="teacher">Giảng Viên</SelectItem>
              <SelectItem value="admin">Quản Trị Viên</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <RoleBadge role={user.role} />
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="locked">Khóa</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <StatusBadge status={user.status} />
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                title="Lưu"
              >
                <Save size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="h-8 w-8 text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                title="Hủy"
              >
                <X size={16} />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Sửa thông tin"
            >
              <Edit size={16} />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            title="Xóa tài khoản"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
