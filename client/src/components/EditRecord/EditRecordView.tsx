import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/services/api";
import { RecordForm } from "./RecordForm";
import type { Record, Patient } from "@/types";
import { toast } from "sonner";

export const EditRecordView = () => {
  const { id } = useParams(); // This is the storageCode from URL
  const navigate = useNavigate();
  const [record, setRecord] = useState<Record | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecordData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // 1. Resolve storageCode to numericId by searching
      const searchResult = await api.medicalRecords.getAll({ searchPhrase: id, pageSize: 5 });
      const recordItem = searchResult.items?.find((item: any) => item.storageCode === id);
      
      if (!recordItem) {
        throw new Error("Không tìm thấy hồ sơ với mã lưu trữ này");
      }

      // 2. Fetch full detail using numericId
      const dto = await api.medicalRecords.getById(recordItem.id);
      
      // 3. Map API DTO to Frontend Record interface
      const mappedRecord: Record = mapDtoToRecord(dto);
      const mappedPatient: Patient = mapDtoToPatient(dto.patient, dto);

      setRecord(mappedRecord);
      setPatient(mappedPatient);
    } catch (error: any) {
      console.error("Failed to fetch record:", error);
      toast.error(error.message || "Lỗi khi tải dữ liệu hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordData();
  }, [id]);

  const handleUpdate = async (updatedRecord: Record, patientSnapshot: Patient) => {
    if (!record?.numericId) return;
    
    try {
      const updateCommand = mapRecordToUpdateCommand(updatedRecord, patientSnapshot, record.numericId);
      console.log("Updating Record with payload:", updateCommand);
      
      const response = await fetch(`https://localhost:5001/api/medical-records/${record.numericId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateCommand),
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Cập nhật thất bại: ${response.status} - ${txt}`);
      }

      toast.success("Cập nhật hồ sơ bệnh án thành công!");
      navigate(`/record/${id}`);
    } catch (error: any) {
      console.error("Failed to update record:", error);
      toast.error(error.message || "Lỗi khi cập nhật hồ sơ");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-xl font-semibold text-gray-700">Đang tải hồ sơ...</div>
      </div>
    );
  }

  if (!record || !patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-xl font-semibold text-gray-700">Không tìm thấy hồ sơ hoặc thông tin bệnh nhân</h2>
        <button onClick={() => navigate(-1)} className="text-vlu-red underline">Quay lại</button>
      </div>
    );
  }

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

// --- MAPPING HELPERS ---

const mapDtoToPatient = (apiPatient: any, recordDto: any): Patient => {
  const dobDate = apiPatient.dateOfBirth ? new Date(apiPatient.dateOfBirth) : null;
  const age = dobDate && !isNaN(dobDate.getTime()) ? new Date().getFullYear() - dobDate.getFullYear() : 0;
  const genderText = apiPatient.gender === 1 ? "Nam" : apiPatient.gender === 2 ? "Nữ" : "Khác";
  const paymentCategoryMapInv: any = { 1: "BHYT", 2: "Thu phí", 3: "Miễn", 4: "Khác" };

  return {
    id: apiPatient.id,
    fullName: apiPatient.name,
    cccd: "", 
    insuranceNumber: apiPatient.healthInsuranceNumber,
    dob: apiPatient.dateOfBirth?.split('T')[0] || "",
    age: age,
    gender: genderText,
    ethnicity: apiPatient.ethnicity?.name ?? "",
    
    // Snapshots from recordDto
    job: recordDto.jobTitle || "",
    jobCode: recordDto.jobTitleCode || "",
    nationality: "Việt Nam", // Default or map if available
    address: recordDto.address || "",
    workplace: recordDto.addressJob || "",
    subjectType: paymentCategoryMapInv[recordDto.paymentCategory] || "",
    insuranceExpiry: recordDto.healthInsuranceExpiryDate?.split('T')[0] || "",
    relativeInfo: recordDto.relativeInfo || "",
    relativePhone: recordDto.relativePhone || "",
    
    // Address parts
    provinceName: recordDto.provinceName || "",
    districtName: recordDto.districtName || "",
    wardName: recordDto.wardName || "",
    provinceCode: recordDto.provinceCode,
    districtCode: recordDto.districtCode,
  } as any;
};

