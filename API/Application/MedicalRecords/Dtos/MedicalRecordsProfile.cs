using Application.MedicalRecords.Commands.CreateMedicalRecord;
using AutoMapper;
using Domain.Entities;

namespace Application.MedicalRecords.Dtos;

public class MedicalRecordsProfile : Profile
{
    public MedicalRecordsProfile()
    {
        CreateMap<CreateMedicalRecordCommand, MedicalRecord>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.StorageCode, opt => opt.Ignore())
            .ForMember(dest => dest.Attachments, opt => opt.Ignore());

        CreateMap<MedicalRecord, MedicalRecordDto>()
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.Patient));

        CreateMap<MedicalRecord, MedicalRecordItemDto>();
    }
}