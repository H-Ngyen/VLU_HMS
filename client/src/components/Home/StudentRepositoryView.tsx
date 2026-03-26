import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Record } from "@/types";
import { RecordFilter } from "./RecordFilter";
import { RecordTable } from "./RecordTable";
import { DeleteRecordDialog } from "./DeleteRecordDialog";
import { useRecordFilter } from "./hooks/useRecordFilter";
import { api } from "@/services/api";
import { toast } from "sonner";

// Mock user
const mockUser = {
  username: "teacher",
  password: "",
  role: "teacher",
  name: "TS. Trần Văn Giảng Viên",
  status: "active",
};

export const StudentRepositoryView = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("patientId") || "";
  
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await api.medicalRecords.getAll({ pageSize: 40 });
      
      // Map API DTO to UI Record interface
      const mappedRecords: Record[] = (data.items || []).map((item: any) => {
        const dobDate = item.patient.dateOfBirth ? new Date(item.patient.dateOfBirth) : null;
        const age = dobDate && !isNaN(dobDate.getTime()) ? new Date().getFullYear() - dobDate.getFullYear() : 0;
        const genderText = item.patient.gender === 1 ? "Nam" : item.patient.gender === 2 ? "Nữ" : "Khác";
        const typeText = item.recordType === 1 ? "internal" : "surgery";

        return {
          id: item.storageCode || item.id.toString(),
          numericId: item.id,
          storageCode: item.storageCode,
          patientId: item.patientId.toString(),
          patientName: item.patient.name,
          cccd: "", 
          insuranceNumber: item.patient.healthInsuranceNumber,
          dob: item.patient.dateOfBirth || "",
          age: age,
          gender: genderText,
          admissionDate: item.admissionTime || "",
          dischargeDate: "", 
          department: typeText === "internal" ? "Nội Khoa" : "Ngoại Khoa",
          type: typeText,
          documents: [],
          managementData: {} as any,
          medicalRecordContent: {} as any,
          diagnosisInfo: {} as any,
          dischargeStatusInfo: {} as any
        };
      });
      
      setRecords(mappedRecords);
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
      toast.error("Không thể tải danh sách hồ sơ bệnh án");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const {
    inputValue, setInputValue, filterType, setFilterType,
    currentPage, setCurrentPage, totalPages, startIndex, currentRecords
  } = useRecordFilter(records, initialSearch);

  const [recordToDelete, setRecordToDelete] = useState<Record | null>(null);

  const handleDeleteRecord = async () => {
    if (recordToDelete && recordToDelete.numericId) {
      try {
        await api.medicalRecords.delete(recordToDelete.numericId);
        toast.success("Đã xóa hồ sơ bệnh án thành công");
        fetchRecords(); // Refresh the list
      } catch (error: any) {
        toast.error(error.message || "Lỗi khi xóa hồ sơ bệnh án");
      } finally {
        setRecordToDelete(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full p-4 md:p-6 flex items-center justify-center h-64">
        <div className="text-gray-500 font-medium">Đang tải danh sách hồ sơ...</div>
      </div>
    );
  }

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