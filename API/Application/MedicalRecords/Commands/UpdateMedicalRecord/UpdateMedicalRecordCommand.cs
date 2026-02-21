using Application.DepartmentTransfers.Dtos;
using Domain.Constants;
using MediatR;

namespace Application.MedicalRecords.Commands.UpdateMedicalRecord;

public class UpdateMedicalRecordCommand(int id) : IRequest
{
    public int Id { get; set; } = id;
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
    public string? DeathMainReason { get; set; }
    public int? DeathMainCode { get; set; }
    public bool HasAutopsy { get; set; }
    public string? DiagnosisAutopsy { get; set; }
    public int? DiagnosisCode { get; set; }
    // public List<IFormFile>? PdfFiles { get; set; }

    // // Navigation Properties
    // public ICollection<MedicalAttachment> Attachments { get; set; } = [];
    public ICollection<DepartmentTransferDto> DepartmentTransfers { get; set; } = [];
    // public Patient Patient { get; set; } = null!;

    // // clinical examination form
    // public ICollection<XRay> XRays { get; set; } = [];
    // public ICollection<Hematology> Hematologies { get; set; } = [];
    // // 1-1 Relationship
    // public MedicalRecordDetail? Detail { get; set; }
}