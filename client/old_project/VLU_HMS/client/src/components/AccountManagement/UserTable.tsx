import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User as UserType } from "@/types";
import { UserTableRow } from "./UserTableRow";

interface UserTableProps {
  users: UserType[];
  onUpdate: (username: string, updates: Partial<UserType>) => void;
  onDelete: (username: string) => void;
}

export const UserTable = ({ users, onUpdate, onDelete }: UserTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-[250px] font-semibold text-gray-700">Người dùng</TableHead>
            <TableHead className="font-semibold text-gray-700">Email / Username</TableHead>
            <TableHead className="font-semibold text-gray-700">Vai trò</TableHead>
            <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.username}
              user={user}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
