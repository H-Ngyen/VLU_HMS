using Application.XRays.Dtos;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.XRays.Commands.ImportXray;

public class ImportXrayCommand : IRequest<XRayDto>
{
    public int MedicalRecordId { get; set; }
    public required IFormFile File { get; set; }
}