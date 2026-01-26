import { useState, useMemo, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useSearchParams } from "react-router-dom";
import DocumentManagerModal from "@/components/DocumentManagerModal";
import type { Record } from "@/types";
import { RecordFilter } from "./RecordFilter";
import { RecordTable } from "./RecordTable";
import { DeleteRecordDialog } from "./DeleteRecordDialog";

const ITEMS_PER_PAGE = 20;

export const StudentRepositoryView = () => {
  const { records, user, deleteRecord } = useApp();
  const [searchParams] = useSearchParams();

  const patientIdParam = searchParams.get("patientId") || "";
  const [inputValue, setInputValue] = useState(patientIdParam);
  const [searchTerm, setSearchTerm] = useState(patientIdParam);
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRecordForManagement, setSelectedRecordForManagement] = useState<Record | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<Record | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const displayData = useMemo(() => {
    if (!searchTerm.trim() && filterType === "all") {
      return [...records].sort(
        (a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
      );
    }

    return records.filter((record) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        record.patientName.toLowerCase().includes(term) ||
        record.id.toLowerCase().includes(term) ||
        (record.patientId && record.patientId.toLowerCase().includes(term));

      const matchesType = filterType === "all" || record.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [records, searchTerm, filterType]);

  const totalPages = Math.ceil(displayData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRecords = displayData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDeleteRecord = () => {
    if (recordToDelete) {
      deleteRecord(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kho Hồ Sơ Bệnh Án</h1>
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
        user={user}
        onEdit={setSelectedRecordForManagement}
        onDelete={setRecordToDelete}
      />

      {/* Legacy Modal (kept as is for now or refactor later) */}
      {selectedRecordForManagement && (
        <DocumentManagerModal
          record={selectedRecordForManagement}
          onClose={() => setSelectedRecordForManagement(null)}
        />
      )}

      <DeleteRecordDialog
        record={recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleDeleteRecord}
      />
    </div>
  );
};
