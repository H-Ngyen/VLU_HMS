import { InfoRow } from "./InfoRow";
import type { Patient } from "@/types";

interface AdministrativeSectionProps {
  patient: Patient;
}

export const AdministrativeSection = ({ patient }: AdministrativeSectionProps) => {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
      <h4 className="text-orange-800 font-bold mb-4 uppercase text-sm tracking-wide border-b border-orange-200 pb-2">
        I. HÀNH CHÍNH
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoRow label="1. Họ và tên" value={patient.fullName} />
        <InfoRow
          label="2. Sinh ngày - Tuổi"
          value={`${patient.dob} (${patient.age} tuổi)`}
        />
        <InfoRow label="3. Giới tính" value={patient.gender} />

        <InfoRow
          label="4. Nghề nghiệp - Mã nghề"
          value={`${patient.job || "---"} - ${patient.jobCode || "---"}`}
        />
        <InfoRow label="5. Dân tộc" value={patient.ethnicity || "Kinh"} />
        <InfoRow
          label="6. Ngoại kiều"
          value={patient.nationality || "Việt Nam"}
        />

        <InfoRow label="7. Địa chỉ" value={patient.address} fullWidth />

        <InfoRow
          label="8. Nơi làm việc"
          value={patient.workplace || "---"}
          fullWidth
        />

        <InfoRow label="9. Đối tượng" value={patient.subjectType || "---"} />
        <InfoRow
          label="10. BHYT (Hạn - Số)"
          value={`${patient.insuranceExpiry || "---"} - ${
            patient.insuranceNumber || "---"
          }`}
          className="md:col-span-2"
        />
        <InfoRow
          label="11. Người nhà (Tên/ĐC - SĐT)"
          value={`${patient.relativeInfo || "---"} - ${
            patient.relativePhone || "---"
          }`}
          fullWidth
        />
      </div>
    </div>
  );
};
