using Domain.Enums;
using MediatR;

namespace Application.Hematologies.Commands.ImportHematologyCompleted;

public class ImportHematologyCompletedCommand : IRequest<int>
{
    public int MedicalRecordId { get; set; }
    // public int RequestedById { get; set; }
    // public string? RequestedByName { get; set; }
    // public int? PerformedById { get; set; }
    // public string? PerformedByName { get; set; }

    // Props
    // --- Thông tin chung ---
    public required string DepartmentOfHealth { get; set; }
    public required string HospitalName { get; set; }
    public required string FormNumber { get; set; }
    public required string RoomNumber { get; set; }

    public bool IsEmergency { get; set; } // Thường = false, Cấp cứu = true
    public required DateOnly RequestedAt { get; set; }
    public required DateOnly CompletedAt { get; set; }
    // public MedicalStatus? Status { get; set; }
    public required string RequestDescription { get; set; }
    public required string RequestDepartmentName { get; set; }
    public required string PerformDepartmentName { get; set; }

    // --- Nhóm 1: Tế bào máu ngoại vi (Lưu dạng float để có số thập phân) ---
    // Hồng cầu (RBC) & Bạch cầu (WBC) & Tiểu cầu (PLT)
    public required float RedBloodCellCount { get; set; } // Số lượng HC (x 10^12/l)
    public required float WhiteBloodCellCount { get; set; } // Số lượng BC (x 10^9/l)
    public required float Hemoglobin { get; set; } // Huyết sắc tố (g/l)
    public required float Hematocrit { get; set; } // (l/l)
    public required float Mcv { get; set; } // (fl)
    public required float Mch { get; set; } // (pg)
    public required float Mchc { get; set; } // (g/l)
    public required float ReticulocyteCount { get; set; } // Hồng cầu lưới (%)
    public required float PlateletCount { get; set; } // Số lượng tiểu cầu (x 10^9/l)

    // Thành phần bạch cầu (%)
    public required float Neutrophil { get; set; } // Đoạn trung tính
    public required float Eosinophil { get; set; } // Đoạn ưa a-xít
    public required float Basophil { get; set; } // Đoạn ưa ba-zơ
    public required float Monocyte { get; set; } // Mono
    public required float Lymphocyte { get; set; } // Lympho

    // Các thông số dạng Text
    public required string NucleatedRedBloodCell { get; set; } // Hồng cầu có nhân
    public required string AbnormalCells { get; set; } // Tế bào bất thường
    public required string MalariaParasite { get; set; } // Ký sinh trùng sốt rét

    // Máu lắng (ESR)
    public required float Esr1h { get; set; } // Máu lắng giờ 1 (mm)
    public required float Esr2h { get; set; } // Máu lắng giờ 2 (mm)

    // --- Nhóm 2: Đông máu (Tính bằng phút) ---
    public required int BleedingTime { get; set; } // Thời gian máu chảy
    public required int ClottingTime { get; set; } // Thời gian máu đông

    // --- Nhóm 3: Nhóm máu ---
    public required BloodTypeAbo BloodTypeAbo { get; set; }
    public required BloodTypeRh BloodTypeRh { get; set; }
}