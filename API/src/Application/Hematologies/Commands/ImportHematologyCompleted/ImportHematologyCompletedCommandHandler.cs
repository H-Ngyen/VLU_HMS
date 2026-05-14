using Application.Users;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Hematologies.Commands.ImportHematologyCompleted;

public class ImportHematologyCompletedCommandHandler(ILogger<ImportHematologyCompletedCommandHandler> logger,
    IUserContext userContext,
    IMedicalRecordsRepository medicalRecordsRepository,
    IHematologyRepository hematologyRepository,
    IHematologyAuthorizationService hematologyAuthorizationService,
    IMapper mapper,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<ImportHematologyCompletedCommand, int>
{
    public async Task<int> Handle(ImportHematologyCompletedCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        logger.LogInformation("User {userId} completing hematology from import pdf for medical record {MedicalRecordId}",
            user.Id,
            request.MedicalRecordId);

        if (!hematologyAuthorizationService.Authorize(user, null, ResourceOperation.Create))
            throw new ForbidException();

        var recordExisting = await medicalRecordsRepository.ExistAsync(request.MedicalRecordId);
        if (!recordExisting)
            throw new NotFoundException(nameof(MedicalRecord), $"{request.MedicalRecordId}");

        var hematology = mapper.Map<Hematology>(request);
        hematology.RequestedById = user.Id;
        hematology.PerformedById = user.Id;
        hematology.Status = MedicalStatus.Completed;

        var now = dateTimeProvider.Now;
        var statuses = new[] { MedicalStatus.Inital, MedicalStatus.Received, MedicalStatus.Processing, MedicalStatus.Completed };
        foreach (var s in statuses)
        {
            hematology.HematologyStatusLogs.Add(new HematologyStatusLog
            {
                Status = s,
                DepartmentName = (s == MedicalStatus.Inital)
                    ? request.RequestDepartmentName
                    : request.PerformDepartmentName,
                UpdatedById = user.Id,
                CreatedAt = now.AddSeconds(-(4 - (int)s))
            });
        }
        if (!hematology.IsCompleted())
            throw new BadRequestException("Phiếu xét nghiệm huyết học chưa hoàn thành");

        var id = await hematologyRepository.CreateAsync(hematology);
        return id;
    }
}