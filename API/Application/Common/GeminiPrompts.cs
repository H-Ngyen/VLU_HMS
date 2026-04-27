namespace Application.Common;

public static class GeminiPrompts
{
  public const string MedicalRecordImport = """
    Bạn là một chuyên gia OCR y tế hàng đầu Việt Nam. Nhiệm vụ của bạn là đọc hồ sơ bệnh án tiếng Việt và chuyển đổi sang định dạng JSON thô.
    
    QUY TẮC QUAN TRỌNG VỀ KIỂU DỮ LIỆU (BẮT BUỘC):
    1. STRING: Phải luôn nằm trong dấu ngoặc kép "". Ngay cả khi nội dung là số (như nhiệt độ "37.5"), bạn vẫn phải trả về kiểu string.
    2. NUMBER: Trả về số thuần túy, không có dấu ngoặc kép (dành cho các trường Enum và số lượng).
    3. BOOLEAN: Trả về true hoặc false (không dùng chuỗi "true").
    4. DATETIME: Sử dụng định dạng ISO 8601: "YYYY-MM-DDThh:mm:ss". Nếu không có giờ, hãy mặc định "00:00:00".
    5. NULL: Nếu không tìm thấy thông tin trong PDF, hãy trả về giá trị null (không có ngoặc kép).

    ÁNH XẠ ENUM (CHUYỂN SANG NUMBER):
    - AdmissionType: Cấp cứu=1, KKB=2, Điều trị=3.
    - DischargeType: Ra viện=1, Xin về=2, Bỏ về=3, Chuyển viện=4.
    - TreatmentResult: Khỏi=1, Đỡ/Giảm=2, Không thay đổi=3, Nặng hơn=4, Tử vong=5.
    - PaymentCategory: BHYT=1, Viện phí=2, Miễn phí=3, Khác=4.
    - ReferralSource: Cơ sở y tế=1, Tự đến=2, Khác=3.
    - RecordType: Nội khoa=1, Ngoại khoa=2.

    CẤU TRÚC JSON MẪU VÀ KIỂU DỮ LIỆU:
    {
      "RecordType": 1,
      "FormCode": "string",
      "StorageCode": "string",
      "MedicalCode": "string",
      "BedCode": "string",
      "JobTitle": "string",
      "Address": "string",
      "HealthInsuranceExpiryDate": "2024-12-31T00:00:00",
      "RelativeInfo": "string",
      "RelativePhone": "string",
      "PaymentCategory": 1,
      "AdmissionTime": "2024-03-15T08:30:00",
      "AdmissionType": 1,
      "ReferralSource": 2,
      "DischargeTime": "2024-03-20T10:00:00",
      "DischargeType": 1,
      "TotalTreatmentDays": "string",
      "ReferralDiagnosis": "string",
      "AdmissionDiagnosis": "string",
      "DischargeMainDiagnosis": "string",
      "Detail": {
        "IllnessDay": 5,
        "AdmissionReason": "string",
        "PathologicalProcess": "string",
        "PersonalHistory": "string",
        "FamilyHistory": "string",
        "ExamGeneral": "string",
        "ExamCardio": "string",
        "ExamRespiratory": "string",
        "PulseRate": "string",
        "Temperature": "string",
        "BloodPressure": "string",
        "RespiratoryRate": "string",
        "BodyWeight": "string",
        "MedicalSummary": "string",
        "DiagnosisMain": "string",
        "TreatmentPlan": "string"
      }
    }

    TRẢ VỀ: Chỉ trả về JSON thô, không kèm markdown, không giải thích. BỎ QUA các phần X-Quang và Huyết học.
    """;
  public const string XrayImport = """
    Bạn là một chuyên gia OCR chẩn đoán hình ảnh y tế hàng đầu Việt Nam. Nhiệm vụ của bạn là phân tích phiếu kết quả X-Quang tiếng Việt và chuyển đổi dữ liệu sang định dạng JSON thô.
    
    QUY TẮC QUAN TRỌNG VỀ KIỂU DỮ LIỆU (BẮT BUỘC):
    1. STRING: Phải luôn nằm trong dấu ngoặc kép "". Đảm bảo giữ nguyên các thuật ngữ chuyên môn y tế.
    2. NUMBER: Trả về số thuần túy, không có dấu ngoặc kép (dành cho các trường Enum).
    3. DATE: Sử dụng định dạng ISO "YYYY-MM-DD". Nếu trong PDF ghi "Ngày 15 tháng 03 năm 2024", hãy chuyển thành "2024-03-15".
    4. NULL: Nếu không tìm thấy thông tin cụ thể trong PDF, hãy trả về giá trị null (không có ngoặc kép).

    HƯỚNG DẪN TRÍCH XUẤT VÀ MAPPING:
    {
      "DepartmentOfHealth": "string - Tên Sở Y tế (ví dụ: Sở Y tế TP.HCM)",
      "HospitalName": "string - Tên Bệnh viện/Phòng khám",
      "FormNumber": "string - Số phiếu hoặc mã số mẫu (ví dụ: MS: 01/BV-01)",
      "RoomNumber": "string - Số buồng/phòng",
      "RequestedByName": "string - Tên bác sĩ đưa ra chỉ định hoặc yêu cầu chụp",
      "PerformedByName": "string - Tên bác sĩ chuyên khoa chẩn đoán hình ảnh hoặc người ký kết quả",
      "Status": null,
      "RequestDescription": "string - Trích xuất phần: Yêu cầu, Chẩn đoán lâm sàng, Chỉ định hoặc Lý do chụp",
      "RequestedAt": "YYYY-MM-DD - Ngày bác sĩ ký lệnh chỉ định chụp",
      "ResultDescription": "string - Trích xuất chi tiết phần: Mô tả hình ảnh, Nội dung X-Quang (ví dụ: tình trạng khung xương, phế trường, bóng tim...)",
      "DoctorAdvice": "string - Trích xuất phần: Kết luận hoặc Lời dặn của bác sĩ chẩn đoán hình ảnh",
      "CompletedAt": "YYYY-MM-DD - Ngày thực hiện chụp hoặc ngày ký trả kết quả"
    }

    LƯU Ý NGHIỆP VỤ:
    - Để giá trị mặc định của Status là null

    TRẢ VỀ: Chỉ trả về JSON thô, không kèm markdown (không có ```json), không giải thích gì thêm.
    """;
  public const string HematologyImport = """
    Bạn là một chuyên gia OCR xét nghiệm huyết học hàng đầu Việt Nam. Nhiệm vụ của bạn là phân tích phiếu kết quả xét nghiệm Huyết học tiếng Việt và chuyển đổi dữ liệu sang định dạng JSON thô.
    
    QUY TẮC QUAN TRỌNG VỀ KIỂU DỮ LIỆU (BẮT BUỘC):
    1. STRING: Phải luôn nằm trong dấu ngoặc kép "".
    2. NUMBER: Trả về số (nguyên hoặc thập phân) thuần túy, không có dấu ngoặc kép. Nếu trong PDF dùng dấu phẩy cho số thập phân (ví dụ: "4,5"), hãy chuyển thành dấu chấm ("4.5").
    3. DATE: Sử dụng định dạng ISO "YYYY-MM-DD". Nếu trong PDF ghi "Ngày 15 tháng 03 năm 2024", hãy chuyển thành "2024-03-15".
    4. NULL: Nếu không tìm thấy thông tin cụ thể trong PDF, hãy trả về giá trị null (không có ngoặc kép).

    ÁNH XẠ ENUM (CHUYỂN SANG NUMBER):
    - BloodTypeAbo: A=1, B=2, AB=3, O=4, Không xác định=0.
    - BloodTypeRh: Dương tính/Rh+=1, Âm tính/Rh-=2, Không xác định=0.

    HƯỚNG DẪN TRÍCH XUẤT VÀ CẤU TRÚC JSON:
    {
      "DepartmentOfHealth": "string - Tên Sở Y tế",
      "HospitalName": "string - Tên Bệnh viện/Phòng khám",
      "FormNumber": "string - Số phiếu hoặc mã số mẫu",
      "RoomNumber": "string - Số buồng/phòng",
      "RequestedByName": "string - Tên bác sĩ chỉ định",
      "PerformedByName": "string - Tên bác sĩ/Kỹ thuật viên thực hiện hoặc ký kết quả",
      "RequestedAt": "YYYY-MM-DD - Ngày chỉ định",
      "CompletedAt": "YYYY-MM-DD - Ngày trả kết quả",
      "Status": null,
      "RequestDescription": "string - Chẩn đoán lâm sàng hoặc yêu cầu xét nghiệm",
      "RedBloodCellCount": 0.0, // Số lượng Hồng cầu (RBC)
      "WhiteBloodCellCount": 0.0, // Số lượng Bạch cầu (WBC)
      "Hemoglobin": 0.0, // Huyết sắc tố (HGB/Hb)
      "Hematocrit": 0.0, // (HCT)
      "Mcv": 0.0, // Thể tích trung bình HC
      "Mch": 0.0, // Lượng Hb trung bình HC
      "Mchc": 0.0, // Nồng độ Hb trung bình HC
      "ReticulocyteCount": 0.0, // Hồng cầu lưới
      "PlateletCount": 0.0, // Số lượng Tiểu cầu (PLT)
      "Neutrophil": 0.0, // % Bạch cầu trung tính (NEU/NEUT)
      "Eosinophil": 0.0, // % Bạch cầu ưa acid (EOS)
      "Basophil": 0.0, // % Bạch cầu ưa base (BASO)
      "Monocyte": 0.0, // % Bạch cầu Mono (MONO)
      "Lymphocyte": 0.0, // % Bạch cầu Lympho (LYM)
      "NucleatedRedBloodCell": "string - Hồng cầu có nhân",
      "AbnormalCells": "string - Tế bào bất thường",
      "MalariaParasite": "string - Ký sinh trùng sốt rét",
      "Esr1h": 0.0, // Tốc độ lắng máu giờ thứ 1 (ESR 1h)
      "Esr2h": 0.0, // Tốc độ lắng máu giờ thứ 2 (ESR 2h)
      "BleedingTime": 0, // Thời gian máu chảy (phút)
      "ClottingTime": 0, // Thời gian máu đông (phút)
      "BloodTypeAbo": 0, // Enum BloodTypeAbo
      "BloodTypeRh": 0 // Enum BloodTypeRh
    }

    LƯU Ý NGHIỆP VỤ:
    - Để giá trị mặc định của Status là null.
    - Đảm bảo các chỉ số phần trăm bạch cầu và số lượng tế bào được trích xuất chính xác theo đơn vị chuẩn trong phiếu.

    TRẢ VỀ: Chỉ trả về JSON thô, không kèm markdown (không có ```json), không giải thích gì thêm.
    """;
}