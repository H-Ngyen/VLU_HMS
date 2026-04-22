using Application.Notifications.Commands.PublishNotification;
using Application.Users;
using AutoMapper;
using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.XRays.Commands.CreateXRays;

public class CreateXRaysCommandHandler(ILogger<CreateXRaysCommandHandler> logger,
    IUserContext userContext,
    IMedicalRecordsRepository medicalRecords,
    IXrayAuthorizationService xrayAuthorizationService,
    IDepartmentRepository departmentRepository,
    IMapper mapper,
    IXRayRepository xRayRepository,
    IDateTimeProvider dateTimeProvider,
    IMediator mediator) : IRequestHandler<CreateXRaysCommand>
{
    public async Task Handle(CreateXRaysCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating the new xray with record id: {recordId}", request.MedicalRecordId);
        var user = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        var creatorId = user.Id;

        var medicalRecord = await medicalRecords.ExistAsync(request.MedicalRecordId);
        if (!medicalRecord)
            throw new BadRequestException(nameof(MedicalRecord), $"{request.MedicalRecordId}");

        var departments = await departmentRepository.GetAllAsync() 
            ?? throw new InvalidOperationException($"Hệ thống chưa có khoa nào");
        var currentUserDepartment = departments!.FirstOrDefault(d => d.Id == user.DepartmentId) 
            ?? throw new BadRequestException($"Bạn chưa thuộc về quyền quản lý của bất kỳ khoa nào");

        var xray = mapper.Map<XRay>(request);
        xray.Status = MedicalStatus.Inital;
        xray.RequestedById = creatorId;
        xray.XRayStatusLogs.Add(new XRayStatusLog
        {
            Status = xray.Status,
            DepartmentName = currentUserDepartment.Name,
            UpdatedById = creatorId,
            CreatedAt = dateTimeProvider.Now
        });

        if (!xrayAuthorizationService.Authorize(user, xray, ResourceOperation.Create))
            throw new ForbidException();

        var id = await xRayRepository.CreateAsync(xray);
        await PublishNotification(id, request, departments);
    }
    private async Task PublishNotification(int xrayId, CreateXRaysCommand request, IEnumerable<Department> departments)
    {
        var listUserId = departments
            .Where(d => request.ListDepartmentId.Contains(d.Id) && d.HeadUserId != null)
            .Select(d => d.HeadUserId!.Value)
            .ToList();

        var isSuccess = await mediator.Send(new PublishNotificationCommand(xrayId)
        {
            ClinicalType = ClinicalsType.Xray,
            NotificattionType = NotificationType.XrayInitial,
            ListUserId = listUserId
        });
    }
}