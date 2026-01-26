import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { INITIAL_RECORDS, INITIAL_PATIENTS } from "@/mockData";
import { RecordForm } from "./RecordForm";
import type { Record } from "@/types";

export const EditRecordView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<Record | null>(null);

  useEffect(() => {
    // Simulate API call
    const foundRecord = INITIAL_RECORDS.find((r) => r.id === id);
    if (foundRecord) {
      setRecord(foundRecord);
    }
  }, [id]);

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-xl font-semibold text-gray-700">Đang tải hồ sơ...</div>
      </div>
    );
  }

  // Get patient info for display
  const patient = INITIAL_PATIENTS.find(p => p.id === record.patientId);

  // Fallback if patient not found (though record exists)
  if (!patient) return <div>Lỗi dữ liệu: Không tìm thấy thông tin bệnh nhân.</div>;

  const handleUpdate = (updatedRecord: Record) => {
    // In a real app, this would be an API PUT request
    console.log("Updated Record:", updatedRecord);
    alert("Cập nhật hồ sơ thành công!");
    navigate(`/record/${updatedRecord.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10 pt-6">
      <div className="w-full px-6">
         <RecordForm 
            mode="edit"
            record={record} 
            patient={patient} 
            onSubmit={handleUpdate} 
            onCancel={() => navigate(-1)}
         />
      </div>
    </div>
  );
};
