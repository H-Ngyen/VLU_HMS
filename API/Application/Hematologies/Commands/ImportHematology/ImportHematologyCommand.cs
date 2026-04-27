using Application.Hematologies.Dtos;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Hematologies.Commands.ImportHematology;

public class ImportHematologyCommand : IRequest<HematologyDto>
{
    public int MedicalRecordId { get; set; }
    public required IFormFile File { get; set; }
}