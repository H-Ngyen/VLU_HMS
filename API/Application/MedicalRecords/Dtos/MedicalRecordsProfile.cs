using Application.MedicalRecords.Commands.CreateMedicalRecord;
using Application.MedicalRecords.Commands.UpdateMedicalRecord;
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
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.Patient))
            .ForMember(dest => dest.DepartmentTransfers, opt => opt.MapFrom(src => src.DepartmentTransfers))
            .ForMember(dest => dest.Detail, opt => opt.MapFrom(src => src.Detail));

        CreateMap<MedicalRecord, MedicalRecordItemDto>();
        CreateMap<UpdateMedicalRecordCommand, MedicalRecord>();
    }
}