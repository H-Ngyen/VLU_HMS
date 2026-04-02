using Domain.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.XRays.Commands.ChangeStatusXray;

public class ChangeStatusXrayCommandHandler(ILogger<ChangeStatusXrayCommandHandler> logger,
    IMedicalRecordsRepository medicalRecordsRepository,
    IXRayRepository xRayRepository,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<ChangeStatusXrayCommand>
{
    public async Task Handle(ChangeStatusXrayCommand request, CancellationToken cancellationToken)
    {
        var userId = 1; // this is not for production, update soon

        logger.LogInformation("User {UserId} changing status for Xray {XrayId} of medicalRecord {medicalRecordId}",
            userId,
            request.Id,
            request.MedicalRecordId);

        var medicalRecord = await medicalRecordsRepository.GetByIdAsync(request.MedicalRecordId)
                    ?? throw new NotFoundException(nameof(MedicalRecord), $"{request.MedicalRecordId}");

        var xray = medicalRecord.XRays.FirstOrDefault(x => x.Id == request.Id)
            ?? throw new NotFoundException(nameof(XRay), $"{request.Id}");

        if (xray.MedicalRecordId != request.MedicalRecordId)
            throw new BadRequestException($"Phiếu chụp x-quang {request.Id} không thuộc hồ sơ bệnh án {request.MedicalRecordId}.");

        if (xray.Status == MedicalStatus.Completed)
            throw new BadRequestException($"Phiếu chụp x-quang {xray.Id}: Hồ sơ đã bị khóa.");

        if (!IsValidTransition(xray.Status, request.Status))
            throw new BadRequestException($"Chuyển đổi trạng thái không hợp lệ cho phiếu xét nghiệm máu {xray.Id}: {xray.Status} -> {request.Status}");

        if (request.Status == MedicalStatus.Completed && xray.IsCompleted())
            throw new BadRequestException("Không thể hoàn thành phiếu chụp x-quang khi chưa có kết quả.");

        xray.Status = request.Status;
        xray.PerformedById = userId;
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