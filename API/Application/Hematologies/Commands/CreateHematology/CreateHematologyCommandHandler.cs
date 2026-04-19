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

namespace Application.Hematologies.Commands.CreateHematology;

public class CreateHematologyCommandHandler(ILogger<CreateHematologyCommandHandler> logger,
    IUserContext userContext,
    IHematologyAuthorizationService hematologyAuthorizationService,
    IMapper mapper,
    IDateTimeProvider dateTimeProvider,
    IMedicalRecordsRepository recordsRepository,
    IHematologyRepository hematologyRepository,
    IDepartmentRepository departmentRepository,
    IMediator mediator) : IRequestHandler<CreateHematologyCommand>
{
    public async Task Handle(CreateHematologyCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        var userId = user.Id;

        logger.LogInformation("User {userId} creating new hematology for medicalRecord {MedicalRecordId}",
            userId,
            request.MedicalRecordId);

        var medicalRecord = await recordsRepository.GetByIdAsync(request.MedicalRecordId)
            ?? throw new NotFoundException(nameof(MedicalRecord), $"{request.MedicalRecordId}");

        var departments = await departmentRepository.GetAllAsync() ?? throw new NotFoundException($"Chưa có khoa nào được tạo");

        var hematology = CreateNewHematology(request, user, departments);

        if (!hematologyAuthorizationService.Authorize(user, hematology, ResourceOperation.Create))
            throw new ForbidException();

        var id = await hematologyRepository.CreateAsync(hematology);

        await PublishNotification(id, request, departments);
    }

    private async Task PublishNotification(int hematologyId, CreateHematologyCommand request, IEnumerable<Department> departments)
    {
        var listUserId = departments
            .Where(d => request.ListDepartmentId.Contains(d.Id) && d.HeadUserId != null)
            .Select(d => d.HeadUserId!.Value)
            .ToList();

        var isSuccess = await mediator.Send(new PublishNotificationCommand(hematologyId)
        {
            ClinicalType = ClinicalsType.Hematology,
            NotificattionType = NotificationType.HematologyInitial,
            ListUserId = listUserId
        });
    }

    private Hematology CreateNewHematology(CreateHematologyCommand command, CurrentUser currentUser, IEnumerable<Department> department)
    {
        var requestUserDepartment = department.FirstOrDefault(d => d.Id == currentUser.DepartmentId);
        var hematology = mapper.Map<Hematology>(command);
        hematology.Status = MedicalStatus.Inital;
        hematology.RequestedById = currentUser.Id;
        hematology.HematologyStatusLogs.Add(new HematologyStatusLog
        {
            Status = hematology.Status,
            DepartmentName = requestUserDepartment?.Name,
            CreatedAt = dateTimeProvider.Now,
            UpdatedById = currentUser.Id
        });
        return hematology;
    }
}