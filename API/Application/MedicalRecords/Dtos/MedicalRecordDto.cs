using Application.DepartmentTransfers.Dtos;
using Application.Hematologies.Dtos;
using Application.MedicalRecordDetails.Dtos;
using Application.Patients.Dtos;
using Application.XRays.Dtos;
using Domain.Constants;
using Domain.Entities;

namespace Application.MedicalRecords.Dtos;

public class MedicalRecordDto
{
    public int Id { get; set; }
    // Foreign Key
    public int PatientId { get; set; }
    // public required int CreatedBy { get; set; }

    // Props
    // Info
    public required RecordType RecordType { get; set; }
    public string? FormCode { get; set; }
    public string? StorageCode { get; set; }
    public string? MedicalCode { get; set; }
    public string? BedCode { get; set; }

    // Patient Info Snapshot
    public string? JobTitle { get; set; }
    public string? JobTitleCode { get; set; }
    public string? AddressJob { get; set; }
    public string? Address { get; set; }
    public int? ProvinceCode { get; set; }
    public int? DistrictCode { get; set; }
    public string? ProvinceName { get; set; }
    public string? DistrictName { get; set; }
    public string? WardName { get; set; }
    public DateTime? HealthInsuranceExpiryDate { get; set; }
    public string? RelativeInfo { get; set; }
    public string? RelativePhone { get; set; }
    public PaymentCategory? PaymentCategory { get; set; }

    // Management
    public DateTime? AdmissionTime { get; set; }
    public AdmissionType? AdmissionType { get; set; }
    public ReferralSource? ReferralSource { get; set; }
    public string? AdmissionCount { get; set; }

    // Transfer & Discharge
    public HospitalTransferType? HospitalTransferType { get; set; }
    public string? HospitalTransferDestination { get; set; }
    public DateTime? DischargeTime { get; set; }
    public DischargeType? DischargeType { get; set; }
    public string? TotalTreatmentDays { get; set; }

    // Diagnosis
    public string? ReferralDiagnosis { get; set; }
    public string? ReferralCode { get; set; }
    public string? AdmissionDiagnosis { get; set; }
    public string? AdmissionCode { get; set; }
    public string? DepartmentDiagnosis { get; set; }
    public string? DepartmentCode { get; set; }
    public bool HasProcedure { get; set; }
    public bool HasSurgery { get; set; }
    public string? DischargeMainDiagnosis { get; set; }
    public string? DischargeMainCode { get; set; }
    public string? DischargeSubDiagnosis { get; set; }
    public string? DischargeSubCode { get; set; }
    public bool HasAccident { get; set; }
    public bool HasComplication { get; set; }

    // Status & Result
    public TreatmentResult? TreatmentResult { get; set; }
    public PathologyResult? PathologyResult { get; set; }
    public DeathCause? DeathCause { get; set; }
    public DeathTimeGroup? DeathTimeGroup { get; set; }
    public string? DeathReason { get; set; }
    public string? DeathMainReason { get; set; }
    public int? DeathMainCode { get; set; }
    public bool HasAutopsy { get; set; }
    public string? DiagnosisAutopsy { get; set; }
    public int? DiagnosisCode { get; set; }

    // public required DateTime CreatedAt { get; set; }

    // Navigation Properties
    // public User Creator { get; set; } = null!;
    // public ICollection<MedicalAttachment> Attachments { get; set; } = [];
    public ICollection<DepartmentTransferDto> DepartmentTransfers { get; set; } = [];
    public PatientDto Patient { get; set; } = null!;

    // clinical examination form
    public ICollection<XRayDto> XRays { get; set; } = [];
    public ICollection<HematologyDto> Hematologies { get; set; } = [];
    // 1-1 Relationship
    public MedicalRecordDetailDto? Detail { get; set; }
}