import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Record } from "@/types";
import { RecordFilter } from "./RecordFilter";
import { RecordTable } from "./RecordTable";
import { DeleteRecordDialog } from "./DeleteRecordDialog";
import { INITIAL_RECORDS } from "@/mockData";
import { useRecordFilter } from "./hooks/useRecordFilter";

// Mock user
const mockUser = {
  username: "teacher",
  password: "",
  role: "teacher",
  name: "TS. Trần Văn Giảng Viên",
  status: "active",
};

export const StudentRepositoryView = () => {
  const [records, setRecords] = useState<Record[]>(INITIAL_RECORDS);
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("patientId") || "";
  
  const {
    inputValue, setInputValue, filterType, setFilterType,
    currentPage, setCurrentPage, totalPages, startIndex, currentRecords
  } = useRecordFilter(records, initialSearch);

  const [recordToDelete, setRecordToDelete] = useState<Record | null>(null);

  const handleDeleteRecord = () => {
    if (recordToDelete) {
      setRecords((prev) => prev.filter((r) => r.id !== recordToDelete.id));
      setRecordToDelete(null);
    }
  };

  return (
    <div className="w-full p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hồ sơ Bệnh án</h1>
      </div>

      <RecordFilter
        inputValue={inputValue}
        setInputValue={setInputValue}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <RecordTable
        records={currentRecords}
        startIndex={startIndex}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        user={mockUser}
        onEdit={() => {}} // No-op, navigation handled in Row
        onDelete={setRecordToDelete}
      />

      <DeleteRecordDialog
        record={recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleDeleteRecord}
      />
    </div>
  );
};