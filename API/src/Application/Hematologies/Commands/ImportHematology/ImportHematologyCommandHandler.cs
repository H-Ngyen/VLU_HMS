using Application.Common;
using Application.Hematologies.Dtos;
using Application.Users;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Hematologies.Commands.ImportHematology;

public class ImportHematologyCommandHandler(ILogger<ImportHematologyCommandHandler> logger,
    IUserContext userContext,
    IHematologyAuthorizationService hematologyAuthorizationService,
    IPdfProcessorService pdfProcessorService) : IRequestHandler<ImportHematologyCommand, HematologyDto>
{
    public async Task<HematologyDto> Handle(ImportHematologyCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        logger.LogInformation("Extracting pdf to hematology for medical record {MedicalRecordId}", request.MedicalRecordId);

        if (!hematologyAuthorizationService.Authorize(user, null, ResourceOperation.Create))
            throw new ForbidException();

        using var fileStream = request.File.OpenReadStream();

        var hematologyDto = await pdfProcessorService.ExtractAsync<HematologyDto>(fileStream, GeminiPrompts.HematologyImport)
            ?? throw new BadRequestException($"Something wrong went extracting pdf for medical record {request.MedicalRecordId}");

        hematologyDto.MedicalRecordId = request.MedicalRecordId;
        return hematologyDto;
    }
}