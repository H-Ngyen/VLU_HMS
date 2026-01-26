import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, User, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Patient } from "@/types";
import { formatDate } from "@/lib/utils";
import { CreateRecordTypeDialog } from "./CreateRecordTypeDialog";

interface PatientTableRowProps {
  patient: Patient;
}

export const PatientTableRow = ({ patient }: PatientTableRowProps) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateRecord = (type: "internal" | "surgery") => {
    setIsDialogOpen(false);
    navigate(`/record/create/${patient.id}?type=${type}`);
  };

  return (
    <TableRow className="hover:bg-gray-50 transition group">
      <TableCell className="font-mono text-xs text-gray-600 font-medium">
        {patient.id}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
            {patient.fullName.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900 group-hover:text-vlu-red transition">
              {patient.fullName}
            </div>
            <div className="text-xs text-gray-400 mt-0.5 flex items-center">
               <User size={10} className="mr-1" />
               {patient.job || "Chưa cập nhật"}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-gray-600 font-mono text-xs">{patient.cccd || "---"}</TableCell>
      <TableCell className="text-gray-600">{formatDate(patient.dob)}</TableCell>
      <TableCell className="text-gray-600">
        {patient.age} / {patient.gender}
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-700 truncate max-w-[200px]" title={patient.address}>
            {patient.address}
        </div>
      </TableCell>
      <TableCell>
         {patient.subjectType === 'BHYT' ? (
             <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">BHYT</Badge>
         ) : (
             <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Thu phí</Badge>
         )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/patient/edit/${patient.id}`)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8 px-2"
          >
            <Edit size={14} className="mr-1" /> Sửa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="text-green-600 hover:text-green-800 hover:bg-green-50 h-8 px-2"
          >
             <FilePlus size={14} className="mr-1" /> Tạo HSBA
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8 px-2"
          >
            <Trash2 size={14} className="mr-1" /> Xóa
          </Button>
          
          <CreateRecordTypeDialog 
            open={isDialogOpen} 
            onOpenChange={setIsDialogOpen}
            onSelect={handleCreateRecord}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
