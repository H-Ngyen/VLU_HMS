using Application.Users;
using AutoMapper;
using Domain.Constants;
using Domain.Entities;
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
    IHematologyRepository hematologyRepository) : IRequestHandler<CreateHematologyCommand>
{
    public async Task Handle(CreateHematologyCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser();
        var userId = user.Id;

        logger.LogInformation("User {userId} creating new hematology for medicalRecord {MedicalRecordId}",
            userId,
            request.MedicalRecordId);

        var medicalRecord = await recordsRepository.GetByIdAsync(request.MedicalRecordId)
            ?? throw new NotFoundException(nameof(MedicalRecord), $"{request.MedicalRecordId}");

        var hematology = mapper.Map<Hematology>(request);
        hematology.Status = MedicalStatus.Inital;
        hematology.RequestedById = userId;
        hematology.HematologyStatusLogs.Add(new HematologyStatusLog
        {
            Status = hematology.Status,
            DepartmentName = request.DepartmentName,
            CreatedAt = dateTimeProvider.Now,
            UpdatedById = userId
        });

        if (!hematologyAuthorizationService.Authorize(user, hematology, ResourceOperation.Create))
            throw new ForbidException();

        await hematologyRepository.CreateAsync(hematology);
    }
}