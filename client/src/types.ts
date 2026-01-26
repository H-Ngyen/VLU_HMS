export interface Patient {
  id: string;
  fullName: string;
  cccd: string;
  dob: string;
  age: number;
  gender: string;
  job: string;
  jobCode: string;
  ethnicity: string;
  nationality: string;
  address: string;
  addressStreet: string;
  addressWard: string;
  addressDistrict: string;
  addressProvince: string;
  workplace: string;
  subjectType: string;
  insuranceExpiry: string;
  insuranceNumber: string;
  relativeInfo: string;
  relativePhone: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  fileName: string;
  date: string;
  url?: string;
  data?: any;
}

export interface Transfer {
  department: string;
  date: string;
  days: number | string;
  time?: string;
}

export interface HospitalTransfer {
  type: string;
  destination: string;
}

export interface ManagementData {
  admissionTime: string;
  admissionType: string;
  referralSource: string;
  admissionCount: number | string;
  transfers: Transfer[];
  hospitalTransfer: HospitalTransfer;
  dischargeType: string;
  totalDays: number | string;
}

export interface RelatedCharacteristic {
  isChecked: boolean;
  time: string;
}

export interface RelatedCharacteristics {
  [key: string]: RelatedCharacteristic;
  allergy: RelatedCharacteristic;
  drugs: RelatedCharacteristic;
  alcohol: RelatedCharacteristic;
  tobacco: RelatedCharacteristic;
  pipeTobacco: RelatedCharacteristic;
  other: RelatedCharacteristic;
}

export interface VitalSigns {
  [key: string]: string;
  pulse: string;
  temperature: string;
  bloodPressure: string;
  respiratoryRate: string;
  weight: string;
}

export interface Organs {
  [key: string]: string;
  circulatory: string;
  respiratory: string;
  digestive: string;
  kidneyUrology: string;
  neurological: string;
  musculoskeletal: string;
  ent: string;
  maxillofacial: string;
  eye: string;
  endocrineAndOthers: string;
}

export interface AdmissionDiagnosis {
  mainDisease: string;
  comorbidities: string;
  differential: string;
}

export interface MedicalRecordContent {
  reason: string;
  dayOfIllness: string;
  pathologicalProcess: string;
  personalHistory: string;
  familyHistory: string;
  relatedCharacteristics: RelatedCharacteristics;
  overallExamination: string;
  vitalSigns: VitalSigns;
  organs: Organs;
  clinicalTests: string;
  summary: string;
  admissionDiagnosis: AdmissionDiagnosis;
  prognosis: string;
  treatmentPlan: string;
}

export interface DiagnosisCode {
  name: string;
  code: string;
}

export interface DeptDiagnosis extends DiagnosisCode {
  isSurgery: boolean;
  isProcedure: boolean;
}

export interface DischargeDiagnosis {
  mainDisease: DiagnosisCode;
  comorbidities: DiagnosisCode;
  isAccident: boolean;
  isComplication: boolean;
}

export interface DiagnosisInfo {
  transferDiagnosis: DiagnosisCode;
  kkbDiagnosis: DiagnosisCode;
  deptDiagnosis: DeptDiagnosis;
  dischargeDiagnosis: DischargeDiagnosis;
}

export interface DeathStatus {
  description: string;
  cause: string;
  time: string;
}

export interface DischargeStatusInfo {
  treatmentResult: string;
  pathology: string;
  deathStatus: DeathStatus;
  mainCauseOfDeath: DiagnosisCode;
  isAutopsy: boolean;
  autopsyDiagnosis: DiagnosisCode;
}

export interface Record {
  id: string;
  patientId: string;
  patientName: string;
  cccd: string;
  dob: string;
  age: number;
  gender: string;
  admissionDate: string;
  dischargeDate: string;
  department: string;
  type: string;
  documents: Document[];
  managementData: ManagementData;
  medicalRecordContent: MedicalRecordContent;
  diagnosisInfo: DiagnosisInfo;
  dischargeStatusInfo: DischargeStatusInfo;
}

export interface RecordType {
  id: string;
  name: string;
  active: boolean;
}

export interface User {
  username: string;
  password: string;
  role: string;
  name: string;
  status: string;
}
