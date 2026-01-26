import { useApp } from "@/context/AppContext";
import { UserTable } from "@/components/AccountManagement/UserTable";

const AccountManagementPage = () => {
  const { users, deleteUser, updateUser } = useApp();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản Lý Tài Khoản</h1>
        <p className="text-gray-500">
          Quản lý danh sách người dùng, phân quyền và trạng thái hoạt động.
        </p>
      </div>

      <UserTable 
        users={users} 
        onUpdate={updateUser} 
        onDelete={deleteUser} 
      />
    </div>
  );
};

export default AccountManagementPage;
