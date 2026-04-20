import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { XRayInputForm } from "@/components/EditRecord/sections/XRayInputForm";
import type { XRayData } from "@/components/EditRecord/sections/XRayInputForm";
import { HematologyInputForm } from "@/components/EditRecord/sections/HematologyInputForm";
import type { HematologyData } from "@/components/EditRecord/sections/HematologyInputForm";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Record } from "@/types";

export const ClinicalRecordPage = ({ type }: { type: "xray" | "hematology" }) => {
  const { recordId, id } = useParams<{ recordId: string; id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<Record | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!recordId) return;
      try {
        setLoading(true);
        const data = await api.records.getById(parseInt(recordId));
        setRecord(data);
      } catch (error) {
        console.error("Failed to fetch medical record", error);
        toast.error("Không thể tải thông tin bệnh án.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [recordId, navigate]);

  const handleClose = () => {
    navigate(`/record/${recordId}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50">
        <Loader2 className="h-10 w-10 animate-spin text-vlu-red" />
      </div>
    );
  }

  if (!record) {
    return <div className="text-center p-12 text-gray-500">Không tìm thấy bệnh án</div>;
  }

  // Find specific document
  const prefix = type === "xray" ? "XRAY_" : "HEMA_";
  const doc = record.documents.find(d => d.id === `${prefix}${id}`);

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-gray-200 max-w-xl mx-auto mt-20">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy phiếu yêu cầu</h2>
        <p className="text-gray-500 mb-6">Phiếu lâm sàng này không tồn tại hoặc đã bị xóa.</p>
        <button 
          onClick={handleClose}
          className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-medium transition-colors"
        >
          Quay lại Bệnh án
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {type === "xray" && (
        <XRayInputForm
          isOpen={true}
          onClose={handleClose}
          initialData={doc.data as XRayData}
          defaultPatientName={record.patientName}
          defaultAge={record.age}
          defaultDob={record.dob}
          defaultGender={record.gender}
          defaultAddress={record.address}
          defaultDepartment={record.department}
          readOnly={true} // Defaults to readOnly when viewing from notification, they can use edit button in record view if they have permission
          recordId={parseInt(recordId!)}
        />
      )}
      
      {type === "hematology" && (
        <HematologyInputForm
          isOpen={true}
          onClose={handleClose}
          initialData={doc.data as HematologyData}
          defaultPatientName={record.patientName}
          defaultAge={record.age}
          defaultDob={record.dob}
          defaultGender={record.gender}
          defaultAddress={record.address}
          defaultDepartment={record.department}
          readOnly={true}
          recordId={parseInt(recordId!)}
        />
      )}
    </div>
  );
};
