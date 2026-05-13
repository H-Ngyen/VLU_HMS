using Application.Departments.Commands.CreateDepartment;
using AutoMapper;
using Domain.Entities;

namespace Application.Departments.Dtos;

public class DepartmentProfile : Profile
{
    public DepartmentProfile()
    {
        CreateMap<CreateDepartmentCommand, Department>();
        CreateMap<Department, DepartmentDto>();
            // .ForMember(dest => dest.HeadUser, opt => opt.MapFrom(src => src.HeadUser != null ? src.HeadUser.Email : null));
    }
}