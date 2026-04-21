using Application.Users;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Departments.Commands.UnassignHeadUserDepartment;

public class UnassignHeadUserDepartmentCommandHandler(ILogger<UnassignHeadUserDepartmentCommandHandler> logger,
    IUserContext userContext,
    IDepartmentRepository departmentRepository,
    IDepartmentAuthorizationService departmentAuthorizationService) : IRequestHandler<UnassignHeadUserDepartmentCommand>
{
    public async Task Handle(UnassignHeadUserDepartmentCommand request, CancellationToken cancellationToken)
    {
        var currentUser = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        logger.LogInformation("User {UserEmail} unassign head user {HeadUserId} of department {DepartmentId}",
            currentUser.Email,
            request.HeadUserId,
            request.Id);

        var department = await departmentRepository.FindOneAsync(d => d.Id == request.Id) ?? throw new NotFoundException($"Không tìm thấy khoa {request.Id}");
        if (!departmentAuthorizationService.Authorize(currentUser, ResourceOperation.Delete, department))
            throw new ForbidException();
        
        if(department.HeadUserId == null) throw new BadRequestException($"Khoa này hiện tại chưa có trưởng khoa");
        if(department.HeadUserId != request.HeadUserId) throw new BadRequestException($"Người dùng {request.HeadUserId} hiện tại không còn là trưởng khoa của khoa này");

        department.HeadUserId = null;
        await departmentRepository.SaveChanges();
    }
}