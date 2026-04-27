using Application.Common;
using Application.MedicalRecords.Dtos;
using Domain.Enums;
using MediatR;
namespace Application.MedicalRecords.Queries.GetAllMedicalRecords;

public class GetAllMedicalRecordsQuery : IRequest<PagedResult<MedicalRecordItemDto>>
{
    public string? SearchPhrase { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;

    public RecordType? RecordType { get; set; }
}