using Application.MedicalAttachments.Commands.CreateMedicalAttachment;
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
    }
}