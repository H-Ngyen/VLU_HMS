using Application.Auth.Commands.GoogleLogin;
using Application.Auth.Commands.GoogleOnboard;
using AutoMapper;
using Domain.Entities;
using Google.Apis.Auth;

namespace Application.Auth;

public class AuthProfile : Profile
{
    public AuthProfile()
    {
        CreateMap<GoogleJsonWebSignature.Payload, GoogleLoginResponse>()
            .ForMember(dest => dest.RequiresOnboarding, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.PictureUrl, opt => opt.MapFrom(src => src.Picture))
            .ForMember(dest => dest.Token, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore());

        CreateMap<GoogleJsonWebSignature.Payload, User>()
            .ForMember(dest => dest.Auth0Id, opt => opt.MapFrom(src => "google|" + src.Subject))
            .ForMember(dest => dest.PictureUrl, opt => opt.MapFrom(src => src.Picture ?? string.Empty))
            .ForMember(dest => dest.Active, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.CreateAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdateAt, opt => opt.Ignore())
            .ForMember(dest => dest.RoleId, opt => opt.Ignore())
            .ForMember(dest => dest.Role, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<GoogleOnboardCommand, Patient>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Name, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.Ethnicity, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore());
    }
}
