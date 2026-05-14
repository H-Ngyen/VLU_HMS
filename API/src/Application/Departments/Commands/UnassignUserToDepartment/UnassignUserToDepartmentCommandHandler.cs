using Application.Users;
using Domain.Constants;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Departments.Commands.UnassignUserToDepartment;

public class UnassignUserToDepartmentCommandHandler(ILogger<UnassignUserToDepartmentCommandHandler> logger,
    IUserContext userContext,
    IDepartmentRepository departmentRepository,
    IDepartmentAuthorizationService departmentAuthorizationService) : IRequestHandler<UnassignUserToDepartmentCommand>
{
    public async Task Handle(UnassignUserToDepartmentCommand request, CancellationToken cancellationToken)
    {
        var currentUser = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        logger.LogInformation("User {UserEmail} unassign user {UnassignUserId} to department {DepartmentId}",
            currentUser.Email,
            request.UserId,
            request.DepartmentId);

        var department = await departmentRepository.FindOneAsync(d => d.Id == request.DepartmentId)
            ?? throw new NotFoundException($"Không tìm thấy khoa");

        var user = department.Users.FirstOrDefault(u => u.Id == request.UserId)
            ?? throw new NotFoundException($"Không tìm thấy người dùng {request.UserId} trong khoa {request.DepartmentId}");

        if (!departmentAuthorizationService.Authorize(currentUser, ResourceOperation.Update, department, DepartmentAction.UnassignUser))
            throw new ForbidException();

        // department head cant unassign himself unless he is an admin
        if (department.HeadUserId == request.UserId && !UserRoles.IsAdmin(currentUser.Role)) 
            throw new ForbidException();

        if (department.HeadUserId == request.UserId) 
            department.HeadUserId = null;

        user.DepartmentId = null;
        await departmentRepository.SaveChanges();
    }
}