const mapDtoToRecord = (dto: any): Record => {
  const admissionDate = dto.admissionTime ? dto.admissionTime.split('T')[0] : "";
  const admissionTime = dto.admissionTime ? dto.admissionTime.split('T')[1].substring(0, 5) : "";
  const dischargeDate = dto.dischargeTime ? dto.dischargeTime.split('T')[0] : "";
  const dischargeTime = dto.dischargeTime ? dto.dischargeTime.split('T')[1].substring(0, 5) : "";

  // Reverse Map Enums to UI Strings
  const treatmentResultMapInv: any = { 1: "Khoi", 2: "DoGiam", 3: "KhongThayDoi", 4: "NangHon", 5: "TuVong" };
  const pathologyResultMapInv: any = { 1: "Lành tính", 2: "Nghi ngờ", 3: "Ác tính" };
  const deathCauseMapInv: any = { 1: "Do bệnh", 2: "Do tai biến điều trị", 3: "Khác" };
  const deathTimeGroupMapInv: any = { 1: "Trong 24 giờ vào viện", 2: "Sau 24 giờ vào viện" };
  const recordTypeMapInv: any = { 1: "internal", 2: "surgery" };
  const admissionTypeMapInv: any = { 1: "Cấp cứu", 2: "KKB", 3: "Khoa điều trị" };
  const referralSourceMapInv: any = { 1: "Cơ quan y tế", 2: "Tự đến", 3: "Khác" };
  const hospitalTransferTypeMapInv: any = { 1: "Tuyến trên", 2: "Tuyến dưới", 3: "CK" };
  const dischargeTypeMapInv: any = { 1: "Ra viện", 2: "Xin về", 3: "Bỏ về", 4: "Đưa về" };

  const riskFactors: any = {
    allergy: { isChecked: false, time: "" },
    drugs: { isChecked: false, time: "" },
    alcohol: { isChecked: false, time: "" },
    tobacco: { isChecked: false, time: "" },
    pipeTobacco: { isChecked: false, time: "" },
    other: { isChecked: false, time: "" }
  };

  const riskFactorKeyMap: any = { 1: "allergy", 2: "drugs", 3: "alcohol", 4: "tobacco", 5: "pipeTobacco", 6: "other" };
  dto.detail?.riskFactors?.forEach((rf: any) => {
    const key = riskFactorKeyMap[rf.signed];
    if (key) {
      riskFactors[key] = { isChecked: true, time: rf.durationMonth?.toString() || "" };
    }
  });

  return {
    id: dto.storageCode || dto.id.toString(),
    numericId: dto.id,
    storageCode: dto.storageCode,
    patientId: dto.patientId.toString(),
    patientName: dto.patient.name,
    cccd: "",
    insuranceNumber: dto.patient.healthInsuranceNumber,
    dob: dto.patient.dateOfBirth?.split('T')[0] || "",
    age: 0,
    gender: dto.patient.gender === 1 ? "Nam" : "Nữ",
    admissionDate: admissionDate,
    dischargeDate: dischargeDate,
    department: dto.recordType === 1 ? "Nội Khoa" : "Ngoại Khoa",
    type: recordTypeMapInv[dto.recordType] || "internal",
    documents: [],
    managementData: {
      admissionTime: admissionTime,
      admissionType: admissionTypeMapInv[dto.admissionType] || "",
      referralSource: referralSourceMapInv[dto.referralSource] || "",
      admissionCount: dto.admissionCount || "1",
      transfers: dto.departmentTransfers?.map((t: any) => ({
        department: t.name,
        date: t.admissionTime?.split('T')[0] || "",
        time: t.admissionTime?.split('T')[1]?.substring(0, 5) || "",
        days: t.treatmentDays || "0",
        transferType: t.transferType
      })) || [],
      hospitalTransfer: { 
        type: hospitalTransferTypeMapInv[dto.hospitalTransferType] || "", 
        destination: dto.hospitalTransferDestination || "" 
      },
      dischargeType: dischargeTypeMapInv[dto.dischargeType] || "",
      dischargeTime: dischargeTime,
      totalDays: dto.totalTreatmentDays || "0"
    },
    diagnosisInfo: {
      transferDiagnosis: { name: dto.referralDiagnosis || "", code: dto.referralCode || "" },
      kkbDiagnosis: { name: dto.admissionDiagnosis || "", code: dto.admissionCode || "" },
      deptDiagnosis: { 
        name: dto.departmentDiagnosis || "", 
        code: dto.departmentCode || "", 
        isSurgery: dto.hasSurgery, 
        isProcedure: dto.hasProcedure 
      },
      dischargeDiagnosis: {
        mainDisease: { name: dto.dischargeMainDiagnosis || "", code: dto.dischargeMainCode || "" },
        comorbidities: { name: dto.dischargeSubDiagnosis || "", code: dto.dischargeSubCode || "" },
        isAccident: dto.hasAccident,
        isComplication: dto.hasComplication
      }
    },
    dischargeStatusInfo: {
      treatmentResult: treatmentResultMapInv[dto.treatmentResult] || "",
      pathology: pathologyResultMapInv[dto.pathologyResult] || "",
      deathStatus: { 
        description: dto.deathReason || "", 
        cause: deathCauseMapInv[dto.deathCause] || "", 
        time: deathTimeGroupMapInv[dto.deathTimeGroup] || "" 
      },
      mainCauseOfDeath: { name: dto.deathMainReason || "", code: dto.deathMainCode?.toString() || "" },
      isAutopsy: dto.hasAutopsy,
      autopsyDiagnosis: { name: dto.diagnosisAutopsy || "", code: dto.diagnosisCode?.toString() || "" }
    },
    medicalRecordContent: {
      reason: dto.detail?.admissionReason || "",
      dayOfIllness: "",
      pathologicalProcess: dto.detail?.pathologicalProcess || "",
      personalHistory: dto.detail?.personalHistory || "",
      familyHistory: dto.detail?.familyHistory || "",
      relatedCharacteristics: riskFactors,
      overallExamination: dto.detail?.examGeneral || "",
      vitalSigns: {
        pulse: dto.detail?.pulseRate || "",
        temperature: dto.detail?.temperature || "",
        bloodPressure: dto.detail?.bloodPressure || "",
        respiratoryRate: dto.detail?.respiratoryRate || "",
        weight: dto.detail?.bodyWeight || ""
      },
      organs: {
        circulatory: dto.detail?.examCardio || "",
        respiratory: dto.detail?.examRespiratory || "",
        digestive: dto.detail?.examGastro || "",
        kidneyUrology: dto.detail?.examRenalUrology || "",
        neurological: dto.detail?.examNeurological || "",
        musculoskeletal: dto.detail?.examMusculoskeletal || "",
        ent: dto.detail?.examENT || "",
        maxillofacial: dto.detail?.examMaxillofacial || "",
        eye: dto.detail?.examOphthalmology || "",
        endocrineAndOthers: dto.detail?.examEndocrineOthers || ""
      },
      clinicalTests: dto.detail?.requiredClinicalTests || "",
      summary: dto.detail?.medicalSummary || "",
      admissionDiagnosis: {
        mainDisease: dto.detail?.diagnosisMain || "",
        comorbidities: dto.detail?.diagnosisSub || "",
        differential: dto.detail?.diagnosisDifferential || ""
      },
      prognosis: dto.detail?.prognosis || "",
      treatmentPlan: dto.detail?.treatmentPlan || ""
    }
  };
};

