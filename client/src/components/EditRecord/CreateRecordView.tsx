import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { INITIAL_PATIENTS } from "@/mockData";
import { RecordForm } from "./RecordForm";
import type { Record } from "@/types";

export const CreateRecordView = () => {
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get initial type from URL parameter (default to internal)
  const initialType = (searchParams.get("type") as "internal" | "surgery") || "internal";

  // In a real app, verify patient existence via API
  const patient = INITIAL_PATIENTS.find(p => p.id === patientId);

  if (!patient) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-xl font-semibold text-gray-700">Không tìm thấy thông tin bệnh nhân</div>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Quay lại</button>
      </div>
    );
  }

  const handleCreate = (newRecord: Record) => {
    // API call to create record
    console.log("Creating new record:", newRecord);
    
    // Simulate success
    alert("Tạo hồ sơ bệnh án thành công!");
    
    // Navigate to the newly created record detail (mock navigation)
    // In real app, we would get the new ID from API response
    navigate(`/record/${newRecord.id}`); // Or just navigate back to repository
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10 pt-6">
      <div className="w-full px-6">
         <RecordForm 
            mode="create"
            patient={patient}
            initialType={initialType}
            onSubmit={handleCreate}
            onCancel={() => navigate(-1)}
         />
      </div>
    </div>
  );
};
