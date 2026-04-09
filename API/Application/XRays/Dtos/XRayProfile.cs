using Application.XRays.Commands.CreateXRays;
using Application.XRays.Commands.ImportXrayCompleted;
using Application.XRays.Commands.UpdateCompleteXray;
using AutoMapper;
using Domain.Entities;

namespace Application.XRays.Dtos;

public class XRayProfile : Profile
{
    public XRayProfile()
    {
        // Command -> Entity
        CreateMap<CreateXRaysCommand, XRay>();

        // Entity -> DTO
        CreateMap<XRay, XRayDto>()
            .ForMember(dest => dest.RequestedByName, opt => opt.MapFrom(src => src.RequestedBy.Email))
            .ForMember(dest => dest.PerformedByName, opt => opt.MapFrom(src => src.PerformedBy != null ? src.PerformedBy.Email : null));

        CreateMap<XRayStatusLog, XRayStatusLogDto>()
            .ForMember(dest => dest.UpdatedByName, opt => opt.MapFrom(src => src.UpdatedBy.Email));

        //command -> entity
        CreateMap<UpdateCompleteXrayCommand, XRay>();
        
        CreateMap<ImportXrayCompletedCommand, XRay>();
    }
}
