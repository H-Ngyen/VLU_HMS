using Application.MedicalRecords.Dtos;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.MedicalRecords.Commands.ImportMedicalRecord;

public class ImportMedicalRecordCommand : IRequest<MedicalRecordDto>
{
    public int PatientId { get; set; }
    public required IFormFile FilePdf { get; set; }
}