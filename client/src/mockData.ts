import type { Patient, Record, RecordType, User } from './types';

const generateMockRecords = (count: number): Record[] => {
  const records: Record[] = [];
  const depts = ["Nội Khoa", "Ngoại Khoa"];
  const types = ["internal", "surgery"];
  const lastNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Huỳnh", "Hoàng", "Phan", "Vũ", "Võ", "Đặng"];
  const middleNames = ["Văn", "Thị", "Đức", "Thành", "Minh", "Ngọc", "Quốc", "Gia"];
  const firstNames = ["An", "Bình", "Cường", "Dũng", "Giang", "Hương", "Khánh", "Lan", "Minh", "Nam", "Oanh", "Phúc", "Quang", "Sơn", "Tâm", "Uyên", "Vinh", "Yến"];

  for (let i = 1; i <= count; i++) {
    const isDischarged = Math.random() > 0.4;
    const typeIdx = Math.floor(Math.random() * 2);
    const randomName = `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${firstNames[Math.floor(Math.random() * firstNames.length)]}`;
    const randomAge = Math.floor(Math.random() * 60) + 10;
    const randomYear = 2024 - randomAge;
    const randomIdNum = (i + 2).toString().padStart(3, "0");
    const patientId = `BN${randomIdNum}`;
    const cccd = `079${Math.floor(Math.random() * 1000000000).toString().padStart(9, "0")}`;

    records.push({
      id: `REC${randomIdNum}`,
      patientId: patientId,
      patientName: randomName,
      cccd: cccd,
      dob: `${randomYear}-05-15`,
      age: randomAge,
      gender: Math.random() > 0.5 ? "Nam" : "Nữ",
      admissionDate: `2023-${Math.floor(Math.random() * 11) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      dischargeDate: isDischarged ? `2023-${Math.floor(Math.random() * 11) + 1}-${Math.floor(Math.random() * 28) + 1}` : "",
      department: depts[typeIdx],
      type: types[typeIdx],
      documents: [],
      managementData: {
        admissionTime: "08:30",
        admissionType: "KKB",
        referralSource: "Tự đến",
        admissionCount: 1,
        transfers: [{ department: depts[typeIdx], date: "2023-01-01", days: 5 }],
        hospitalTransfer: { type: "", destination: "" },
        dischargeType: isDischarged ? "Ra viện" : "",
        totalDays: isDischarged ? 5 : 0,
      },
      medicalRecordContent: {
        reason: "Đau bụng vùng thượng vị, sốt nhẹ.",
        dayOfIllness: "3",
        pathologicalProcess: "Bệnh nhân đau bụng vùng thượng vị cách nhập viện 3 ngày, đau âm ỉ, không lan, kèm buồn nôn. Sốt nhẹ về chiều.",
        personalHistory: "Chưa ghi nhận bệnh lý dạ dày trước đây.",
        familyHistory: "Bố bị viêm loét dạ dày.",
        relatedCharacteristics: {
          allergy: { isChecked: false, time: "" },
          drugs: { isChecked: false, time: "" },
          alcohol: { isChecked: true, time: "Thỉnh thoảng" },
          tobacco: { isChecked: false, time: "" },
          pipeTobacco: { isChecked: false, time: "" },
          other: { isChecked: false, time: "" },
        },
        overallExamination: "Bệnh nhân tỉnh, tiếp xúc tốt. Da niêm hồng. Không phù. Hạch ngoại vi không sờ chạm.",
        vitalSigns: { pulse: "80", temperature: "37.5", bloodPressure: "120/70", respiratoryRate: "18", weight: "65" },
        organs: {
          circulatory: "T1, T2 đều, rõ. Không âm thổi bệnh lý.",
          respiratory: "Lồng ngực cân đối, di động đều theo nhịp thở. Rì rào phế nang êm dịu.",
          digestive: "Bụng mềm, ấn đau nhẹ vùng thượng vị. Gan lách không sờ chạm.",
          kidneyUrology: "Chạm thận âm tính. Cầu bàng quang âm tính.",
          neurological: "Cổ mềm. Không dấu thần kinh định vị.",
          musculoskeletal: "Các khớp vận động trong giới hạn bình thường.",
          ent: "Họng sạch, không đỏ.",
          maxillofacial: "Răng chưa mất cái nào.",
          eye: "Kết mạc mắt không vàng.",
          endocrineAndOthers: "Tuyến giáp không to.",
        },
        clinicalTests: "Công thức máu, Sinh hóa máu (Ure, Creatinine, AST, ALT), Siêu âm bụng tổng quát, Nội soi dạ dày.",
        summary: "Bệnh nhân nam, 45 tuổi, vào viện vì đau bụng thượng vị ngày thứ 3. Tiền căn khỏe mạnh. Khám lâm sàng ghi nhận ấn đau thượng vị. Các cơ quan khác chưa ghi nhận bất thường.",
        admissionDiagnosis: { mainDisease: "Viêm dạ dày cấp", comorbidities: "", differential: "Viêm tụy cấp" },
        prognosis: "Khá",
        treatmentPlan: "Kháng sinh, giảm tiết axit, trung hòa axit, giảm đau.",
      },
      diagnosisInfo: {
        transferDiagnosis: { name: "Đau bụng chưa rõ nguyên nhân", code: "R10" },
        kkbDiagnosis: { name: "Viêm dạ dày", code: "K29" },
        deptDiagnosis: { name: "Viêm dạ dày cấp", code: "K29.1", isSurgery: false, isProcedure: true },
        dischargeDiagnosis: {
          mainDisease: { name: "Viêm dạ dày cấp ổn định", code: "K29.1" },
          comorbidities: { name: "", code: "" },
          isAccident: false,
          isComplication: false,
        },
      },
      dischargeStatusInfo: {
        treatmentResult: "2. Đỡ, giảm",
        pathology: "",
        deathStatus: { description: "", cause: "", time: "" },
        mainCauseOfDeath: { name: "", code: "" },
        isAutopsy: false,
        autopsyDiagnosis: { name: "", code: "" },
      },
    });
  }
  return records;
};

const generateMockPatients = (count: number): Patient[] => {
  const patients: Patient[] = [];
  const lastNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Huỳnh", "Hoàng", "Phan", "Vũ", "Võ", "Đặng"];
  const middleNames = ["Văn", "Thị", "Đức", "Thành", "Minh", "Ngọc", "Quốc", "Gia"];
  const firstNames = ["An", "Bình", "Cường", "Dũng", "Giang", "Hương", "Khánh", "Lan", "Minh", "Nam", "Oanh", "Phúc", "Quang", "Sơn", "Tâm", "Uyên", "Vinh", "Yến"];

  for (let i = 1; i <= count; i++) {
    const randomName = `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${firstNames[Math.floor(Math.random() * firstNames.length)]}`;
    const randomAge = Math.floor(Math.random() * 60) + 10;
    const randomYear = 2024 - randomAge;
    const randomIdNum = (i + 2).toString().padStart(3, "0");
    const cccd = `079${Math.floor(Math.random() * 1000000000).toString().padStart(9, "0")}`;

    patients.push({
      id: `BN${randomIdNum}`,
      fullName: randomName.toUpperCase(),
      cccd: cccd,
      dob: `${randomYear}-05-15`,
      age: randomAge,
      gender: Math.random() > 0.5 ? "Nam" : "Nữ",
      job: "Nhân viên văn phòng",
      jobCode: "NV001",
      ethnicity: "Kinh",
      nationality: "Việt Nam",
      address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
      addressStreet: "123 Đường ABC",
      addressWard: "Phường XYZ",
      addressDistrict: "Quận 1",
      addressProvince: "TP.HCM",
      workplace: "Công ty ABC",
      subjectType: "BHYT",
      insuranceExpiry: "2025-12-31",
      insuranceNumber: "DN4797938644422",
      relativeInfo: "Vợ: Nguyễn Thị C - Cùng địa chỉ",
      relativePhone: "0909123456",
    });
  }
  return patients;
};

const extraRecords = generateMockRecords(38);
const extraPatients = generateMockPatients(38);

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "BN001",
    fullName: "NGUYEN VAN A",
    cccd: "079178000123",
    dob: "1978-01-01",
    age: 46,
    gender: "Nam",
    job: "Nông dân",
    jobCode: "ND01",
    ethnicity: "Kinh",
    nationality: "Việt Nam",
    address: "123 Đường X, Phường Y, Quận Z, TP.HCM",
    addressStreet: "123 Đường X",
    addressWard: "Phường Y",
    addressDistrict: "Quận Z",
    addressProvince: "TP.HCM",
    workplace: "Tại nhà",
    subjectType: "BHYT",
    insuranceExpiry: "2024-12-31",
    insuranceNumber: "GD4797938644422",
    relativeInfo: "Vợ: Trần Thị C - Cùng địa chỉ",
    relativePhone: "0909000111",
  },
  {
    id: "BN002",
    fullName: "TRAN THI B",
    cccd: "079161000456",
    dob: "1961-05-20",
    age: 63,
    gender: "Nữ",
    job: "Hưu trí",
    jobCode: "HT01",
    ethnicity: "Kinh",
    nationality: "Việt Nam",
    address: "456 Đường Z, Phường 1, Quận 1, TP.HCM",
    addressStreet: "456 Đường Z",
    addressWard: "Phường 1",
    addressDistrict: "Quận 1",
    addressProvince: "TP.HCM",
    workplace: "",
    subjectType: "Thu phí",
    insuranceExpiry: "",
    insuranceNumber: "",
    relativeInfo: "Con: Lê Văn D - 789 Đường K",
    relativePhone: "0909222333",
  },
  ...extraPatients,
];

export const INITIAL_RECORDS: Record[] = [
  {
    id: "REC001",
    patientId: "BN001",
    patientName: "NGUYEN VAN A",
    cccd: "079178000123",
    dob: "1978-01-01",
    age: 46,
    gender: "Nam",
    admissionDate: "2023-10-01",
    dischargeDate: "",
    department: "Nội Khoa",
    type: "internal",
    documents: [
      {
        id: "DOC001",
        name: "X-Quang Ngực",
        type: "X-Quang",
        fileName: "REC001_XQuang_NguyenVanA_1978.pdf",
        date: "2023-10-01",
      },
    ],
    managementData: {
      admissionTime: "08:00",
      admissionType: "KKB",
      referralSource: "Tự đến",
      admissionCount: 1,
      transfers: [{ department: "Nội Khoa", date: "2023-10-01", days: 2 }],
      hospitalTransfer: { type: "", destination: "" },
      dischargeType: "",
      totalDays: 0,
    },
    medicalRecordContent: {
      reason: "Đau ngực trái, khó thở khi gắng sức.",
      dayOfIllness: "2",
      pathologicalProcess: "Bệnh nhân đau ngực trái âm ỉ, lan lên vai trái, kèm khó thở khi đi bộ xa.",
      personalHistory: "Tăng huyết áp 5 năm, điều trị thường xuyên.",
      familyHistory: "Không ai mắc bệnh tim mạch sớm.",
      relatedCharacteristics: {
        allergy: { isChecked: false, time: "" },
        drugs: { isChecked: false, time: "" },
        alcohol: { isChecked: false, time: "" },
        tobacco: { isChecked: true, time: "20 năm" },
        pipeTobacco: { isChecked: false, time: "" },
        other: { isChecked: false, time: "" },
      },
      overallExamination: "Tỉnh, tiếp xúc tốt. Da niêm hồng. Mạch quay rõ.",
      vitalSigns: { pulse: "88", temperature: "37", bloodPressure: "140/90", respiratoryRate: "20", weight: "70" },
      organs: {
        circulatory: "Mỏm tim đập khoang liên sườn V đường trung đòn trái. T1 T2 đều.",
        respiratory: "Phổi trong, không rales.",
        digestive: "Bụng mềm, không đau.",
        kidneyUrology: "Chạm thận âm tính.",
        neurological: "Không yếu liệt chi.",
        musculoskeletal: "Cơ khớp bình thường.",
        ent: "Tai mũi họng sạch.",
        maxillofacial: "Răng tốt.",
        eye: "Thị lực 10/10.",
        endocrineAndOthers: "Không bướu cổ.",
      },
      clinicalTests: "ECG, X-Quang ngực, Siêu âm tim, Troponin T.",
      summary: "Bệnh nhân nam 46 tuổi, tiền sử tăng huyết áp, hút thuốc lá. Vào viện vì đau ngực trái kiểu mạch vành. Khám lâm sàng chưa ghi nhận bất thường cấp tính.",
      admissionDiagnosis: { mainDisease: "Cơn đau thắt ngực ổn định", comorbidities: "Tăng huyết áp độ 2", differential: "Nhồi máu cơ tim cấp" },
      prognosis: "Trung bình",
      treatmentPlan: "Kiểm soát huyết áp, thuốc giãn mạch vành, thay đổi lối sống.",
    },
    diagnosisInfo: {
      transferDiagnosis: { name: "", code: "" },
      kkbDiagnosis: { name: "Đau ngực", code: "R07.4" },
      deptDiagnosis: { name: "Đau thắt ngực", code: "I20", isSurgery: false, isProcedure: false },
      dischargeDiagnosis: {
        mainDisease: { name: "", code: "" },
        comorbidities: { name: "", code: "" },
        isAccident: false,
        isComplication: false,
      },
    },
    dischargeStatusInfo: {
      treatmentResult: "",
      pathology: "",
      deathStatus: { description: "", cause: "", time: "" },
      mainCauseOfDeath: { name: "", code: "" },
      isAutopsy: false,
      autopsyDiagnosis: { name: "", code: "" },
    },
  },
  {
    id: "REC002",
    patientId: "BN002",
    patientName: "TRAN THI B",
    cccd: "079161000456",
    dob: "1961-05-20",
    age: 63,
    gender: "Nữ",
    admissionDate: "2023-10-05",
    dischargeDate: "2023-10-12",
    department: "Ngoại Khoa",
    type: "surgery",
    documents: [],
    managementData: {
      admissionTime: "10:30",
      admissionType: "KKB",
      referralSource: "Cơ quan y tế",
      admissionCount: 2,
      transfers: [
        { department: "Cấp Cứu", date: "2023-10-05", days: 1 },
        { department: "Ngoại Tổng Quát", date: "2023-10-06", days: 6 },
      ],
      hospitalTransfer: { type: "", destination: "" },
      dischargeType: "Ra viện",
      totalDays: 7,
    },
    medicalRecordContent: {
      reason: "Đau hố chậu phải.",
      dayOfIllness: "1",
      pathologicalProcess: "Đau bụng âm ỉ quanh rốn chuyển xuống hố chậu phải, kèm buồn nôn, chán ăn.",
      personalHistory: "Khỏe mạnh.",
      familyHistory: "Không ghi nhận.",
      relatedCharacteristics: {
        allergy: { isChecked: false, time: "" },
        drugs: { isChecked: false, time: "" },
        alcohol: { isChecked: false, time: "" },
        tobacco: { isChecked: false, time: "" },
        pipeTobacco: { isChecked: false, time: "" },
        other: { isChecked: false, time: "" },
      },
      overallExamination: "Vẻ mặt nhiễm trùng, môi khô lưỡi dơ.",
      vitalSigns: { pulse: "90", temperature: "38.5", bloodPressure: "110/70", respiratoryRate: "20", weight: "55" },
      organs: {
        circulatory: "Tim đều.",
        respiratory: "Phổi trong.",
        digestive: "Bụng mềm, ấn đau điểm McBurney (+), Phản ứng thành bụng (+).",
        kidneyUrology: "Bình thường.",
        neurological: "Bình thường.",
        musculoskeletal: "Bình thường.",
        ent: "Bình thường.",
        maxillofacial: "Bình thường.",
        eye: "Bình thường.",
        endocrineAndOthers: "Bình thường.",
      },
      clinicalTests: "Công thức máu (Bạch cầu tăng), Siêu âm bụng (Ruột thừa viêm sưng to).",
      summary: "Bệnh nhân nữ 63 tuổi, vào viện vì đau hố chậu phải. Hội chứng nhiễm trùng (+). McBurney (+).",
      admissionDiagnosis: { mainDisease: "Viêm ruột thừa cấp", comorbidities: "", differential: "Viêm phần phụ" },
      prognosis: "Tốt sau phẫu thuật",
      treatmentPlan: "Phẫu thuật nội soi cắt ruột thừa.",
    },
    diagnosisInfo: {
      transferDiagnosis: { name: "TD Viêm ruột thừa", code: "K35" },
      kkbDiagnosis: { name: "Viêm ruột thừa", code: "K35" },
      deptDiagnosis: { name: "Viêm ruột thừa cấp", code: "K35.8", isSurgery: true, isProcedure: false },
      dischargeDiagnosis: {
        mainDisease: { name: "Viêm ruột thừa cấp đã phẫu thuật", code: "K35.8" },
        comorbidities: { name: "", code: "" },
        isAccident: false,
        isComplication: false,
      },
    },
    dischargeStatusInfo: {
      treatmentResult: "1. Khỏi",
      pathology: "1. Lành tính",
      deathStatus: { description: "", cause: "", time: "" },
      mainCauseOfDeath: { name: "", code: "" },
      isAutopsy: false,
      autopsyDiagnosis: { name: "", code: "" },
    },
  },
  ...extraRecords,
];

export const RECORD_TYPES: RecordType[] = [
  { id: "internal", name: "Nội Khoa", active: true },
  { id: "surgery", name: "Ngoại Khoa", active: true },
  { id: "pediatrics", name: "Nhi Khoa", active: false },
  { id: "obstetrics", name: "Sản Khoa", active: false },
];

export const USERS: User[] = [
  { username: "student", password: "123", role: "student", name: "Nguyễn Văn Sinh Viên", status: "active" },
  { username: "teacher", password: "123", role: "teacher", name: "TS. Trần Văn Giảng Viên", status: "active" },
  { username: "admin", password: "123", role: "admin", name: "Quản Trị Viên", status: "active" },
];
