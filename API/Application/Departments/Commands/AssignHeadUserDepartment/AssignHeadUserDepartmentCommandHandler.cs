using Application.Users;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Departments.Commands.AssignHeadUserDepartment;

public class AssignHeadUserDepartmentCommandHandler(ILogger<AssignHeadUserDepartmentCommandHandler> logger,
    IUserContext userContext,
    IDepartmentAuthorizationService departmentAuthorizationService,
    IDepartmentRepository departmentRepository,
    IUserRepository userRepository) : IRequestHandler<AssignHeadUserDepartmentCommand>
{
    public async Task Handle(AssignHeadUserDepartmentCommand request, CancellationToken cancellationToken)
    {
        var currentUser = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();

        logger.LogInformation("User {UserEmail} add user {UserId} to head of department {DepartmentId}",
            currentUser.Email,
            request.UserId,
            request.Id);

        var department = await departmentRepository.FindOneAsync(d => d.Id == request.Id)
            ?? throw new NotFoundException(nameof(Department), $"{request.Id}");

        if (!departmentAuthorizationService.Authorize(currentUser, ResourceOperation.Update, department, DepartmentAction.AssignHeadUser))
            throw new ForbidException();

        var user = await userRepository.FindOneAsync(u => u.Id == request.UserId)
            ?? throw new NotFoundException(nameof(User), $"{request.UserId}");

        var isHeadElsewhere = await departmentRepository.FindOneAsync(d => d.HeadUserId == request.UserId && d.Id != request.Id);
        if (isHeadElsewhere != null)
            throw new BadRequestException($"Người dùng này đã là trưởng khoa của khoa {isHeadElsewhere.Name}");

        if (user.DepartmentId != null && user.DepartmentId != request.Id)
            throw new BadRequestException($"Người dùng {user.Email} đã thuộc về khoa khác");

        user.DepartmentId = request.Id;
        department.HeadUserId = request.UserId;
        await departmentRepository.SaveChanges();
    }
}