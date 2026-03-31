using Application.Users.Commands.CreateCurrentUser;
using AutoMapper;
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
    }
}