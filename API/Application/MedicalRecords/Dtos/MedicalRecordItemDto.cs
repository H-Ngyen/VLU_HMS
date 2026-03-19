
using Application.Patients.Dtos;
using Domain.Constants;

namespace Application.MedicalRecords.Dtos;

public class MedicalRecordItemDto
{
    public int Id { get; set; }
    // Foreign Key
    public required int PatientId { get; set; }
    // Props
    // Info
    public required RecordType RecordType { get; set; }
    public string? StorageCode { get; set; }
    public DateTime? AdmissionTime { get; set; }
    public PatientDto Patient { get; set; } = null!;

}