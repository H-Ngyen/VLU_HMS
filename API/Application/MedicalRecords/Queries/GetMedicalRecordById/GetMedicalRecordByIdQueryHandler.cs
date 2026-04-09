using Application.MedicalRecords.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.MedicalRecords.Queries.GetMedicalRecordById;

public class GetMedicalRecordByIdQueryHandler(ILogger<GetMedicalRecordByIdQueryHandler> logger,
    IMedicalRecordsRepository recordsRepository,
    IMedicalRecordAuthorizationService medicalRecordAuthorizationService,
    IMapper mapper) : IRequestHandler<GetMedicalRecordByIdQuery, MedicalRecordDto>
{
    public async Task<MedicalRecordDto> Handle(GetMedicalRecordByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Geting record with Id: {RecordId}", request.Id);
        var record = await recordsRepository.GetByIdAsync(request.Id) 
            ?? throw new NotFoundException(nameof(MedicalRecord), request.Id.ToString());

        if(!await medicalRecordAuthorizationService.Authorize(ResourceOperation.Read))
            throw new ForbidException();

        var recordDto = mapper.Map<MedicalRecordDto>(record);    
        return recordDto;
    }
}