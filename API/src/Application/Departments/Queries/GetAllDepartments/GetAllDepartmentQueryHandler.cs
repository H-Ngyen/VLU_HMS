using Application.Departments.Dtos;
using Application.Users;
using AutoMapper;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Departments.Queries.GetAllDepartments;

public class GetAllDepartmentQueryHandler(ILogger<GetAllDepartmentQueryHandler> logger,
    IUserContext userContext,
    IDepartmentAuthorizationService departmentAuthorizationService,
    IDepartmentRepository departmentRepository,
    IMapper mapper) : IRequestHandler<GetAllDepartmentQuery, IEnumerable<DepartmentDto>?>
{
    public async Task<IEnumerable<DepartmentDto>?> Handle(GetAllDepartmentQuery request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();

        logger.LogInformation("User {userEmail} getting all department", user.Email);

        if(!departmentAuthorizationService.Authorize(user, ResourceOperation.Read))
            throw new ForbidException();

        var departments = await departmentRepository.GetAllAsync();
        var departmentsDto = mapper.Map<IEnumerable<DepartmentDto>>(departments);
        return departmentsDto;
    }
}