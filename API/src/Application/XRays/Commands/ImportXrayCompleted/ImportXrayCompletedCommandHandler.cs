using Application.Users;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.XRays.Commands.ImportXrayCompleted;

public class ImportXrayCompletedCommandHandler(ILogger<ImportXrayCompletedCommandHandler> logger,
    IUserContext userContext,
    IMedicalRecordsRepository medicalRecordsRepository,
    IXRayRepository xRayRepository,
    IXrayAuthorizationService xrayAuthorizationService,
    IMapper mapper,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<ImportXrayCompletedCommand, int>
{
    public async Task<int> Handle(ImportXrayCompletedCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        logger.LogInformation("User {userId} completing xray from import pdf for medical record {MedicalRecordId}",
            user.Id,
            request.MedicalRecordId);

        if (!xrayAuthorizationService.Authorize(user, null, ResourceOperation.Create))
            throw new ForbidException();

        var recordExisting = await medicalRecordsRepository.ExistAsync(request.MedicalRecordId);
        if (!recordExisting)
            throw new NotFoundException(nameof(MedicalRecord), $"{request.MedicalRecordId}");

        var xray = mapper.Map<XRay>(request);
        xray.RequestedById = user.Id;
        xray.PerformedById = user.Id;
        xray.Status = MedicalStatus.Completed;

        var now = dateTimeProvider.Now;
        var statuses = new[] { MedicalStatus.Inital, MedicalStatus.Received, MedicalStatus.Processing, MedicalStatus.Completed };
        foreach (var s in statuses)
        {
            xray.XRayStatusLogs.Add(new XRayStatusLog
            {
                Status = s,
                DepartmentName = (s == MedicalStatus.Inital)
                    ? request.RequestDepartmentName
                    : request.PerformDepartmentName,
                UpdatedById = user.Id,
                CreatedAt = now.AddSeconds(-(4 - (int)s))
            });
        }
        if (!xray.IsCompleted())
            throw new BadRequestException("Phiếu chụp X-Quang chưa hoàn thành");

        var id = await xRayRepository.CreateAsync(xray);
        return id;
    }
}