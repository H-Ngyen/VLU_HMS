using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.XRays.CreateXRays;

public class CreateXRaysCommandHandler(ILogger<CreateXRaysCommandHandler> logger,
    IMedicalRecordsRepository medicalRecords,
    IMapper mapper,
    IXRayRepository xRayRepository,
    IUserRepository userRepository) : IRequestHandler<CreateXRaysCommand, int>
{
    public async Task<int> Handle(CreateXRaysCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating the new xray with record id: {recordId}", request.MedicalRecordId);
        // var creator = 1; // not for productions
        
        var performUserExist = await userRepository.ExistsAsync(request.PerformedById);
        if(!performUserExist)
            throw new BadRequestException(nameof(User), request.PerformedById.ToString());

        var record = await medicalRecords.ExistAsync(request.MedicalRecordId);
        if(!record)
            throw new NotFoundException(nameof(MedicalRecord), request.MedicalRecordId.ToString());

        var xRay = mapper.Map<XRay>(request);
        var xRayId = await xRayRepository.CreateAsync(xRay);
        return xRayId;
    }
}