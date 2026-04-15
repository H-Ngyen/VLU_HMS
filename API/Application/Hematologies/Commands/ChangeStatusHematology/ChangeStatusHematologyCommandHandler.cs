using Application.Users;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Hematologies.Commands.ChangeStatusHematology;

public class ChangeStatusHematologyCommandHandler(ILogger<ChangeStatusHematologyCommandHandler> logger,
    IUserContext userContext,
    IHematologyAuthorizationService hematologyAuthorizationService,
    IMedicalRecordsRepository medicalRecordsRepository,
    IHematologyRepository hematologyRepository,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<ChangeStatusHematologyCommand>
{
    public async Task Handle(ChangeStatusHematologyCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();
        var userId = user.Id;

        logger.LogInformation("User {UserId} changing status for Hematology {HematologyId} of medicalRecord {medicalRecordId}",
            userId,
            request.Id,
            request.MedicalRecordId);

        var medicalRecord = await medicalRecordsRepository.GetByIdAsync(request.MedicalRecordId)
            ?? throw new NotFoundException(nameof(MedicalRecord), $"{request.MedicalRecordId}");

        var hematology = medicalRecord.Hematologies.FirstOrDefault(h => h.Id == request.Id)
            ?? throw new NotFoundException(nameof(Hematology), $"{request.Id}");

        if (hematology.MedicalRecordId != request.MedicalRecordId)
            throw new BadRequestException($"Phiếu xét nghiệm máu {request.Id} không thuộc hồ sơ bệnh án {request.MedicalRecordId}.");

        if (hematology.Status == MedicalStatus.Completed)
            throw new BadRequestException($"Phiếu xét nghiệm máu {hematology.Id}: Hồ sơ đã bị khóa.");

        if (!IsValidTransition(hematology.Status, request.Status))
            throw new BadRequestException($"Chuyển đổi trạng thái không hợp lệ cho phiếu xét nghiệm máu {hematology.Id}: {hematology.Status} -> {request.Status}");

        if (request.Status == MedicalStatus.Completed && !hematology.IsCompleted())
            throw new BadRequestException("Không thể hoàn thành phiếu xét nghiệm máu khi chưa có kết quả đầy đủ.");

        if (!hematologyAuthorizationService.Authorize(user, hematology, ResourceOperation.Update))
            throw new ForbidException();

        hematology.Status = request.Status;
        hematology.PerformedById = userId;
        hematology.HematologyStatusLogs.Add(new HematologyStatusLog
        {
            Status = request.Status,
            DepartmentName = request.DepartmentName,
            UpdatedById = userId,
            CreatedAt = dateTimeProvider.Now
        });
        await hematologyRepository.SaveChanges();
    }

    private static bool IsValidTransition(MedicalStatus current, MedicalStatus next)
        => next == current + 1;
}