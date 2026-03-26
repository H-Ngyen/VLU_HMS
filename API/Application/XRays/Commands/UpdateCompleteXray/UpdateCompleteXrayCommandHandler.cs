using AutoMapper;
using Domain.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.XRays.Commands.UpdateCompleteXray;

public class UpdateCompleteXrayCommandHandler(ILogger<UpdateCompleteXrayCommandHandler> logger,
    IXRayRepository xRayRepository,
    IMapper mapper) : IRequestHandler<UpdateCompleteXrayCommand>
{
    public async Task Handle(UpdateCompleteXrayCommand request, CancellationToken cancellationToken)
    {
        var userId = 1;
        logger.LogInformation("User {userId} completing for xray {XrayId} of medicalRecord {MedicalRecord}",
            userId,
            request.Id,
            request.MedicalRecordId);

        var xray = await xRayRepository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(XRay), $"{request.Id}");

        if (xray.MedicalRecordId != request.MedicalRecordId)
            throw new BadRequestException($"X-Ray with ID {request.Id} does not belong to Medical Record with ID {request.MedicalRecordId}.");

        if (xray.Status == MedicalStatus.Completed)
            throw new BadRequestException($"X-Ray {xray.Id}: Record is locked in Completed state.");

        if (xray.Status != MedicalStatus.Processing)
            throw new BadRequestException($"Không phải là {MedicalStatus.Processing}");

        mapper.Map(request, xray);
        xray.PerformedById = userId;
        await xRayRepository.SaveChanges();
    }
}