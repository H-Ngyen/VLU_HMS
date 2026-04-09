using Application.Users;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.XRays.Commands.UpdateCompleteXray;

public class UpdateCompleteXrayCommandHandler(ILogger<UpdateCompleteXrayCommandHandler> logger,
    IUserContext userContext,
    IXRayRepository xRayRepository,
    IXrayAuthorizationService xrayAuthorizationService,
    IMedicalRecordsRepository medicalRecordsRepository,
    IMapper mapper) : IRequestHandler<UpdateCompleteXrayCommand>
{
    public async Task Handle(UpdateCompleteXrayCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser();
        var userId = user.Id;

        logger.LogInformation("User {userId} completing for xray {XrayId} of medicalRecord {MedicalRecord}",
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

        if (xray.Status != MedicalStatus.Processing)
            throw new BadRequestException($"Phiếu chụp x-quang phải thuộc trạng thái {MedicalStatus.Processing} để thực hiện chức năng này");

        if (!xrayAuthorizationService.Authorize(user, xray, ResourceOperation.Update))
            throw new ForbidException();

        mapper.Map(request, xray);
        // xray.PerformedById = userId;
        await xRayRepository.SaveChanges();
    }
}