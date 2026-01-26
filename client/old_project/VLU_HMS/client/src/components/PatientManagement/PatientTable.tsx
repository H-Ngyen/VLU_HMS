import { Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { Patient } from "@/types";
import { PatientTableRow } from "./PatientTableRow";

interface PatientTableProps {
  patients: Patient[];
}

export const PatientTable = ({ patients }: PatientTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-[100px] font-semibold text-gray-700">Mã BN</TableHead>
            <TableHead className="font-semibold text-gray-700">Họ và tên</TableHead>
            <TableHead className="font-semibold text-gray-700">Ngày sinh</TableHead>
            <TableHead className="font-semibold text-gray-700">Giới tính</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Thao Tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <PatientTableRow key={patient.id} patient={patient} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Users size={48} className="text-gray-300 mb-2" />
                  <p>Không tìm thấy bệnh nhân nào.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
