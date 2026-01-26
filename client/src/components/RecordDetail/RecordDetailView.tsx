import { useParams, useNavigate } from "react-router-dom";
import { INITIAL_RECORDS, INITIAL_PATIENTS } from "@/mockData";
import { RecordForm } from "../EditRecord/RecordForm";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const RecordDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data fetching
  const record = INITIAL_RECORDS.find((r) => r.id === id);
  const patient = record
    ? INITIAL_PATIENTS.find((p) => p.id === record.patientId)
    : undefined;

  const handleExportPDF = () => {
    // Logic for PDF export will be implemented later
    console.log("Exporting PDF for record:", id);
  };

  if (!record || !patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-xl font-semibold text-gray-700">Không tìm thấy hồ sơ hoặc thông tin bệnh nhân</h2>
        <Button onClick={() => navigate(-1)} variant="link" className="text-vlu-red">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full p-4 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen">
      <RecordForm
        record={record}
        patient={patient}
        mode="edit"
        onSubmit={() => {}} // No-op in read-only mode
        onCancel={() => navigate("/")}
        readOnly={true}
      />
    </div>
  );
};