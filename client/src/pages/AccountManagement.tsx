import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Trash2,
  Shield,
  User,
  GraduationCap,
  Edit,
  Save,
  X,
  Lock,
  Unlock,
} from "lucide-react";
import type { User as UserType } from "../types";

const AccountManagement = () => {
  const { users, deleteUser, updateUser } = useApp();
  const [editingUsername, setEditingUsername] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium flex items-center w-fit">
            <Shield size={12} className="mr-1" /> Admin
          </span>
        );
      case "teacher":
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium flex items-center w-fit">
            <User size={12} className="mr-1" /> Giảng viên
          </span>
        );
      default:
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex items-center w-fit">
            <GraduationCap size={12} className="mr-1" /> Sinh viên
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "locked") {
      return (
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium flex items-center w-fit">
          <Lock size={12} className="mr-1" /> Đã khóa
        </span>
      );
    }
    return (
      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-medium flex items-center w-fit">
        <Unlock size={12} className="mr-1" /> Hoạt động
      </span>
    );
  };

  const startEdit = (user: UserType) => {
    setEditingUsername(user.username);
    setSelectedRole(user.role);
    setSelectedStatus(user.status || "active");
  };

  const saveEdit = (username: string) => {
    updateUser(username, { role: selectedRole, status: selectedStatus });
    setEditingUsername(null);
  };

  const cancelEdit = () => {
    setEditingUsername(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Tài Khoản</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <th className="px-6 py-4">Người dùng</th>
              <th className="px-6 py-4">Email / Username</th>
              <th className="px-6 py-4">Vai trò</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u: any) => (
              <tr key={u.username} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {u.name}
                </td>
                <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                  {u.username}
                </td>
                <td className="px-6 py-4">
                  {editingUsername === u.username ? (
                    <select
                      className="p-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-vlu-red"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="student">Sinh Viên</option>
                      <option value="teacher">Giảng Viên</option>
                      <option value="admin">Quản Trị Viên</option>
                    </select>
                  ) : (
                    getRoleBadge(u.role)
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingUsername === u.username ? (
                    <select
                      className="p-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-vlu-red"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="active">Hoạt động</option>
                      <option value="locked">Khóa</option>
                    </select>
                  ) : (
                    getStatusBadge(u.status)
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    {editingUsername === u.username ? (
                      <>
                        <button
                          onClick={() => saveEdit(u.username)}
                          className="text-green-600 hover:text-green-700 bg-green-50 p-1.5 rounded-md transition"
                          title="Lưu"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-500 hover:text-gray-600 bg-gray-100 p-1.5 rounded-md transition"
                          title="Hủy"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(u)}
                        className="text-blue-600 hover:text-blue-700 bg-blue-50 p-1.5 rounded-md transition"
                        title="Sửa thông tin"
                      >
                        <Edit size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`Xóa tài khoản ${u.username}?`))
                          deleteUser(u.username);
                      }}
                      className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded-md transition"
                      title="Xóa tài khoản"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountManagement;
