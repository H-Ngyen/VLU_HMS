using Application.Users.Commands.CreateCurrentUser;
using AutoMapper;
using Domain.Constants;
using Domain.Entities;

namespace Application.Users.Dtos;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<CreateCurrentUserCommand, User>();
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.RoleName,
                opt => opt.MapFrom(src => src.Role.Name));

        CreateMap<UserTokenData, User>()
            .ForMember(dest => dest.Auth0Id, opt => opt.MapFrom(src => src.Auth0Id))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.PictureUrl, opt => opt.MapFrom(src => src.PictureUrl))
            .ForMember(dest => dest.UpdateAt, opt => opt.MapFrom(src => src.UpdateAt));
    }
}