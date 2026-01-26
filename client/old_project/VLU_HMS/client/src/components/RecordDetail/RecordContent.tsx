import type { Record, Patient, RelatedCharacteristics, VitalSigns, Organs } from "@/types";

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-base font-bold mb-3 bg-gray-100 p-2 uppercase border-l-4 border-gray-800 text-gray-800">
    {children}
  </div>
);

const InfoRow: React.FC<{
  label: string;
  value?: string | number;
  className?: string;
}> = ({ label, value, className = "" }) => (
  <div className={`flex mb-2 text-sm ${className}`}>
    <span className="font-bold w-48 flex-shrink-0 text-gray-800">
      {label}:
    </span>
    <span className="flex-1 text-gray-700">{value || "---"}</span>
  </div>
);

interface RecordContentProps {
  record: Record;
  patient?: Patient;
}

export const RecordContent = ({ record, patient }: RecordContentProps) => {
  const characteristicsList = [
    { key: "allergy", label: "Dị ứng" },
    { key: "drugs", label: "Ma túy" },
    { key: "alcohol", label: "Rượu bia" },
    { key: "tobacco", label: "Thuốc lá" },
    { key: "pipeTobacco", label: "Thuốc lào" },
    { key: "other", label: "Khác" },
  ];

  const organFields = [
    { key: "circulatory", label: "+ Tuần hoàn" },
    { key: "respiratory", label: "+ Hô hấp" },
    { key: "digestive", label: "+ Tiêu hóa" },
    { key: "kidneyUrology", label: "+ Thận - Tiết niệu - Sinh dục" },
    { key: "neurological", label: "+ Thần kinh" },
    { key: "musculoskeletal", label: "+ Cơ - Xương - Khớp" },
    { key: "ent", label: "+ Tai - Mũi - Họng" },
    { key: "maxillofacial", label: "+ Răng - Hàm - Mặt" },
    { key: "eye", label: "+ Mắt" },
    {
      key: "endocrineAndOthers",
      label: "+ Nội tiết, dinh dưỡng và các bệnh lý khác",
    },
  ];

  return (
    <div
      className="bg-white rounded-none shadow-lg border border-gray-200 p-8 md:p-12 printable-content max-w-4xl mx-auto min-h-[1123px] relative text-sm leading-relaxed text-gray-800"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">
          HỒ SƠ BỆNH ÁN
        </h1>
        <p className="text-gray-500 text-lg">Van Lang Clinic</p>
        <p className="text-xs text-gray-400 mt-2">
          Mã hồ sơ: {record.id}
        </p>
      </div>

      <div className="space-y-8 mb-10">
        {/* I. HÀNH CHÍNH */}
        <section id="administrative" className="scroll-mt-6">
          <SectionTitle>I. HÀNH CHÍNH</SectionTitle>
          <div className="pl-2">
            {patient ? (
              <>
                <InfoRow label="1. Họ và tên" value={patient.fullName} />
                <InfoRow
                  label="2. Sinh ngày (Tuổi)"
                  value={`${patient.dob} (${patient.age || record.age} tuổi)`}
                />
                <InfoRow label="3. Giới tính" value={patient.gender} />
                <InfoRow
                  label="4. Nghề nghiệp"
                  value={`${patient.job || ""} (Mã: ${patient.jobCode || ""})`}
                />
                <InfoRow label="5. Dân tộc" value={patient.ethnicity} />
                <InfoRow label="6. Ngoại kiều" value={patient.nationality} />
                <InfoRow label="7. Địa chỉ" value={patient.address} />
                <InfoRow label="8. Nơi làm việc" value={patient.workplace} />
                <InfoRow label="9. Đối tượng" value={patient.subjectType} />
                <InfoRow
                  label="10. BHYT"
                  value={`Số: ${patient.insuranceNumber || "---"} (Hạn: ${
                    patient.insuranceExpiry || "---"
                  })`}
                />
                <InfoRow
                  label="11. Người nhà"
                  value={`${patient.relativeInfo || "---"} - SĐT: ${
                    patient.relativePhone || "---"
                  }`}
                />
              </>
            ) : (
              <p className="text-red-500 italic">
                Không tìm thấy thông tin chi tiết bệnh nhân.
              </p>
            )}
          </div>
        </section>

        {/* II. QUẢN LÝ NGƯỜI BỆNH */}
        <section id="patientManagement" className="scroll-mt-6">
          <SectionTitle>II. QUẢN LÝ NGƯỜI BỆNH</SectionTitle>
          <div className="pl-2 space-y-3">
            <InfoRow
              label="12. Vào viện lúc"
              value={`${record.managementData?.admissionTime || ""} - ${
                record.admissionDate
              }`}
            />
            <InfoRow
              label="13. Trực tiếp vào"
              value={record.managementData?.admissionType}
            />
            <InfoRow
              label="14. Nơi giới thiệu"
              value={record.managementData?.referralSource}
            />
            <InfoRow
              label="    Vào viện lần thứ"
              value={record.managementData?.admissionCount}
            />

            <div className="mt-4">
              <p className="font-bold mb-2 text-sm text-gray-800">
                15-16. Quá trình điều trị:
              </p>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">Khoa</th>
                    <th className="border border-gray-300 p-2 text-left">Ngày vào</th>
                    <th className="border border-gray-300 p-2 text-left">Số ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {record.managementData?.transfers?.map((t, i) => (
                    <tr key={i}>
                      <td className="border border-gray-300 p-2">{t.department}</td>
                      <td className="border border-gray-300 p-2">{t.date}</td>
                      <td className="border border-gray-300 p-2">{t.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <InfoRow
              label="17. Chuyển viện"
              value={`${
                record.managementData?.hospitalTransfer?.type || "Không"
              } - ${record.managementData?.hospitalTransfer?.destination || ""}`}
              className="mt-2"
            />
            <InfoRow
              label="18. Ra viện"
              value={record.managementData?.dischargeType}
            />
            <InfoRow
              label="19. Tổng số ngày điều trị"
              value={record.managementData?.totalDays}
            />
          </div>
        </section>

        {/* III. CHẨN ĐOÁN */}
        <section id="diagnosis" className="scroll-mt-6">
          <SectionTitle>III. CHẨN ĐOÁN</SectionTitle>
          <div className="pl-2 space-y-2">
            <InfoRow
              label="20. Nơi chuyển đến"
              value={`${
                record.diagnosisInfo?.transferDiagnosis?.name || ""
              } (${record.diagnosisInfo?.transferDiagnosis?.code || ""})`}
            />
            <InfoRow
              label="21. KKB, Cấp cứu"
              value={`${
                record.diagnosisInfo?.kkbDiagnosis?.name || ""
              } (${record.diagnosisInfo?.kkbDiagnosis?.code || ""})`}
            />
            <InfoRow
              label="22. Khoa điều trị"
              value={`${
                record.diagnosisInfo?.deptDiagnosis?.name || ""
              } (${record.diagnosisInfo?.deptDiagnosis?.code || ""})`}
            />
            <div className="pl-48 text-xs text-gray-500 italic -mt-1 mb-2">
              {record.diagnosisInfo?.deptDiagnosis?.isProcedure
                ? "[x] Thủ thuật "
                : "[ ] Thủ thuật "}
              {record.diagnosisInfo?.deptDiagnosis?.isSurgery
                ? "[x] Phẫu thuật"
                : "[ ] Phẫu thuật"}
            </div>
            <InfoRow
              label="23. Ra viện (Bệnh chính)"
              value={`${
                record.diagnosisInfo?.dischargeDiagnosis?.mainDisease?.name || ""
              } (${
                record.diagnosisInfo?.dischargeDiagnosis?.mainDisease?.code || ""
              })`}
            />
            <InfoRow
              label="    Bệnh kèm theo"
              value={`${
                record.diagnosisInfo?.dischargeDiagnosis?.comorbidities?.name || ""
              } (${
                record.diagnosisInfo?.dischargeDiagnosis?.comorbidities?.code || ""
              })`}
            />
          </div>
        </section>

        {/* IV. TÌNH TRẠNG RA VIỆN */}
        <section id="discharge" className="scroll-mt-6">
          <SectionTitle>IV. TÌNH TRẠNG RA VIỆN</SectionTitle>
          <div className="pl-2 space-y-2">
            <InfoRow
              label="24. Kết quả điều trị"
              value={record.dischargeStatusInfo?.treatmentResult}
            />
            <InfoRow
              label="25. Giải phẫu bệnh"
              value={record.dischargeStatusInfo?.pathology}
            />
            <InfoRow
              label="26. Tình hình tử vong"
              value={
                record.dischargeStatusInfo?.deathStatus?.description || "Không"
              }
            />
            {record.dischargeStatusInfo?.deathStatus?.description && (
              <div className="pl-48 text-xs text-gray-500 italic -mt-1 mb-2">
                Nguyên nhân: {record.dischargeStatusInfo?.deathStatus?.cause} - Thời
                gian: {record.dischargeStatusInfo?.deathStatus?.time}
              </div>
            )}
            <InfoRow
              label="27. Nguyên nhân chính"
              value={`${
                record.dischargeStatusInfo?.mainCauseOfDeath?.name || ""
              } (${record.dischargeStatusInfo?.mainCauseOfDeath?.code || ""})`}
            />
            <InfoRow
              label="28. Khám nghiệm tử thi"
              value={record.dischargeStatusInfo?.isAutopsy ? "Có" : "Không"}
            />
          </div>
        </section>

        {/* A. BỆNH ÁN */}
        <section
          id="reason"
          className="scroll-mt-6 border-t-2 border-dashed border-gray-300 pt-6 mt-6"
        >
          <h2 className="text-xl font-bold text-center mb-6">
            A. BỆNH ÁN CHI TIẾT
          </h2>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold underline mb-2">I. LÝ DO VÀO VIỆN</h4>
              <p className="pl-4">
                {record.medicalRecordContent?.reason} (Ngày thứ{" "}
                {record.medicalRecordContent?.dayOfIllness} của bệnh)
              </p>
            </div>

            <div>
              <h4 className="font-bold underline mb-2">II. HỎI BỆNH</h4>
              <div className="pl-4 space-y-3">
                <div>
                  <span className="font-bold">1. Quá trình bệnh lý:</span>{" "}
                  <p className="mt-1 text-justify">
                    {record.medicalRecordContent?.pathologicalProcess}
                  </p>
                </div>
                <div>
                  <span className="font-bold">2. Tiền sử bản thân:</span>{" "}
                  <p className="mt-1 text-justify">
                    {record.medicalRecordContent?.personalHistory}
                  </p>
                </div>
                <div>
                  <span className="font-bold">3. Đặc điểm liên quan:</span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                    {characteristicsList.map((item) => {
                      const data =
                        record.medicalRecordContent?.relatedCharacteristics?.[item.key as keyof RelatedCharacteristics];
                      if (!data?.isChecked) return null;
                      return (
                        <span
                          key={item.key}
                          className="bg-gray-100 px-2 py-0.5 rounded border border-gray-300"
                        >
                          {item.label} ({data.time})
                        </span>
                      );
                    })}
                    {!Object.values(
                      record.medicalRecordContent?.relatedCharacteristics || {}
                    ).some((v) => v.isChecked) && (
                      <span>Không có ghi nhận đặc biệt.</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-bold">4. Tiền sử gia đình:</span>{" "}
                  <p className="mt-1 text-justify">
                    {record.medicalRecordContent?.familyHistory}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold underline mb-2">III. KHÁM BỆNH</h4>
              <div className="pl-4 space-y-4">
                <div>
                  <span className="font-bold">1. Toàn thân:</span>{" "}
                  <p className="mt-1 whitespace-pre-line">
                    {record.medicalRecordContent?.overallExamination}
                  </p>
                </div>
                <div>
                  <span className="font-bold mb-2 block">Dấu hiệu sinh tồn:</span>
                  <div className="grid grid-cols-5 gap-2 text-center text-sm border border-gray-300 p-2 bg-gray-50">
                    {[
                      { f: "pulse", l: "Mạch", u: "l/p" },
                      { f: "temperature", l: "Nhiệt", u: "°C" },
                      { f: "bloodPressure", l: "Huyết áp", u: "mmHg" },
                      { f: "respiratoryRate", l: "Nhịp thở", u: "l/p" },
                      { f: "weight", l: "Cân nặng", u: "kg" },
                    ].map((v) => (
                      <div key={v.f}>
                        <div className="font-bold text-gray-600">{v.l}</div>
                        <div>
                          {record.medicalRecordContent?.vitalSigns?.[v.f as keyof VitalSigns] || "--"}{" "}
                          {v.u}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-bold">2. Các cơ quan:</span>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
                    {organFields.map((field) => (
                      <div key={field.key} className="text-sm">
                        <span className="font-semibold italic">
                          {field.label}:
                        </span>{" "}
                        {record.medicalRecordContent?.organs?.[field.key as keyof Organs] ||
                          "Bình thường"}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-bold">3. Tóm tắt bệnh án:</span>{" "}
                  <p className="mt-1 text-justify bg-gray-50 p-2 border border-gray-200">
                    {record.medicalRecordContent?.summary}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold underline mb-2">IV. ĐIỀU TRỊ</h4>
              <div className="pl-4">
                <InfoRow
                  label="Chẩn đoán vào khoa"
                  value={
                    record.medicalRecordContent?.admissionDiagnosis?.mainDisease
                  }
                />
                <InfoRow
                  label="Tiên lượng"
                  value={record.medicalRecordContent?.prognosis}
                />
                <InfoRow
                  label="Hướng điều trị"
                  value={record.medicalRecordContent?.treatmentPlan}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Signature */}
      <div className="flex justify-end mt-16 pt-8 break-inside-avoid">
        <div className="text-center w-64">
          <p className="italic mb-1">
            Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm{" "}
            {new Date().getFullYear()}
          </p>
          <p className="font-bold uppercase text-sm mb-12">Bác sĩ điều trị</p>
          <p className="font-bold text-lg">Ký tên</p>
        </div>
      </div>
    </div>
  );
};
