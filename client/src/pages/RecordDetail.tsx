import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Upload, File, Eye, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { RelatedCharacteristics, VitalSigns, Organs } from "../types";

const RecordDetail = () => {
  const { id } = useParams();
  const { records, patients, user, addDocumentToRecord } = useApp();
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [docType, setDocType] = useState("Bệnh án");
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const record = records.find((r) => r.id === id);
  const patient = record
    ? patients.find((p) => p.id === record.patientId)
    : null;

  const handleDownloadPDF = async () => {
    const element = document.querySelector(".printable-content") as HTMLElement;
    if (!element) return;

    setIsDownloading(true);
    try {
      // 1. Chụp ảnh với chất lượng cao
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // 2. Thiết lập kích thước A4 và Lề (mm)
      const pdfWidth = 210;
      const pdfHeight = 297;
      const marginX = 15; // Lề trái/phải 15mm
      const marginY = 15; // Lề trên/dưới 15mm

      const contentWidth = pdfWidth - 2 * marginX;
      const contentHeight = pdfHeight - 2 * marginY;

      const pdf = new jsPDF("p", "mm", "a4");

      // 3. Tính toán kích thước ảnh trong PDF
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = imgHeight;
      let pageCount = 0;

      // 4. Thêm ảnh vào PDF và xử lý ngắt trang
      // Trang đầu tiên
      pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight);
      heightLeft -= contentHeight;

      // Các trang tiếp theo
      while (heightLeft > 0) {
        pageCount++;
        pdf.addPage();

        // Tính vị trí Y để đẩy phần nội dung tiếp theo lên đầu trang (sau lề)
        // position = marginY - (số trang * chiều cao nội dung 1 trang)
        const position = marginY - pageCount * contentHeight;

        pdf.addImage(imgData, "PNG", marginX, position, imgWidth, imgHeight);
        heightLeft -= contentHeight;
      }

      if (record) {
        pdf.save(`HoSoBenhAn_${record.id}.pdf`);
      }
    } catch (error) {
      console.error("Lỗi khi tạo PDF:", error);
      alert("Có lỗi xảy ra khi tải xuống PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!record) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-gray-600">Không tìm thấy hồ sơ.</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-vlu-red underline"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - (record.age || 0);
    const sanitizedName = (record.patientName || "").replace(/\s+/g, "");
    const sanitizedDocType = docType.replace(/\s+/g, "");
    const newFileName = `${record.id}_${sanitizedDocType}_${sanitizedName}_${birthYear}.pdf`;
    const newDoc = {
      id: `DOC${Date.now()}`,
      name: docType,
      type: docType,
      fileName: newFileName,
      date: new Date().toISOString().split("T")[0],
      url: URL.createObjectURL(selectedFile),
    };
    addDocumentToRecord(record.id, newDoc);
    setSelectedFile(null);
    setShowUpload(false);
    alert(`Đã thêm tài liệu: ${newFileName}`);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Template-style components
  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
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
    <div>
      {/* Top Bar (Actions) */}
      <div className="print-hide bg-white shadow-sm border-b border-gray-200 -mt-8 -mx-8 mb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center h-16 px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-vlu-red hover:border-vlu-red transition shadow-sm"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span>Quay lại danh sách</span>
          </button>
          <div className="text-center">
            <h2 className="font-bold text-gray-800 text-lg">
              {record.patientName}
            </h2>
            <p className="text-sm text-gray-500 font-mono">#{record.id}</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center text-white bg-vlu-red hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Đang xử lý...
              </span>
            ) : (
              <>
                <Download size={16} className="mr-2" /> Tải xuống PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        <aside className="hidden lg:block w-64 flex-shrink-0 print-hide">
          <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Mục Lục
            </h3>
            <nav className="space-y-1">
              <button
                onClick={() => scrollToSection("administrative")}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition truncate"
              >
                I. Hành chính
              </button>
              <button
                onClick={() => scrollToSection("patientManagement")}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition truncate"
              >
                II. Quản lý người bệnh
              </button>
              <button
                onClick={() => scrollToSection("diagnosis")}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition truncate"
              >
                III. Chẩn đoán
              </button>
              <button
                onClick={() => scrollToSection("discharge")}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition truncate"
              >
                IV. Tình trạng ra viện
              </button>
              <button
                onClick={() => scrollToSection("reason")}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition truncate"
              >
                A. Bệnh Án
              </button>
              <button
                onClick={() => scrollToSection("documents")}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition font-medium mt-2 pt-2 border-t border-gray-100"
              >
                📂 Tài liệu đính kèm
              </button>
            </nav>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Main "Paper" Content - PDF View */}
          <div
            className="bg-white rounded-none shadow-lg border border-gray-200 p-8 md:p-12 printable-content max-w-4xl mx-auto min-h-[1123px] relative text-sm leading-relaxed text-gray-800"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {/* Template Header */}
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
                        value={`${patient.dob} (${
                          patient.age || record.age
                        } tuổi)`}
                      />
                      <InfoRow label="3. Giới tính" value={patient.gender} />
                      <InfoRow
                        label="4. Nghề nghiệp"
                        value={`${patient.job || ""} (Mã: ${
                          patient.jobCode || ""
                        })`}
                      />
                      <InfoRow label="5. Dân tộc" value={patient.ethnicity} />
                      <InfoRow
                        label="6. Ngoại kiều"
                        value={patient.nationality}
                      />
                      <InfoRow label="7. Địa chỉ" value={patient.address} />
                      <InfoRow
                        label="8. Nơi làm việc"
                        value={patient.workplace}
                      />
                      <InfoRow
                        label="9. Đối tượng"
                        value={patient.subjectType}
                      />
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
                          <th className="border border-gray-300 p-2 text-left">
                            Khoa
                          </th>
                          <th className="border border-gray-300 p-2 text-left">
                            Ngày vào
                          </th>
                          <th className="border border-gray-300 p-2 text-left">
                            Số ngày
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {record.managementData?.transfers?.map((t, i) => (
                          <tr key={i}>
                            <td className="border border-gray-300 p-2">
                              {t.department}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {t.date}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {t.days}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <InfoRow
                    label="17. Chuyển viện"
                    value={`${
                      record.managementData?.hospitalTransfer?.type || "Không"
                    } - ${
                      record.managementData?.hospitalTransfer?.destination || ""
                    }`}
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
                      record.diagnosisInfo?.dischargeDiagnosis?.mainDisease
                        ?.name || ""
                    } (${
                      record.diagnosisInfo?.dischargeDiagnosis?.mainDisease
                        ?.code || ""
                    })`}
                  />
                  <InfoRow
                    label="    Bệnh kèm theo"
                    value={`${
                      record.diagnosisInfo?.dischargeDiagnosis?.comorbidities
                        ?.name || ""
                    } (${
                      record.diagnosisInfo?.dischargeDiagnosis?.comorbidities
                        ?.code || ""
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
                      record.dischargeStatusInfo?.deathStatus?.description ||
                      "Không"
                    }
                  />
                  {record.dischargeStatusInfo?.deathStatus?.description && (
                    <div className="pl-48 text-xs text-gray-500 italic -mt-1 mb-2">
                      Nguyên nhân:{" "}
                      {record.dischargeStatusInfo?.deathStatus?.cause} - Thời
                      gian: {record.dischargeStatusInfo?.deathStatus?.time}
                    </div>
                  )}
                  <InfoRow
                    label="27. Nguyên nhân chính"
                    value={`${
                      record.dischargeStatusInfo?.mainCauseOfDeath?.name || ""
                    } (${
                      record.dischargeStatusInfo?.mainCauseOfDeath?.code || ""
                    })`}
                  />
                  <InfoRow
                    label="28. Khám nghiệm tử thi"
                    value={
                      record.dischargeStatusInfo?.isAutopsy ? "Có" : "Không"
                    }
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
                    <h4 className="font-bold underline mb-2">
                      I. LÝ DO VÀO VIỆN
                    </h4>
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
                        <span className="font-bold">
                          3. Đặc điểm liên quan:
                        </span>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                          {characteristicsList.map((item) => {
                            const data =
                              record.medicalRecordContent
                                ?.relatedCharacteristics?.[item.key as keyof RelatedCharacteristics];
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
                            record.medicalRecordContent
                              ?.relatedCharacteristics || {}
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
                        <span className="font-bold mb-2 block">
                          Dấu hiệu sinh tồn:
                        </span>
                        <div className="grid grid-cols-5 gap-2 text-center text-sm border border-gray-300 p-2 bg-gray-50">
                          {[
                            { f: "pulse", l: "Mạch", u: "l/p" },
                            { f: "temperature", l: "Nhiệt", u: "°C" },
                            { f: "bloodPressure", l: "Huyết áp", u: "mmHg" },
                            { f: "respiratoryRate", l: "Nhịp thở", u: "l/p" },
                            { f: "weight", l: "Cân nặng", u: "kg" },
                          ].map((v) => (
                            <div key={v.f}>
                              <div className="font-bold text-gray-600">
                                {v.l}
                              </div>
                              <div>
                                {record.medicalRecordContent?.vitalSigns?.[
                                  v.f as keyof VitalSigns
                                ] || "--"}{" "}
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
                              {record.medicalRecordContent?.organs?.[
                                field.key as keyof Organs
                              ] || "Bình thường"}
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
                          record.medicalRecordContent?.admissionDiagnosis
                            ?.mainDisease
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
                  Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1}{" "}
                  năm {new Date().getFullYear()}
                </p>
                <p className="font-bold uppercase text-sm mb-12">
                  Bác sĩ điều trị
                </p>
                <p className="font-bold text-lg">Ký tên</p>
              </div>
            </div>
          </div>

          {/* Documents Section (Separate from PDF View) */}
          <section
            id="documents"
            className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 print-hide"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 uppercase flex items-center">
                <File size={20} className="mr-2 text-blue-500" />
                Tài liệu & Kết quả Cận lâm sàng
              </h2>
              {user?.role === "teacher" && (
                <button
                  onClick={() => setShowUpload(!showUpload)}
                  className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition flex items-center"
                >
                  <Upload size={14} className="mr-1" /> Thêm tài liệu
                </button>
              )}
            </div>

            {/* Upload Form */}
            {showUpload && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in fade-in">
                <form onSubmit={handleUpload} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Loại tài liệu
                      </label>
                      <select
                        className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                      >
                        <option value="Bệnh án">Bệnh án</option>
                        <option value="X-Quang">X-Quang</option>
                        <option value="Xét nghiệm máu">Xét nghiệm máu</option>
                        <option value="Siêu âm">Siêu âm</option>
                        <option value="Đơn thuốc">Đơn thuốc</option>
                        <option value="Giấy ra viện">Giấy ra viện</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        File (PDF)
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        required
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 transition"
                    >
                      Lưu tài liệu
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Document List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {record.documents && record.documents.length > 0 ? (
                record.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center min-w-0">
                      <div className="bg-red-100 p-2 rounded text-red-600 mr-3">
                        <File size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {doc.fileName}
                        </p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <a
                      href={doc.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition"
                      title="Xem"
                    >
                      <Eye size={16} />
                    </a>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-400 text-sm italic border-2 border-dashed border-gray-200 rounded-lg">
                  Chưa có tài liệu nào được tải lên.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;