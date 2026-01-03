import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import type { Record, ManagementData, DiagnosisInfo, DischargeStatusInfo, MedicalRecordContent, VitalSigns, Organs, RelatedCharacteristics } from "../types";

const CreateRecord = () => {
  const { addRecord, patients } = useApp();
  const navigate = useNavigate();
  const { patientId } = useParams();

  const patient = patients.find((p) => p.id === patientId);

  // Initial State
  const [formData, setFormData] = useState<Record | null>(null);
  const [step, setStep] = useState(1);
  const [lastStepChange, setLastStepChange] = useState(0);

  // Scroll to top when step changes
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  // Initialize data
  useEffect(() => {
    if (patient) {
      const initializedData: Record = {
        id: `REC${Date.now()}`, // Generate new ID
        patientId: patient.id,
        patientName: patient.fullName,
        age: patient.age,
        dob: patient.dob,
        gender: patient.gender,
        admissionDate: new Date().toISOString().split("T")[0],
        dischargeDate: "",
        department: "Nội Hô Hấp", // Default
        type: "Inpatient", // Defaulting type
        documents: [],
        managementData: {
          admissionTime: "",
          admissionType: "KKB",
          referralSource: "Tự đến",
          admissionCount: 1,
          hospitalTransfer: { type: "", destination: "" },
          dischargeType: "",
          totalDays: 0,
          transfers: [
            {
              department: "Nội Hô Hấp",
              date: new Date().toISOString().split("T")[0],
              time: "",
              days: "",
            },
          ],
        },
        diagnosisInfo: {
          transferDiagnosis: { name: "", code: "" },
          kkbDiagnosis: { name: "", code: "" },
          deptDiagnosis: {
            name: "",
            code: "",
            isSurgery: false,
            isProcedure: false,
          },
          dischargeDiagnosis: {
            mainDisease: { name: "", code: "" },
            comorbidities: { name: "", code: "" },
            isAccident: false,
            isComplication: false,
          },
        },
        dischargeStatusInfo: {
          treatmentResult: "", // 1..5
          pathology: "", // 1..3
          deathStatus: { description: "", cause: "", time: "" },
          mainCauseOfDeath: { name: "", code: "" },
          isAutopsy: false,
          autopsyDiagnosis: { name: "", code: "" },
        },
        medicalRecordContent: {
          reason: "",
          dayOfIllness: "",
          pathologicalProcess: "",
          personalHistory: "",
          familyHistory: "",
          relatedCharacteristics: {
            allergy: { isChecked: false, time: "" },
            drugs: { isChecked: false, time: "" },
            alcohol: { isChecked: false, time: "" },
            tobacco: { isChecked: false, time: "" },
            pipeTobacco: { isChecked: false, time: "" },
            other: { isChecked: false, time: "" },
          },
          overallExamination: "",
          vitalSigns: {
            pulse: "",
            temperature: "",
            bloodPressure: "",
            respiratoryRate: "",
            weight: "",
          },
          organs: {
            circulatory: "",
            respiratory: "",
            digestive: "",
            kidneyUrology: "",
            neurological: "",
            musculoskeletal: "",
            ent: "",
            maxillofacial: "",
            eye: "",
            endocrineAndOthers: "",
          },
          clinicalTests: "",
          summary: "",
          admissionDiagnosis: {
            mainDisease: "",
            comorbidities: "",
            differential: "",
          },
          prognosis: "",
          treatmentPlan: "",
        },
      };
      setFormData(initializedData);
    }
  }, [patient]);

  const handleManagementChange = (field: keyof ManagementData, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        managementData: { ...prev.managementData, [field]: value },
      };
    });
  };

  const handleDiagnosisChange = (section: keyof DiagnosisInfo, field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        diagnosisInfo: {
          ...prev.diagnosisInfo,
          [section]: { ...prev.diagnosisInfo[section], [field]: value },
        },
      };
    });
  };

  const handleDischargeStatusChange = (field: keyof DischargeStatusInfo, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        dischargeStatusInfo: { ...prev.dischargeStatusInfo, [field]: value },
      };
    });
  };

  const handleMedicalRecordChange = (field: keyof MedicalRecordContent, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medicalRecordContent: { ...prev.medicalRecordContent, [field]: value },
      };
    });
  };

  const handleCharacteristicChange = (key: keyof RelatedCharacteristics, field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medicalRecordContent: {
          ...prev.medicalRecordContent,
          relatedCharacteristics: {
            ...prev.medicalRecordContent.relatedCharacteristics,
            [key]: {
              ...prev.medicalRecordContent.relatedCharacteristics[key],
              [field]: value,
            },
          },
        },
      };
    });
  };

  const handleVitalSignsChange = (field: keyof VitalSigns, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medicalRecordContent: {
          ...prev.medicalRecordContent,
          vitalSigns: { ...prev.medicalRecordContent.vitalSigns, [field]: value },
        },
      };
    });
  };

  const handleOrgansChange = (field: keyof Organs, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medicalRecordContent: {
          ...prev.medicalRecordContent,
          organs: { ...prev.medicalRecordContent.organs, [field]: value },
        },
      };
    });
  };

  const handleAdmissionDiagnosisChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medicalRecordContent: {
          ...prev.medicalRecordContent,
          admissionDiagnosis: {
            ...prev.medicalRecordContent.admissionDiagnosis,
            [field]: value,
          },
        },
      };
    });
  };

  const handleHospitalTransferChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        managementData: {
          ...prev.managementData,
          hospitalTransfer: {
            ...prev.managementData.hospitalTransfer,
            [field]: value,
          },
        },
      };
    });
  };

  const addTransfer = () => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        managementData: {
          ...prev.managementData,
          transfers: [
            ...prev.managementData.transfers,
            { department: "", date: "", time: "", days: "" },
          ],
        },
      };
    });
  };

  const removeTransfer = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        managementData: {
          ...prev.managementData,
          transfers: prev.managementData.transfers.filter((_, i) => i !== index),
        },
      };
    });
  };

  const updateTransfer = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newTransfers = [...prev.managementData.transfers];
      newTransfers[index] = { ...newTransfers[index], [field]: value };
      return {
        ...prev,
        managementData: { ...prev.managementData, transfers: newTransfers },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      setLastStepChange(Date.now());
      return;
    }

    if (Date.now() - lastStepChange < 500) return;

    if (formData) {
        addRecord(formData);
        alert("Tạo hồ sơ bệnh án thành công!");
        navigate("/repository");
    }
  };

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

  interface InfoRowProps {
    label: string;
    value: string | number | undefined;
    fullWidth?: boolean;
    className?: string;
  }

  const InfoRow = ({
    label,
    value,
    fullWidth = false,
    className = "",
  }: InfoRowProps) => (
    <div className={`${fullWidth ? "col-span-full" : ""} ${className} mb-2`}>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
        {label}
      </span>
      <span className="text-gray-800 font-medium">{value || "---"}</span>
    </div>
  );

  if (!patient)
    return <div className="p-8 text-center">Bệnh nhân không tồn tại</div>;
  if (!formData) return <div className="p-8 text-center">Đang khởi tạo...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() =>
              step === 1 ? navigate("/patient-management") : setStep(1)
            }
            className="mr-4 p-2 bg-white border border-gray-300 rounded-lg text-gray-500 hover:text-vlu-red hover:border-vlu-red transition shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Tạo Hồ Sơ Bệnh Án Mới
            </h1>
            <p className="text-gray-500 text-sm">
              Bệnh nhân: {patient.fullName} - Trang {step}/2
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <>
            {/* I. HÀNH CHÍNH */}
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
                  value={`${patient.job || "---"} - ${
                    patient.jobCode || "---"
                  }`}
                />
                <InfoRow
                  label="5. Dân tộc"
                  value={patient.ethnicity || "Kinh"}
                />
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

                <InfoRow
                  label="9. Đối tượng"
                  value={patient.subjectType || "---"}
                />
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

            {/* II. QUẢN LÝ NGƯỜI BỆNH */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800">
                  II. QUẢN LÝ NGƯỜI BỆNH
                </h3>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      12. Vào viện lúc
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        className="w-32 p-2.5 border border-gray-300 rounded-lg outline-none"
                        value={formData.managementData?.admissionTime || ""}
                        onChange={(e) =>
                          handleManagementChange(
                            "admissionTime",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="date"
                        className="flex-1 p-2.5 border border-gray-300 rounded-lg outline-none"
                        value={formData.admissionDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            admissionDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    13. Trực tiếp vào
                  </label>
                  <div className="flex gap-4 flex-wrap">
                    {["Cấp cứu", "KKB", "Khoa điều trị"].map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="admissionType"
                          value={opt}
                          checked={
                            formData.managementData?.admissionType === opt
                          }
                          onChange={(e) =>
                            handleManagementChange(
                              "admissionType",
                              e.target.value
                            )
                          }
                          className="w-4 h-4 text-vlu-red"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      14. Nơi giới thiệu
                    </label>
                    <div className="flex gap-4 flex-wrap">
                      {["Cơ quan y tế", "Tự đến", "Khác"].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="referralSource"
                            value={opt}
                            checked={
                              formData.managementData?.referralSource === opt
                            }
                            onChange={(e) =>
                              handleManagementChange(
                                "referralSource",
                                e.target.value
                              )
                            }
                            className="w-4 h-4 text-vlu-red"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vào viện lần thứ
                    </label>
                    <input
                      type="number"
                      className="w-full p-2.5 border border-gray-300 rounded-lg"
                      value={formData.managementData?.admissionCount || ""}
                      onChange={(e) =>
                        handleManagementChange("admissionCount", e.target.value)
                      }
                    />
                  </div>
                </div>
                {/* 15. Vào Khoa */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 font-bold text-sm text-gray-700">
                    15. Vào Khoa
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Tên Khoa
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={
                          formData.managementData?.transfers?.[0]?.department ||
                          ""
                        }
                        onChange={(e) =>
                          updateTransfer(0, "department", e.target.value)
                        }
                        placeholder="VD: Nội Hô Hấp"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Ngày vào
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={
                          formData.managementData?.transfers?.[0]?.date || ""
                        }
                        onChange={(e) =>
                          updateTransfer(0, "date", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Giờ vào
                      </label>
                      <input
                        type="time"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={
                          formData.managementData?.transfers?.[0]?.time || ""
                        }
                        onChange={(e) =>
                          updateTransfer(0, "time", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Số ngày điều trị
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={
                          formData.managementData?.transfers?.[0]?.days || ""
                        }
                        onChange={(e) =>
                          updateTransfer(0, "days", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* 16. Chuyển Khoa */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                    <label className="font-semibold text-sm text-gray-700">
                      16. Chuyển Khoa
                    </label>
                    <button
                      type="button"
                      onClick={addTransfer}
                      className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded flex items-center transition"
                    >
                      <Plus size={14} className="mr-1" /> Thêm khoa
                    </button>
                  </div>
                  {(formData.managementData?.transfers?.length ?? 0) > 1 ? (
                    <div className="divide-y divide-gray-100">
                      {formData.managementData.transfers.map((t, idx) => {
                        if (idx === 0) return null;
                        return (
                          <div
                            key={idx}
                            className="p-4 grid grid-cols-1 md:grid-cols-9 gap-4 items-end"
                          >
                            <div className="md:col-span-3">
                              <label className="block text-xs text-gray-500 mb-1">
                                Khoa chuyển đến
                              </label>
                              <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                value={t.department}
                                onChange={(e) =>
                                  updateTransfer(
                                    idx,
                                    "department",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs text-gray-500 mb-1">
                                Ngày chuyển
                              </label>
                              <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                value={t.date}
                                onChange={(e) =>
                                  updateTransfer(idx, "date", e.target.value)
                                }
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs text-gray-500 mb-1">
                                Giờ chuyển
                              </label>
                              <input
                                type="time"
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                value={t.time || ""}
                                onChange={(e) =>
                                  updateTransfer(idx, "time", e.target.value)
                                }
                              />
                            </div>
                            <div className="md:col-span-1">
                              <label className="block text-xs text-gray-500 mb-1">
                                Số ngày
                              </label>
                              <input
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                value={t.days}
                                onChange={(e) =>
                                  updateTransfer(idx, "days", e.target.value)
                                }
                              />
                            </div>
                            <div className="md:col-span-1 flex justify-center">
                              <button
                                type="button"
                                onClick={() => removeTransfer(idx)}
                                className="text-red-400 hover:text-red-600 p-2"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400 italic text-sm">
                      Chưa có thông tin chuyển khoa
                    </div>
                  )}
                </div>
                {/* 17-19 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      17. Chuyển viện
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        {["Tuyến trên", "Tuyến dưới", "CK"].map((type) => (
                          <label
                            key={type}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="hospitalTransferType"
                              value={type}
                              checked={
                                formData.managementData?.hospitalTransfer
                                  ?.type === type
                              }
                              onChange={(e) =>
                                handleHospitalTransferChange(
                                  "type",
                                  e.target.value
                                )
                              }
                              className="w-4 h-4 text-vlu-red"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Chuyển đến:
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded outline-none text-sm"
                          placeholder="Tên bệnh viện..."
                          value={
                            formData.managementData?.hospitalTransfer
                              ?.destination || ""
                          }
                          onChange={(e) =>
                            handleHospitalTransferChange(
                              "destination",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      18. Ra viện
                    </label>
                    <div className="flex gap-4 flex-wrap mb-4">
                      {["Ra viện", "Xin về", "Bỏ về", "Đưa về"].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="dischargeType"
                            value={opt}
                            checked={
                              formData.managementData?.dischargeType === opt
                            }
                            onChange={(e) =>
                              handleManagementChange(
                                "dischargeType",
                                e.target.value
                              )
                            }
                            className="w-4 h-4 text-vlu-red"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      19. Tổng số ngày điều trị
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded outline-none"
                      value={formData.managementData?.totalDays || ""}
                      onChange={(e) =>
                        handleManagementChange("totalDays", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* III. CHẨN ĐOÁN */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800">III. CHẨN ĐOÁN</h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <span className="font-bold text-gray-700 block">
                    20. Nơi chuyển đến
                  </span>
                  <div className="flex gap-4 items-start">
                    <textarea
                      rows={2}
                      className="flex-1 p-2 border border-gray-300 rounded outline-none resize-y"
                      value={
                        formData.diagnosisInfo?.transferDiagnosis?.name || ""
                      }
                      onChange={(e) =>
                        handleDiagnosisChange(
                          "transferDiagnosis",
                          "name",
                          e.target.value
                        )
                      }
                    />
                    <div className="w-32">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded outline-none"
                        placeholder="Mã"
                        value={
                          formData.diagnosisInfo?.transferDiagnosis?.code || ""
                        }
                        onChange={(e) =>
                          handleDiagnosisChange(
                            "transferDiagnosis",
                            "code",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-gray-700 block">
                    21. KKB, Cấp cứu
                  </span>
                  <div className="flex gap-4 items-start">
                    <textarea
                      rows={2}
                      className="flex-1 p-2 border border-gray-300 rounded outline-none resize-y"
                      value={formData.diagnosisInfo?.kkbDiagnosis?.name || ""}
                      onChange={(e) =>
                        handleDiagnosisChange(
                          "kkbDiagnosis",
                          "name",
                          e.target.value
                        )
                      }
                    />
                    <div className="w-32">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded outline-none"
                        placeholder="Mã"
                        value={formData.diagnosisInfo?.kkbDiagnosis?.code || ""}
                        onChange={(e) =>
                          handleDiagnosisChange(
                            "kkbDiagnosis",
                            "code",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-gray-700 block">
                    22. Khi vào khoa điều trị
                  </span>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <textarea
                        rows={2}
                        className="w-full p-2 border border-gray-300 rounded outline-none mb-2 resize-y"
                        value={
                          formData.diagnosisInfo?.deptDiagnosis?.name || ""
                        }
                        onChange={(e) =>
                          handleDiagnosisChange(
                            "deptDiagnosis",
                            "name",
                            e.target.value
                          )
                        }
                      />
                      <div className="flex gap-6">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-vlu-red rounded"
                            checked={
                              formData.diagnosisInfo?.deptDiagnosis
                                ?.isProcedure || false
                            }
                            onChange={(e) =>
                              handleDiagnosisChange(
                                "deptDiagnosis",
                                "isProcedure",
                                e.target.checked
                              )
                            }
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Thủ thuật
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-vlu-red rounded"
                            checked={
                              formData.diagnosisInfo?.deptDiagnosis
                                ?.isSurgery || false
                            }
                            onChange={(e) =>
                              handleDiagnosisChange(
                                "deptDiagnosis",
                                "isSurgery",
                                e.target.checked
                              )
                            }
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Phẫu thuật
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="w-32">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded outline-none"
                        placeholder="Mã"
                        value={
                          formData.diagnosisInfo?.deptDiagnosis?.code || ""
                        }
                        onChange={(e) =>
                          handleDiagnosisChange(
                            "deptDiagnosis",
                            "code",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <span className="font-bold text-gray-700 block">
                    23. Ra Viện
                  </span>
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-500 mb-1 font-medium">
                      + Bệnh chính
                    </label>
                    <div className="flex gap-4 items-start">
                      <textarea
                        rows={2}
                        className="flex-1 p-2 border border-gray-300 rounded outline-none resize-y"
                        value={
                          formData.diagnosisInfo?.dischargeDiagnosis
                            ?.mainDisease?.name || ""
                        }
                        onChange={(e) => {
                          setFormData((prev) => {
                            if (!prev) return null;
                            return {
                            ...prev,
                            diagnosisInfo: {
                              ...prev.diagnosisInfo,
                              dischargeDiagnosis: {
                                ...prev.diagnosisInfo.dischargeDiagnosis,
                                mainDisease: {
                                  ...prev.diagnosisInfo.dischargeDiagnosis
                                    .mainDisease,
                                  name: e.target.value,
                                },
                              },
                            },
                          }
                        });
                        }}
                      />
                      <div className="w-32">
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded outline-none"
                          placeholder="Mã"
                          value={
                            formData.diagnosisInfo?.dischargeDiagnosis
                              ?.mainDisease?.code || ""
                          }
                          onChange={(e) => {
                            setFormData((prev) => {
                              if (!prev) return null;
                              return {
                              ...prev,
                              diagnosisInfo: {
                                ...prev.diagnosisInfo,
                                dischargeDiagnosis: {
                                  ...prev.diagnosisInfo.dischargeDiagnosis,
                                  mainDisease: {
                                    ...prev.diagnosisInfo.dischargeDiagnosis
                                      .mainDisease,
                                    code: e.target.value,
                                  },
                                },
                              },
                            }
                          });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-500 mb-1 font-medium">
                      + Bệnh kèm theo
                    </label>
                    <div className="flex gap-4 items-start">
                      <textarea
                        rows={2}
                        className="flex-1 p-2 border border-gray-300 rounded outline-none resize-y"
                        value={
                          formData.diagnosisInfo?.dischargeDiagnosis
                            ?.comorbidities?.name || ""
                        }
                        onChange={(e) => {
                          setFormData((prev) => {
                            if (!prev) return null;
                            return {
                            ...prev,
                            diagnosisInfo: {
                              ...prev.diagnosisInfo,
                              dischargeDiagnosis: {
                                ...prev.diagnosisInfo.dischargeDiagnosis,
                                comorbidities: {
                                  ...prev.diagnosisInfo.dischargeDiagnosis
                                    .comorbidities,
                                  name: e.target.value,
                                },
                              },
                            },
                          }
                        });
                        }}
                      />
                      <div className="w-32">
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded outline-none"
                          placeholder="Mã"
                          value={
                            formData.diagnosisInfo?.dischargeDiagnosis
                              ?.comorbidities?.code || ""
                          }
                          onChange={(e) => {
                            setFormData((prev) => {
                              if (!prev) return null;
                              return {
                              ...prev,
                              diagnosisInfo: {
                                ...prev.diagnosisInfo,
                                dischargeDiagnosis: {
                                  ...prev.diagnosisInfo.dischargeDiagnosis,
                                  comorbidities: {
                                    ...prev.diagnosisInfo.dischargeDiagnosis
                                      .comorbidities,
                                    code: e.target.value,
                                  },
                                },
                              },
                            }
                          });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6 pt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-vlu-red rounded"
                        checked={
                          formData.diagnosisInfo?.dischargeDiagnosis
                            ?.isAccident || false
                        }
                        onChange={(e) => {
                          setFormData((prev) => {
                            if (!prev) return null;
                            return {
                            ...prev,
                            diagnosisInfo: {
                              ...prev.diagnosisInfo,
                              dischargeDiagnosis: {
                                ...prev.diagnosisInfo.dischargeDiagnosis,
                                isAccident: e.target.checked,
                              },
                            },
                          }
                        });
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Tai biến
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-vlu-red rounded"
                        checked={
                          formData.diagnosisInfo?.dischargeDiagnosis
                            ?.isComplication || false
                        }
                        onChange={(e) => {
                          setFormData((prev) => {
                            if (!prev) return null;
                            return {
                            ...prev,
                            diagnosisInfo: {
                              ...prev.diagnosisInfo,
                              dischargeDiagnosis: {
                                ...prev.diagnosisInfo.dischargeDiagnosis,
                                isComplication: e.target.checked,
                              },
                            },
                          }
                        });
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Biến chứng
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* IV. TÌNH TRẠNG RA VIỆN */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800">
                  IV. TÌNH TRẠNG RA VIỆN
                </h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <span className="font-bold text-gray-700 block">
                    24. Kết quả điều trị
                  </span>
                  <div className="flex gap-6 flex-wrap">
                    {[
                      "1. Khỏi",
                      "2. Đỡ, giảm",
                      "3. Không thay đổi",
                      "4. Nặng hơn",
                      "5. Tử vong",
                    ].map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="treatmentResult"
                          value={opt}
                          checked={
                            formData.dischargeStatusInfo?.treatmentResult ===
                            opt
                          }
                          onChange={(e) =>
                            handleDischargeStatusChange(
                              "treatmentResult",
                              e.target.value
                            )
                          }
                          className="w-4 h-4 text-vlu-red"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-gray-700 block">
                    25. Giải phẫu bệnh
                  </span>
                  <div className="flex gap-6 flex-wrap">
                    {["1. Lành tính", "2. Nghi ngờ", "3. Ác tính"].map(
                      (opt) => (
                        <label
                          key={opt}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="pathology"
                            value={opt}
                            checked={
                              formData.dischargeStatusInfo?.pathology === opt
                            }
                            onChange={(e) =>
                              handleDischargeStatusChange(
                                "pathology",
                                e.target.value
                              )
                            }
                            className="w-4 h-4 text-vlu-red"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {opt}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
                <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
                  <span className="font-bold text-gray-700 block">
                    26. Tình hình tử vong
                  </span>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded outline-none"
                      placeholder="Ghi chú về tình hình tử vong..."
                      value={
                        formData.dischargeStatusInfo?.deathStatus
                          ?.description || ""
                      }
                      onChange={(e) => {
                        setFormData((prev) => {
                          if (!prev) return null;
                          return {
                          ...prev,
                          dischargeStatusInfo: {
                            ...prev.dischargeStatusInfo,
                            deathStatus: {
                              ...prev.dischargeStatusInfo.deathStatus,
                              description: e.target.value,
                            },
                          },
                        }
                      });
                      }}
                    />
                    <div className="flex gap-6 flex-wrap border-t border-gray-100 pt-2">
                      {["1. Do bệnh", "2. Do tai biến điều trị", "3. Khác"].map(
                        (opt) => (
                          <label
                            key={opt}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="deathCause"
                              value={opt}
                              checked={
                                formData.dischargeStatusInfo?.deathStatus
                                  ?.cause === opt
                              }
                              onChange={(e) => {
                                setFormData((prev) => {
                                  if (!prev) return null;
                                  return {
                                  ...prev,
                                  dischargeStatusInfo: {
                                    ...prev.dischargeStatusInfo,
                                    deathStatus: {
                                      ...prev.dischargeStatusInfo.deathStatus,
                                      cause: e.target.value,
                                    },
                                  },
                                }
                              });
                              }}
                              className="w-4 h-4 text-vlu-red"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {opt}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                    <div className="flex gap-6 flex-wrap border-t border-gray-100 pt-2">
                      {[
                        "1. Trong 24 giờ vào viện",
                        "2. Sau 24 giờ vào viện",
                      ].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="deathTime"
                            value={opt}
                            checked={
                              formData.dischargeStatusInfo?.deathStatus
                                ?.time === opt
                            }
                            onChange={(e) => {
                              setFormData((prev) => {
                                if (!prev) return null;
                                return {
                                ...prev,
                                dischargeStatusInfo: {
                                  ...prev.dischargeStatusInfo,
                                  deathStatus: {
                                    ...prev.dischargeStatusInfo.deathStatus,
                                    time: e.target.value,
                                  },
                                },
                              }
                            });
                            }}
                            className="w-4 h-4 text-vlu-red"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-gray-700 block">
                    27. Nguyên nhân chính tử vong
                  </span>
                  <div className="flex gap-4 items-start">
                    <textarea
                      rows={2}
                      className="flex-1 p-2 border border-gray-300 rounded outline-none resize-y"
                      value={
                        formData.dischargeStatusInfo?.mainCauseOfDeath?.name ||
                        ""
                      }
                      onChange={(e) => {
                        setFormData((prev) => {
                          if (!prev) return null;
                          return {
                          ...prev,
                          dischargeStatusInfo: {
                            ...prev.dischargeStatusInfo,
                            mainCauseOfDeath: {
                              ...prev.dischargeStatusInfo.mainCauseOfDeath,
                              name: e.target.value,
                            },
                          },
                        }
                      });
                      }}
                    />
                    <div className="w-32">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded outline-none"
                        placeholder="Mã"
                        value={
                          formData.dischargeStatusInfo?.mainCauseOfDeath
                            ?.code || ""
                        }
                        onChange={(e) => {
                          setFormData((prev) => {
                            if (!prev) return null;
                            return {
                            ...prev,
                            dischargeStatusInfo: {
                              ...prev.dischargeStatusInfo,
                              mainCauseOfDeath: {
                                ...prev.dischargeStatusInfo.mainCauseOfDeath,
                                code: e.target.value,
                              },
                            },
                          }
                        });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <span className="mr-3 font-bold text-gray-700">
                      28. Khám nghiệm tử thi
                    </span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-vlu-red rounded"
                      checked={formData.dischargeStatusInfo?.isAutopsy || false}
                      onChange={(e) =>
                        handleDischargeStatusChange(
                          "isAutopsy",
                          e.target.checked
                        )
                      }
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-gray-700 block">
                    29. Chẩn đoán giải phẫu tử thi
                  </span>
                  <div className="flex gap-4 items-start">
                    <textarea
                      rows={2}
                      className="flex-1 p-2 border border-gray-300 rounded outline-none resize-y"
                      value={
                        formData.dischargeStatusInfo?.autopsyDiagnosis?.name ||
                        ""
                      }
                      onChange={(e) => {
                        setFormData((prev) => {
                          if (!prev) return null;
                          return {
                          ...prev,
                          dischargeStatusInfo: {
                            ...prev.dischargeStatusInfo,
                            autopsyDiagnosis: {
                              ...prev.dischargeStatusInfo.autopsyDiagnosis,
                              name: e.target.value,
                            },
                          },
                        }
                      });
                      }}
                    />
                    <div className="w-32">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded outline-none"
                        placeholder="Mã"
                        value={
                          formData.dischargeStatusInfo?.autopsyDiagnosis
                            ?.code || ""
                        }
                        onChange={(e) => {
                          setFormData((prev) => {
                            if (!prev) return null;
                            return {
                            ...prev,
                            dischargeStatusInfo: {
                              ...prev.dischargeStatusInfo,
                              autopsyDiagnosis: {
                                ...prev.dischargeStatusInfo.autopsyDiagnosis,
                                code: e.target.value,
                              },
                            },
                          }
                        });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">A. BỆNH ÁN</h3>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">
                  I. Lý do vào viện
                </h4>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lý do
                    </label>
                    <input
                      type="text"
                      className="w-full p-2.5 border border-gray-300 rounded-lg outline-none"
                      value={formData.medicalRecordContent?.reason || ""}
                      onChange={(e) =>
                        handleMedicalRecordChange("reason", e.target.value)
                      }
                      placeholder="Nhập lý do vào viện"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Vào ngày thứ</span>
                    <input
                      type="text"
                      className="w-20 p-2 border border-gray-300 rounded-lg text-center"
                      value={formData.medicalRecordContent?.dayOfIllness || ""}
                      onChange={(e) =>
                        handleMedicalRecordChange(
                          "dayOfIllness",
                          e.target.value
                        )
                      }
                    />
                    <span className="text-gray-700">của bệnh</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">
                  II. Hỏi bệnh
                </h4>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    1. Quá trình bệnh lý
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-y"
                    value={
                      formData.medicalRecordContent?.pathologicalProcess || ""
                    }
                    onChange={(e) =>
                      handleMedicalRecordChange(
                        "pathologicalProcess",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    2. Tiền sử bệnh
                  </label>
                  <div className="ml-4 mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      + Bản thân
                    </label>
                    <textarea
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-y"
                      value={
                        formData.medicalRecordContent?.personalHistory || ""
                      }
                      onChange={(e) =>
                        handleMedicalRecordChange(
                          "personalHistory",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="ml-4 mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      - Đặc điểm liên quan đến bệnh
                    </label>
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2">TT</th>
                          <th className="border p-2">Ký hiệu</th>
                          <th className="border p-2">Thời gian</th>
                        </tr>
                      </thead>
                      <tbody>
                        {characteristicsList.map((item, index) => {
                          const data = formData.medicalRecordContent
                            ?.relatedCharacteristics?.[item.key] || {
                            isChecked: false,
                            time: "",
                          };
                          return (
                            <tr key={item.key}>
                              <td className="border p-2 text-center">
                                {index + 1}
                              </td>
                              <td className="border p-2">
                                <label className="flex items-center">
                                  <span className="mr-2 w-24">
                                    {item.label}
                                  </span>
                                  <input
                                    type="checkbox"
                                    checked={data.isChecked || false}
                                    onChange={(e) =>
                                      handleCharacteristicChange(
                                        item.key as keyof RelatedCharacteristics,
                                        "isChecked",
                                        e.target.checked
                                      )
                                    }
                                  />
                                </label>
                              </td>
                              <td className="border p-2">
                                <input
                                  type="text"
                                  className="w-full p-1"
                                  value={data.time || ""}
                                  onChange={(e) =>
                                    handleCharacteristicChange(
                                      item.key as keyof RelatedCharacteristics,
                                      "time",
                                      e.target.value
                                    )
                                  }
                                  disabled={!data.isChecked}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="ml-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      + Gia đình
                    </label>
                    <textarea
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-y"
                      value={formData.medicalRecordContent?.familyHistory || ""}
                      onChange={(e) =>
                        handleMedicalRecordChange(
                          "familyHistory",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">
                  III. Khám bệnh
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      1. Toàn thân
                    </label>
                    <textarea
                      rows={8}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-y"
                      value={
                        formData.medicalRecordContent?.overallExamination || ""
                      }
                      onChange={(e) =>
                        handleMedicalRecordChange(
                          "overallExamination",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <table className="w-full border-collapse border border-gray-300">
                      <tbody>
                        {[
                          { f: "pulse", l: "Mạch", u: "lần/ph" },
                          { f: "temperature", l: "Nhiệt độ", u: "°C" },
                          { f: "bloodPressure", l: "Huyết áp", u: "mmHg" },
                          {
                            f: "respiratoryRate",
                            l: "Nhịp thở",
                            u: "lần/ph",
                          },
                          { f: "weight", l: "Cân nặng", u: "kg" },
                        ].map((v) => (
                          <tr key={v.f}>
                            <td className="border p-2 bg-gray-50">{v.l}</td>
                            <td className="border p-2">
                              <input
                                type="text"
                                className="w-full text-center"
                                value={
                                  formData.medicalRecordContent?.vitalSigns?.[
                                    v.f
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleVitalSignsChange(v.f as keyof VitalSigns, e.target.value)
                                }
                              />
                            </td>
                            <td className="border p-2 text-right">{v.u}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    2. Các cơ quan
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {organFields.map((field) => (
                      <div key={field.key} className="flex flex-col">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          {field.label}
                        </label>
                        <textarea
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded resize-y"
                          value={
                            formData.medicalRecordContent?.organs?.[
                              field.key
                            ] || ""
                          }
                          onChange={(e) =>
                            handleOrgansChange(field.key as keyof Organs, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    3. Các xét nghiệm lâm sàng cần làm
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-y"
                    value={formData.medicalRecordContent?.clinicalTests || ""}
                    onChange={(e) =>
                      handleMedicalRecordChange("clinicalTests", e.target.value)
                    }
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    4. Tóm tắt bệnh án
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-y"
                    value={formData.medicalRecordContent?.summary || ""}
                    onChange={(e) =>
                      handleMedicalRecordChange("summary", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">
                  IV. Chẩn đoán khi vào khoa điều trị
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      + Bệnh chính
                    </label>
                    <textarea
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded resize-y"
                      value={
                        formData.medicalRecordContent?.admissionDiagnosis
                          ?.mainDisease || ""
                      }
                      onChange={(e) =>
                        handleAdmissionDiagnosisChange(
                          "mainDisease",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      + Bệnh kèm theo (nếu có)
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={
                        formData.medicalRecordContent?.admissionDiagnosis
                          ?.comorbidities || ""
                      }
                      onChange={(e) =>
                        handleAdmissionDiagnosisChange(
                          "comorbidities",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      + Phân biệt
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={
                        formData.medicalRecordContent?.admissionDiagnosis
                          ?.differential || ""
                      }
                      onChange={(e) =>
                        handleAdmissionDiagnosisChange(
                          "differential",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">
                  V. Tiên lượng
                </h4>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.medicalRecordContent?.prognosis || ""}
                  onChange={(e) =>
                    handleMedicalRecordChange("prognosis", e.target.value)
                  }
                />
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">
                  VI. Hướng điều trị
                </h4>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-y"
                  value={formData.medicalRecordContent?.treatmentPlan || ""}
                  onChange={(e) =>
                    handleMedicalRecordChange("treatmentPlan", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-6">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-gray-200 rounded-lg font-bold flex items-center"
            >
              <ArrowLeft size={20} className="mr-2" /> Quay lại
            </button>
          )}
          {step === 1 ? (
            <button
              type="button"
              onClick={() => {
                setStep(2);
                setLastStepChange(Date.now());
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-8 py-3 bg-vlu-red text-white rounded-lg font-bold flex items-center"
            >
              Tiếp tục <ArrowRight size={20} className="ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-3 bg-yellow-500 text-white rounded-lg font-bold flex items-center"
            >
              <Save size={20} className="mr-2" /> Tạo Hồ Sơ
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateRecord;