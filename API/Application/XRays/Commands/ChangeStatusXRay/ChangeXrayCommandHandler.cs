using Domain.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.XRays.Commands.ChangeStatusXray;

public class ChangeXrayCommandHandler(ILogger<ChangeXrayCommandHandler> logger,
    IXRayRepository xRayRepository,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<ChangeXrayCommand>
{
    public async Task Handle(ChangeXrayCommand request, CancellationToken cancellationToken)
    {
        var userId = 1; // this is not for production, update soon

        logger.LogInformation("User {UserId} changing status for Xray {XrayId} of medicalRecord {medicalRecordId}",
            userId,
            request.Id,
            request.MedicalRecordId);

        var xray = await xRayRepository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(XRay), $"{request.Id}");

        if (xray.MedicalRecordId != request.MedicalRecordId)
            throw new BadRequestException($"X-Ray with ID {request.Id} does not belong to Medical Record with ID {request.MedicalRecordId}.");

        if (xray.Status == MedicalStatus.Completed)
            throw new BadRequestException($"X-Ray {xray.Id}: Record is locked in Completed state.");

        if (!IsValidTransition(xray.Status, request.Status))
            throw new BadRequestException($"User attempted invalid status transition for X-Ray {xray.Id}: {xray.Status} -> {request.Status}");

        if (request.Status == MedicalStatus.Completed && string.IsNullOrWhiteSpace(xray.ResultDescription))
            throw new BadRequestException("Không thể hoàn thành X-Ray khi chưa có kết quả (ResultDescription).");

        xray.Status = request.Status;
        xray.XRayStatusLogs.Add(new XRayStatusLog
        {
            Status = request.Status,
            DepartmentName = request.DepartmentName,
            UpdatedById = userId,
            CreatedAt = dateTimeProvider.Now
        });
        await xRayRepository.SaveChanges();
    }

    private static bool IsValidTransition(MedicalStatus current, MedicalStatus next)
        => next == current + 1;
}