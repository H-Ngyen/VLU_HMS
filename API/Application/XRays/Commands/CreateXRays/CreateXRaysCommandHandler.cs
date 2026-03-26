using AutoMapper;
using Domain.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.XRays.Commands.CreateXRays;

public class CreateXRaysCommandHandler(ILogger<CreateXRaysCommandHandler> logger,
    IMedicalRecordsRepository medicalRecords,
    IMapper mapper,
    IXRayRepository xRayRepository,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<CreateXRaysCommand>
{
    public async Task Handle(CreateXRaysCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating the new xray with record id: {recordId}", request.MedicalRecordId);
        var creatorId = 1; // not for productions

        var medicalRecord = await medicalRecords.ExistAsync(request.MedicalRecordId);
        if (!medicalRecord)
            throw new BadRequestException(nameof(MedicalRecord), $"{request.MedicalRecordId}");

        var xray = mapper.Map<XRay>(request);
        xray.Status = MedicalStatus.Inital;
        xray.RequestedById = creatorId;
        xray.XRayStatusLogs.Add(new XRayStatusLog
        {
            Status = xray.Status,
            DepartmentName = request.DepartmentName,
            UpdatedById = creatorId,
            CreatedAt = dateTimeProvider.Now
        });

        await xRayRepository.CreateAsync(xray);
    }
}