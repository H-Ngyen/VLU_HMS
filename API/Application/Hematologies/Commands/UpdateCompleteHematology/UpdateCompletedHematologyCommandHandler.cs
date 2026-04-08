using Application.Users;
using AutoMapper;
using Domain.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Hematologies.Commands.UpdateCompleteHematology;

public class UpdateCompletedHematologyCommandHandler(ILogger<UpdateCompletedHematologyCommandHandler> logger,
    IUserContext userContext,
    IHematologyAuthorizationService hematologyAuthorizationService,
    IHematologyRepository hematologyRepository,
    IMedicalRecordsRepository medicalRecordsRepository,
    IMapper mapper) : IRequestHandler<UpdateCompletedHematologyCommand>
{
    public async Task Handle(UpdateCompletedHematologyCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser();
        var userId = user.Id;

        logger.LogInformation("User {userId} completing for hematology {HematologyId} of medicalRecord {MedicalRecord}",
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

        if (hematology.Status != MedicalStatus.Processing)
            throw new BadRequestException($"Phiếu xét nghiệm máu phải thuộc trạng thái {MedicalStatus.Processing} để thực hiện chức năng này");

        if (!hematologyAuthorizationService.Authorize(user, hematology, ResourceOperation.Update))
            throw new ForbidException();

        mapper.Map(request, hematology);
        // hematology.PerformedById = userId;
        await hematologyRepository.SaveChanges();
    }
}