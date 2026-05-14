using AutoMapper;
using Domain.Entities;

namespace Application.DepartmentTransfers.Dtos;

public class DepartmentTransferProfile : Profile
{
    public DepartmentTransferProfile()
    {
        CreateMap<DepartmentTransferDto, DepartmentTransfer>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.MedicalRecordId, opt => opt.Ignore())
            .ForMember(dest => dest.MedicalRecord, opt => opt.Ignore())
            .ReverseMap();
    }
}