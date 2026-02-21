using AutoMapper;
using Domain.Entities;

namespace Application.MedicalRecordDetails.Dtos;

public class MedicalRecordDetailProfile : Profile
{
    public MedicalRecordDetailProfile()
    {
        CreateMap<MedicalRecordDetailDto, MedicalRecordDetail>()
            .ReverseMap();
        CreateMap<MedicalRecordRiskFactorDto, MedicalRecordRiskFactor>()
            .ReverseMap();
    }
}