import { useParams, useNavigate } from "react-router-dom";
import { INITIAL_RECORDS, INITIAL_PATIENTS } from "@/mockData";
import { ViewRecordForm } from "../ViewRecord/RecordForm";
import { Button } from "@/components/ui/button";

export const RecordDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data fetching
  const record = INITIAL_RECORDS.find((r) => r.id === id);
  const patient = record
    ? INITIAL_PATIENTS.find((p) => p.id === record.patientId)
    : undefined;

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
      <ViewRecordForm
        record={record}
        patient={patient}
        onCancel={() => navigate("/")}
      />
    </div>
  );
};