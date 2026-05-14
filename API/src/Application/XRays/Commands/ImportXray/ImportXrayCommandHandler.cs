using System.Diagnostics;
using Application.Common;
using Application.Users;
using Application.XRays.Dtos;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.XRays.Commands.ImportXray;

public class ImportXrayCommandHandler(ILogger<ImportXrayCommandHandler> logger,
    IUserContext userContext,
    IXrayAuthorizationService xrayAuthorizationService,
    IPdfProcessorService pdfProcessorService) : IRequestHandler<ImportXrayCommand, XRayDto>
{
    public async Task<XRayDto> Handle(ImportXrayCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        logger.LogInformation("Extracting pdf to xray for medical record {MedicalRecordId}", request.MedicalRecordId);

        if (!xrayAuthorizationService.Authorize(user, null, ResourceOperation.Create))
            throw new ForbidException();

        using var fileStream = request.File.OpenReadStream();

        var xRayDto = await pdfProcessorService.ExtractAsync<XRayDto>(fileStream, GeminiPrompts.XrayImport)
            ?? throw new BadRequestException($"Something wrong went extracting pdf for medical record {request.MedicalRecordId}");

        xRayDto.MedicalRecordId = request.MedicalRecordId;
        return xRayDto;
    }
}