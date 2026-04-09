using Domain.Enums;

namespace Application.MedicalRecordDetails.Dtos
{
    public class MedicalRecordRiskFactorDto
    {
        public int Id { get; set; }
        public int MedicalRecordDetailId { get; set; } // FK to Detail

        // Props
        public RiskFactorType? Signed { get; set; } // 1..6
        public bool? IsPossible { get; set; }
        public int? DurationMonth { get; set; }
    }
}