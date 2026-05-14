using Application.Users;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Departments.Commands.AssignUserToDepartment;

public class AssignUserToDepartmentCommandHandler(ILogger<AssignUserToDepartmentCommandHandler> logger,
    IUserContext userContext,
    IDepartmentAuthorizationService departmentAuthorizationService,
    IDepartmentRepository departmentRepository,
    IUserRepository userRepository) : IRequestHandler<AssignUserToDepartmentCommand>
{
    public async Task Handle(AssignUserToDepartmentCommand request, CancellationToken cancellationToken)
    {
        var currentUser = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();

        logger.LogInformation("User {UserEmail} add user {UserId} to department {DepartmentId}",
            currentUser.Id,
            request.UserId,
            request.Id);

        var department = await departmentRepository.FindOneAsync(d => d.Id == request.Id)
            ?? throw new NotFoundException(nameof(Department), $"{request.Id}");

        if (!departmentAuthorizationService.Authorize(currentUser, ResourceOperation.Update, department, DepartmentAction.AssignUser))
            throw new ForbidException();

        var user = await userRepository.FindOneAsync(u => u.Id == request.UserId)
            ?? throw new NotFoundException(nameof(User), $"{request.UserId}");

        if (user.DepartmentId != null && user.DepartmentId != request.Id)
            throw new BadRequestException($"Người dùng {user.Email} đã thuộc về khoa khác");

        user.DepartmentId = request.Id;
        await userRepository.SaveChanges();
    }
}