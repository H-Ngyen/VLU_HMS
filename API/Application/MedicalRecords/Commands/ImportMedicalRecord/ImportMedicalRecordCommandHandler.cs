using Application.Common;
using Application.MedicalRecords.Dtos;
using AutoMapper;
using Domain.Constants;
using Domain.Exceptions;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.MedicalRecords.Commands.ImportMedicalRecord;

public class ImportMedicalRecordCommandHandler(ILogger<ImportMedicalRecordCommandHandler> logger,
    IMedicalRecordAuthorizationService medicalRecordAuthorizationService,
    IPdfProcessorService pdfProcessorService) : IRequestHandler<ImportMedicalRecordCommand, MedicalRecordDto>
{
    public async Task<MedicalRecordDto> Handle(ImportMedicalRecordCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Extracting pdf to medical record for patient {PatientId}", request.PatientId);
        
        if (!await medicalRecordAuthorizationService.Authorize(ResourceOperation.Create))
            throw new ForbidException();

        var file = request.FilePdf;
        using var fileStream = file.OpenReadStream();

        var medicalRecordDto = await pdfProcessorService.ExtractAsync<MedicalRecordDto>(fileStream, GeminiPrompts.MedicalRecordImport)
            ?? throw new BadRequestException($"Something wrong went extracting pdf for patient {request.PatientId}");

        medicalRecordDto.PatientId = request.PatientId;
        return medicalRecordDto;
    }
}