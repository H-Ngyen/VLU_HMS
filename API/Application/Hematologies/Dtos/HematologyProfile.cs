using Application.Hematologies.Commands.CreateHematology;
using Application.Hematologies.Commands.UpdateCompleteHematology;
using AutoMapper;
using Domain.Entities;

namespace Application.Hematologies.Dtos;

public class HematologyProfile : Profile
{
    public HematologyProfile()
    {
        // Command -> Entity
        CreateMap<CreateHematologyCommand, Hematology>();
        CreateMap<UpdateCompletedHematologyCommand, Hematology>();

        // Entity -> DTO
        CreateMap<Hematology, HematologyDto>()
            .ForMember(dest => dest.RequestedByName, opt => opt.MapFrom(src => src.RequestedBy != null ? src.RequestedBy.Email : null))
            .ForMember(dest => dest.PerformedByName, opt => opt.MapFrom(src => src.PerformedBy != null ? src.PerformedBy.Email : null));

        CreateMap<HematologyStatusLog, HematologyStatusLogDto>()
            .ForMember(dest => dest.UpdatedByName, opt => opt.MapFrom(src => src.UpdatedBy != null ? src.UpdatedBy.Email : null));
    }
}