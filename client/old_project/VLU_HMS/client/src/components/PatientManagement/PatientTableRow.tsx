import { useNavigate } from "react-router-dom";
import { Edit, History, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Patient } from "@/types";

interface PatientTableRowProps {
  patient: Patient;
}

export const PatientTableRow = ({ patient }: PatientTableRowProps) => {
  const navigate = useNavigate();

  return (
    <TableRow className="hover:bg-gray-50 transition">
      <TableCell className="font-mono text-xs text-gray-600">
        {patient.id}
      </TableCell>
      <TableCell className="font-medium text-gray-900">
        {patient.fullName}
      </TableCell>
      <TableCell className="text-gray-600">{patient.dob}</TableCell>
      <TableCell className="text-gray-600">{patient.gender}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/patients/edit/${patient.id}`)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-3"
            title="Sửa thông tin bệnh nhân"
          >
            <Edit size={14} className="mr-1" /> Sửa
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/repository?patientId=${patient.id}`)}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 h-8 px-3"
            title="Xem tất cả hồ sơ cũ"
          >
            <History size={14} className="mr-1" /> Lịch sử BA
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(`/records/create/${patient.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3"
          >
            <FilePlus size={14} className="mr-1" /> Tạo HSBA
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
