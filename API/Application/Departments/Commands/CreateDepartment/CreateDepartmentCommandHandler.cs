using Application.Users;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Departments.Commands.CreateDepartment;

public class CreateDepartmentCommandHandler(ILogger<CreateDepartmentCommandHandler> logger,
    IUserContext userContext,
    IDepartmentAuthorizationService departmentAuthorizationService,
    IMapper mapper,
    IDepartmentRepository departmentRepository,
    IDateTimeProvider datetimeProvider) : IRequestHandler<CreateDepartmentCommand, int>
{
    public async Task<int> Handle(CreateDepartmentCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();

        logger.LogInformation("User {UserID} creating new department {DepartmentName}", user.Id, request.Name);

        if (!departmentAuthorizationService.Authorize(user, ResourceOperation.Create))
            throw new ForbidException();

        var department = mapper.Map<Department>(request);
        department.CreatedAt = datetimeProvider.Now;

        var departmentId = await departmentRepository.CreateAsync(department);
        return departmentId;
    }
}