using Application.XRays.CreateXRays;
using AutoMapper;
using Domain.Entities;

namespace Application.XRays.Dtos;

public class XRayProfile : Profile
{
    public XRayProfile()
    {
        CreateMap<CreateXRaysCommand, XRay>();
    }
}