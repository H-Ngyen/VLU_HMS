using Application.Common;
using Application.MedicalRecords.Dtos;
using AutoMapper;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.MedicalRecords.Queries.GetAllMedicalRecords;

public class GetAllMedicalRecordsQueryHandler(ILogger<GetAllMedicalRecordsQueryHandler> logger,
    IMedicalRecordAuthorizationService medicalRecordAuthorizationService,
    IMedicalRecordsRepository medicalRecordsRepository,
    IMapper mapper) : IRequestHandler<GetAllMedicalRecordsQuery, PagedResult<MedicalRecordItemDto>>
{
    public async Task<PagedResult<MedicalRecordItemDto>> Handle(GetAllMedicalRecordsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all medical records.");

        if (!await medicalRecordAuthorizationService.Authorize(ResourceOperation.Read))
            throw new ForbidException();

        var (records, totalCount) = await medicalRecordsRepository.GetAllMatchingAsync(request.SearchPhrase,
            request.PageSize,
            request.PageNumber,
            request.RecordType);

        var recordsDto = mapper.Map<IEnumerable<MedicalRecordItemDto>>(records);
        var result = new PagedResult<MedicalRecordItemDto>(recordsDto, totalCount, request.PageSize, request.PageNumber);
        return result;
    }
}