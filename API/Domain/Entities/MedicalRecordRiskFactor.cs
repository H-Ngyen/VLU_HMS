using Domain.Constants;

namespace Domain.Entities;

public class MedicalRecordRiskFactor
{
    public int Id { get; set; }
    public required int MedicalRecordDetailId { get; set; } // FK to Detail

    // Props
    public RiskFactorType? Signed { get; set; } // 1..6
    public bool? IsPossible { get; set; }
    public int? DurationMonth { get; set; }
    
    // Navigation Properties
    public MedicalRecordDetail MedicalRecordDetail { get; set; } = null!;
}