import { useState } from "react";
import { Search } from "lucide-react";
import { USERS } from "@/mockData";
import { AccountTable } from "./AccountTable";
import { Input } from "@/components/ui/input";
import type { User } from "@/types";

export const AccountManagementView = () => {
  const [users, setUsers] = useState<User[]>(USERS);
  const [searchTerm, setSearchTerm] = useState("");

  const updateUser = (username: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.username === username ? { ...u, ...updates } : u))
    );
  };

  const deleteUser = (username: string) => {
    setUsers((prev) => prev.filter((u) => u.username !== username));
  };

  const filteredUsers = users.filter((user) => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.username + "@vanlanguni.vn").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full p-4 md:p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản Lý Tài Khoản</h1>
          <p className="text-gray-500">
            Quản lý danh sách người dùng, phân quyền và trạng thái hoạt động.
          </p>
        </div>

        <div className="relative w-full md:w-72">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <Input
            placeholder="Tìm kiếm email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <AccountTable 
        users={filteredUsers} 
        onUpdate={updateUser} 
        onDelete={deleteUser} 
      />
    </div>
  );
};
