using Application.Users;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Departments.Commands.DeleteDepartment;

public class DeleteDepartmentCommandHandler(ILogger<DeleteDepartmentCommandHandler> logger,
    IUserContext userContext,
    IDepartmentAuthorizationService departmentAuthorizationService,
    IDepartmentRepository departmentRepository) : IRequestHandler<DeleteDepartmentCommand>
{
    public async Task Handle(DeleteDepartmentCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();

        logger.LogInformation("User {UserEmail} deleting department {DepartmentId}", user.Id, request.Id);

        if (!departmentAuthorizationService.Authorize(user, ResourceOperation.Delete))
            throw new ForbidException();

        var department = await departmentRepository.FindOneAsync(d => d.Id == request.Id)
            ?? throw new NotFoundException(nameof(Department), $"{request.Id}");

        await departmentRepository.DeleteAsync(department);
    }
}