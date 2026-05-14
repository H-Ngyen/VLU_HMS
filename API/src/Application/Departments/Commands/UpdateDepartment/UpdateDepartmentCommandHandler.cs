using Application.Users;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Departments.Commands.UpdateDepartment;

public class UpdateDepartmentCommandHandler(ILogger<UpdateDepartmentCommandHandler> logger,
    IUserContext userContext,
    IDepartmentRepository departmentRepository,
    IDepartmentAuthorizationService departmentAuthorizationService) : IRequestHandler<UpdateDepartmentCommand>
{
    public async Task Handle(UpdateDepartmentCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();

        logger.LogInformation("User {UserEmail} updating department {DepartmentId}", user.Id, request.Id);

        if (!departmentAuthorizationService.Authorize(user, ResourceOperation.Update))
            throw new ForbidException();

        var department = await departmentRepository.FindOneAsync(d => d.Id == request.Id)
            ?? throw new NotFoundException(nameof(Department), $"{request.Id}");

        department.Name = request.Name;

        await departmentRepository.SaveChanges();
    }
}