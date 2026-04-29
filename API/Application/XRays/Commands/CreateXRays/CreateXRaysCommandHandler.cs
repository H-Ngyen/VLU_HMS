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
    IMedicalRecordsRepository medicalRecordsRepository,
    IXrayAuthorizationService xrayAuthorizationService,
    IDepartmentRepository departmentRepository,
    IMapper mapper,
    IXRayRepository xRayRepository,
    IUserRepository userRepository,
    IDateTimeProvider dateTimeProvider,
    IMediator mediator) : IRequestHandler<CreateXRaysCommand>
{
    public async Task Handle(CreateXRaysCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating the new xray with record id: {recordId}", request.MedicalRecordId);
        var user = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        var creatorId = user.Id;

        var medicalRecord = await medicalRecordsRepository.ExistAsync(request.MedicalRecordId);
        if (!medicalRecord)
            throw new BadRequestException(nameof(MedicalRecord), $"{request.MedicalRecordId}");

        var departments = await departmentRepository.GetAllAsync()
            ?? throw new InvalidOperationException($"Hệ thống chưa có khoa nào");
        var currentUserDepartment = departments!.FirstOrDefault(d => d.Id == user.DepartmentId)
            ?? throw new BadRequestException($"Bạn chưa thuộc về quyền quản lý của bất kỳ khoa nào");

        var newXray = CreateNewXray(request, user, departments);

        if (!xrayAuthorizationService.Authorize(user, newXray, ResourceOperation.Create))
            throw new ForbidException();

        var id = await xRayRepository.CreateAsync(newXray);
        await PublishNotification(id, request, departments);
    }
    private async Task PublishNotification(int xrayId, CreateXRaysCommand request, IEnumerable<Department> departments)
    {
        var listUserId = departments
            .Where(d => request.ListDepartmentId.Contains(d.Id) && d.HeadUserId != null)
            .Select(d => d.HeadUserId!.Value)
            .ToList();

        var additionalUser = await userRepository.GetListByIdsAsync(request.AdditionalUserIds ?? []);

        foreach (var user in additionalUser)
        {
            if (user.DepartmentId == null || !request.ListDepartmentId.Contains(user.DepartmentId.Value))
                throw new BadRequestException($"{user.Email} không thuộc về một trong các khoa được chỉ định");
            listUserId.Add(user.Id);
        }

        var isSuccess = await mediator.Send(new PublishNotificationCommand(xrayId)
        {
            ClinicalType = ClinicalsType.Xray,
            NotificattionType = NotificationType.XrayInitial,
            ListUserId = listUserId.Distinct()
        });
    }

    private XRay CreateNewXray(CreateXRaysCommand command, CurrentUser currentUser, IEnumerable<Department> department)
    {
        var requestUserDepartment = department.FirstOrDefault(d => d.Id == currentUser.DepartmentId);
        var xray = mapper.Map<XRay>(command);
        xray.Status = MedicalStatus.Inital;
        xray.RequestedById = currentUser.Id;
        xray.XRayStatusLogs.Add(new XRayStatusLog
        {
            Status = xray.Status,
            DepartmentName = requestUserDepartment?.Name,
            UpdatedById = currentUser.Id,
            CreatedAt = dateTimeProvider.Now
        });
        return xray;
    }
}