const mapRecordToUpdateCommand = (newRecord: Record, patientSnapshot: any, numericId: number) => {
  const recordTypeMap: any = { internal: 1, surgery: 2 };
  const admissionTypeMap: any = { "Cấp cứu": 1, "KKB": 2, "Khoa điều trị": 3 };
  const referralSourceMap: any = { "Cơ quan y tế": 1, "Tự đến": 2, "Khác": 3 };
  const hospitalTransferTypeMap: any = { "Tuyến trên": 1, "Tuyến dưới": 2, "CK": 3 };
  const dischargeTypeMap: any = { "Ra viện": 1, "Xin về": 2, "Bỏ về": 3, "Đưa về": 4 };
  const paymentCategoryMap: any = { BHYT: 1, "Thu phí": 2, Miễn: 3, Khác: 4 };
  const treatmentResultMap: any = { Khoi: 1, DoGiam: 2, KhongThayDoi: 3, NangHon: 4, TuVong: 5 };
  const pathologyResultMap: any = { "Lành tính": 1, "Nghi ngờ": 2, "Ác tính": 3 };
  const deathCauseMap: any = { "Do bệnh": 1, "Do tai biến điều trị": 2, "Khác": 3 };
  const deathTimeGroupMap: any = { "Trong 24 giờ vào viện": 1, "Sau 24 giờ vào viện": 2 };
  const riskFactorSignedMap: any = { allergy: 1, drugs: 2, alcohol: 3, tobacco: 4, pipeTobacco: 5, other: 6 };

  const isoDateAtMidnightUTC = (dateStr?: string) => {
    if (!dateStr) return undefined;
    const d = new Date(`${dateStr}T00:00:00.000Z`);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  };

  const combineDateTimeToIso = (dateStr?: string, timeStr?: string) => {
    if (!dateStr || !timeStr) return undefined;
    const d = new Date(`${dateStr}T${timeStr}:00`);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  };

  const riskFactors = Object.entries(riskFactorSignedMap)
    .map(([key, signed]) => {
      const item = (newRecord.medicalRecordContent.relatedCharacteristics as any)?.[key];
      if (!item?.isChecked) return null;
      const duration = parseInt(item.time, 10);
      return { signed, isPossible: null, durationMonth: isNaN(duration) ? null : duration };
    })
    .filter(Boolean);

  return {
    id: numericId,
    patientId: parseInt(newRecord.patientId),
    recordType: recordTypeMap[newRecord.type] ?? 1,
    
    // Patient Snapshot fields
    jobTitle: patientSnapshot.job || "",
    jobTitleCode: patientSnapshot.jobCode || "",
    addressJob: patientSnapshot.workplace || "",
    address: patientSnapshot.address || "",
    provinceCode: patientSnapshot.provinceCode || null,
    districtCode: patientSnapshot.districtCode || null,
    provinceName: patientSnapshot.provinceName || null,
    districtName: patientSnapshot.districtName || null,
    wardName: patientSnapshot.wardName || null,
    healthInsuranceExpiryDate: isoDateAtMidnightUTC(patientSnapshot.insuranceExpiry),
    relativeInfo: patientSnapshot.relativeInfo || "",
    relativePhone: patientSnapshot.relativePhone || "",
    paymentCategory: paymentCategoryMap[patientSnapshot.subjectType] ?? null,

    // Management
    admissionTime: combineDateTimeToIso(newRecord.admissionDate, newRecord.managementData.admissionTime),
    admissionType: admissionTypeMap[newRecord.managementData.admissionType] ?? null,
    referralSource: referralSourceMap[newRecord.managementData.referralSource] ?? null,
    admissionCount: newRecord.managementData.admissionCount.toString(),
    hospitalTransferType: hospitalTransferTypeMap[newRecord.managementData.hospitalTransfer?.type] ?? null,
    hospitalTransferDestination: newRecord.managementData.hospitalTransfer?.destination || "",
    dischargeTime: combineDateTimeToIso(newRecord.dischargeDate, newRecord.managementData.dischargeTime),
    dischargeType: dischargeTypeMap[newRecord.managementData.dischargeType] ?? null,
    totalTreatmentDays: newRecord.managementData.totalDays.toString(),
    
    // Diagnosis
    referralDiagnosis: newRecord.diagnosisInfo.transferDiagnosis?.name ?? "",
    referralCode: newRecord.diagnosisInfo.transferDiagnosis?.code ?? "",
    admissionDiagnosis: newRecord.diagnosisInfo.kkbDiagnosis?.name ?? "",
    admissionCode: newRecord.diagnosisInfo.kkbDiagnosis?.code ?? "",
    departmentDiagnosis: newRecord.diagnosisInfo.deptDiagnosis?.name ?? "",
    departmentCode: newRecord.diagnosisInfo.deptDiagnosis?.code ?? "",
    hasProcedure: newRecord.diagnosisInfo.deptDiagnosis?.isProcedure,
    hasSurgery: newRecord.diagnosisInfo.deptDiagnosis?.isSurgery,
    dischargeMainDiagnosis: newRecord.diagnosisInfo.dischargeDiagnosis?.mainDisease?.name ?? "",
    dischargeMainCode: newRecord.diagnosisInfo.dischargeDiagnosis?.mainDisease?.code ?? "",
    dischargeSubDiagnosis: newRecord.diagnosisInfo.dischargeDiagnosis?.comorbidities?.name ?? "",
    dischargeSubCode: newRecord.diagnosisInfo.dischargeDiagnosis?.comorbidities?.code ?? "",
    hasAccident: newRecord.diagnosisInfo.dischargeDiagnosis?.isAccident,
    hasComplication: newRecord.diagnosisInfo.dischargeDiagnosis?.isComplication,

    // Status & Result
    treatmentResult: treatmentResultMap[newRecord.dischargeStatusInfo.treatmentResult] ?? 0,
    pathologyResult: pathologyResultMap[newRecord.dischargeStatusInfo.pathology] ?? 0,
    deathCause: deathCauseMap[newRecord.dischargeStatusInfo.deathStatus.cause] ?? 0,
    deathTimeGroup: deathTimeGroupMap[newRecord.dischargeStatusInfo.deathStatus.time] ?? 0,
    deathReason: newRecord.dischargeStatusInfo.deathStatus.description ?? "",
    deathMainReason: newRecord.dischargeStatusInfo.mainCauseOfDeath.name ?? "",
    deathMainCode: parseInt(newRecord.dischargeStatusInfo.mainCauseOfDeath.code) || 0,
    hasAutopsy: newRecord.dischargeStatusInfo.isAutopsy,
    diagnosisAutopsy: newRecord.dischargeStatusInfo.autopsyDiagnosis.name ?? "",
    diagnosisCode: parseInt(newRecord.dischargeStatusInfo.autopsyDiagnosis.code) || 0,

    departmentTransfers: newRecord.managementData.transfers.map((t, idx) => ({
      name: t.department || "",
      admissionTime: combineDateTimeToIso(t.date, t.time || "00:00") || new Date().toISOString(),
      transferType: t.transferType ?? (idx === 0 ? 1 : 2),
      treatmentDays: t.days.toString()
    })),

    // Medical Record Detail (A)
    detail: {
      admissionReason: newRecord.medicalRecordContent.reason ?? "",
      pathologicalProcess: newRecord.medicalRecordContent.pathologicalProcess ?? "",
      personalHistory: newRecord.medicalRecordContent.personalHistory ?? "",
      familyHistory: newRecord.medicalRecordContent.familyHistory ?? "",
      examGeneral: newRecord.medicalRecordContent.overallExamination ?? "",
      examCardio: newRecord.medicalRecordContent.organs?.circulatory ?? "",
      examRespiratory: newRecord.medicalRecordContent.organs?.respiratory ?? "",
      examGastro: newRecord.medicalRecordContent.organs?.digestive ?? "",
      examRenalUrology: newRecord.medicalRecordContent.organs?.kidneyUrology ?? "",
      examNeurological: newRecord.medicalRecordContent.organs?.neurological ?? "",
      examMusculoskeletal: newRecord.medicalRecordContent.organs?.musculoskeletal ?? "",
      examENT: newRecord.medicalRecordContent.organs?.ent ?? "",
      examMaxillofacial: newRecord.medicalRecordContent.organs?.maxillofacial ?? "",
      examOphthalmology: newRecord.medicalRecordContent.organs?.eye ?? "",
      examEndocrineOthers: newRecord.medicalRecordContent.organs?.endocrineAndOthers ?? "",
      requiredClinicalTests: newRecord.medicalRecordContent.clinicalTests ?? "",
      medicalSummary: newRecord.medicalRecordContent.summary ?? "",
      diagnosisMain: newRecord.medicalRecordContent.admissionDiagnosis?.mainDisease ?? "",
      diagnosisSub: newRecord.medicalRecordContent.admissionDiagnosis?.comorbidities ?? "",
      diagnosisDifferential: newRecord.medicalRecordContent.admissionDiagnosis?.differential ?? "",
      pulseRate: newRecord.medicalRecordContent.vitalSigns?.pulse ?? "",
      temperature: newRecord.medicalRecordContent.vitalSigns?.temperature ?? "",
      bloodPressure: newRecord.medicalRecordContent.vitalSigns?.bloodPressure ?? "",
      respiratoryRate: newRecord.medicalRecordContent.vitalSigns?.respiratoryRate ?? "",
      bodyWeight: newRecord.medicalRecordContent.vitalSigns?.weight ?? "",
      prognosis: newRecord.medicalRecordContent.prognosis ?? "",
      treatmentPlan: newRecord.medicalRecordContent.treatmentPlan ?? "",
      riskFactors: riskFactors
    }
  };
};
