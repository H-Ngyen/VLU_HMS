using Domain.Constants;

namespace Domain.Entities;

public class Hematology
{
    public int Id { get; set; }
    // Foreign key
    public int MedicalRecordId { get; set; }
    public int RequestedById { get; set; }
    public int? PerformedById { get; set; }

    // Props
    // --- Thông tin chung ---
    public bool IsEmergency { get; set; } // Thường = false, Cấp cứu = true

    public required DateTime RequestedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    // --- Nhóm 1: Tế bào máu ngoại vi (Lưu dạng float để có số thập phân) ---
    // Hồng cầu (RBC) & Bạch cầu (WBC) & Tiểu cầu (PLT)
    public float? RedBloodCellCount { get; set; } // Số lượng HC (x 10^12/l)
    public float? WhiteBloodCellCount { get; set; } // Số lượng BC (x 10^9/l)
    public float? Hemoglobin { get; set; } // Huyết sắc tố (g/l)
    public float? Hematocrit { get; set; } // (l/l)
    public float? Mcv { get; set; } // (fl)
    public float? Mch { get; set; } // (pg)
    public float? Mchc { get; set; } // (g/l)
    public float? ReticulocyteCount { get; set; } // Hồng cầu lưới (%)
    public float? PlateletCount { get; set; } // Số lượng tiểu cầu (x 10^9/l)

    // Thành phần bạch cầu (%)
    public float? Neutrophil { get; set; } // Đoạn trung tính
    public float? Eosinophil { get; set; } // Đoạn ưa a-xít
    public float? Basophil { get; set; } // Đoạn ưa ba-zơ
    public float? Monocyte { get; set; } // Mono
    public float? Lymphocyte { get; set; } // Lympho

    // Các thông số dạng Text
    public string? NucleatedRedBloodCell { get; set; } // Hồng cầu có nhân
    public string? AbnormalCells { get; set; } // Tế bào bất thường
    public string? MalariaParasite { get; set; } // Ký sinh trùng sốt rét

    // Máu lắng (ESR)
    public float? Esr1h { get; set; } // Máu lắng giờ 1 (mm)
    public float? Esr2h { get; set; } // Máu lắng giờ 2 (mm)

    // --- Nhóm 2: Đông máu (Tính bằng phút) ---
    public int? BleedingTime { get; set; } // Thời gian máu chảy
    public int? ClottingTime { get; set; } // Thời gian máu đông

    // --- Nhóm 3: Nhóm máu ---
    public BloodTypeAbo? BloodTypeAbo { get; set; }
    public BloodTypeRh? BloodTypeRh { get; set; }

    
    // Navigation Property
    public MedicalRecord MedicalRecord { get; set; } = null!;
    public User? RequestedBy { get; set; } // Bác sĩ điều trị
    public User? PerformedBy { get; set; } // Trưởng khoa xét nghiệm
}