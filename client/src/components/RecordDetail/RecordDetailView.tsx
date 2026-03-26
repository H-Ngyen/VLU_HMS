import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { ViewRecordForm } from "../ViewRecord/RecordForm";
import { Button } from "@/components/ui/button";
import type { Record, Patient } from "@/types";
import { toast } from "sonner";

export const RecordDetailView = () => {
  const { id } = useParams(); // storageCode from URL
  const navigate = useNavigate();
  const [record, setRecord] = useState<Record | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // 1. Resolve storageCode to numericId
      const searchResult = await api.medicalRecords.getAll({ searchPhrase: id, pageSize: 5 });
      const recordItem = searchResult.items?.find((item: any) => item.storageCode === id);
      
      if (!recordItem) {
        throw new Error("Không tìm thấy hồ sơ với mã lưu trữ này");
      }

      // 2. Fetch full detail
      const dto = await api.medicalRecords.getById(recordItem.id);
      
      // 3. Map API DTO to Frontend
      const mappedRecord: Record = mapDtoToRecord(dto);
      const mappedPatient: Patient = mapDtoToPatient(dto.patient, dto);

      setRecord(mappedRecord);
      setPatient(mappedPatient);
    } catch (error: any) {
      console.error("Failed to fetch record detail:", error);
      toast.error(error.message || "Lỗi khi tải chi tiết hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-xl font-semibold text-gray-700">Đang tải chi tiết hồ sơ...</div>
      </div>
    );
  }

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

// --- MAPPING HELPERS ---

const formatIsoToLocal = (isoString?: string) => {
  if (!isoString) return { date: "", time: "" };
  const parts = isoString.split('T');
  const date = parts[0] || "";
  const time = parts[1] ? parts[1].substring(0, 5) : "";
  return { date, time };
};

const mapDtoToPatient = (apiPatient: any, recordDto: any): Patient => {
  const dobDate = apiPatient.dateOfBirth ? new Date(apiPatient.dateOfBirth) : null;
  const age = dobDate && !isNaN(dobDate.getTime()) ? new Date().getFullYear() - dobDate.getFullYear() : 0;
  const genderText = apiPatient.gender === 1 ? "Nam" : apiPatient.gender === 2 ? "Nữ" : "Khác";
  const paymentCategoryMapInv: any = { 1: "BHYT", 2: "Thu phí", 3: "Miễn", 4: "Khác" };

  // Parse address parts from the combined address string
  const fullAddress = recordDto.address || "";
  const addressParts = fullAddress.split(",").map((p: string) => p.trim());
  
  let houseNumber = "";
  let village = "";
  
  const knownWard = recordDto.wardName?.trim();
  const knownDistrict = recordDto.districtName?.trim();
  const knownProvince = recordDto.provinceName?.trim();

  const remainingParts = [...addressParts];
  if (knownProvince && remainingParts[remainingParts.length - 1] === knownProvince) remainingParts.pop();
  if (knownDistrict && remainingParts[remainingParts.length - 1] === knownDistrict) remainingParts.pop();
  if (knownWard && remainingParts[remainingParts.length - 1] === knownWard) remainingParts.pop();

  if (remainingParts.length >= 2) {
    houseNumber = remainingParts[0];
    village = remainingParts.slice(1).join(", ");
  } else if (remainingParts.length === 1) {
    if (/^\d+/.test(remainingParts[0])) {
      houseNumber = remainingParts[0];
    } else {
      village = remainingParts[0];
    }
  }

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
    nationality: "Việt Nam",
    address: recordDto.address || "",
    workplace: recordDto.addressJob || "",
    subjectType: paymentCategoryMapInv[recordDto.paymentCategory] || "",
    insuranceExpiry: recordDto.healthInsuranceExpiryDate?.split('T')[0] || "",
    relativeInfo: recordDto.relativeInfo || "",
    relativePhone: recordDto.relativePhone || "",
    
    // Address parts for UI
    houseNumber,
    village,
    provinceName: recordDto.provinceName || "",
    districtName: recordDto.districtName || "",
    wardName: recordDto.wardName || "",
  } as any;
};

const mapDtoToRecord = (dto: any): Record => {
  const { date: admissionDate, time: admissionTime } = formatIsoToLocal(dto.admissionTime);
  const { date: dischargeDate, time: dischargeTime } = formatIsoToLocal(dto.dischargeTime);

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
      referralSource: referralSourceMap[dto.referralSource] || "",
      admissionCount: dto.admissionCount || "1",
      transfers: dto.departmentTransfers?.map((t: any) => {
        const { date, time } = formatIsoToLocal(t.admissionTime);
        return {
          department: t.name,
          date,
          time,
          days: t.treatmentDays || "0",
          transferType: t.transferType
        };
      }) || [],
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
      dayOfIllness: dto.detail?.illnessDay?.toString() || "",
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