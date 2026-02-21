using Application.MedicalAttachments.Commands.CreateMedicalAttachment;
using Application.MedicalAttachments.Commands.UpdateMedicalAttachment;
using Application.MedicalAttachments.Queries;
using AutoMapper;
using Domain.Entities;

namespace Application.MedicalAttachments.Dtos;

public class MedicalAttachmentProfile : Profile
{
    public MedicalAttachmentProfile()
    {
        // CreateMap<MedicalAttachment, MedicalAttachmentDto>();
        CreateMap<CreateMedicalAttachmentCommand, MedicalAttachment>()
            .ForMember(dest => dest.Path, opt => opt.Ignore());
        CreateMap<MedicalAttachment, MedicalAttachmentDto>()
            .ReverseMap();
        CreateMap<UpdateMedicalAttachmentCommand, MedicalAttachment>();
    }
}