using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Users.Commands.ChangeRole;

public class ChangeRoleUserCommandHandler(ILogger<ChangeRoleUserCommandHandler> logger,
    IUserContext _userContext,
    IUserRepository userRepository,
    IUserRoleRepository userRoleRepository,
    IUserAuthorizationService userAuthorizationService) : IRequestHandler<ChangeRoleUserCommand>
{
    public async Task Handle(ChangeRoleUserCommand request, CancellationToken cancellationToken)
    {
        var userContext = await _userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        
        logger.LogInformation("User {UserId} changing user role {@request}", userContext.Id, request);

        var user = await userRepository.FindOneAsync(u => u.Id == request.Id)
            ?? throw new NotFoundException(nameof(User), $"{request.Id}");

        if (UserRoles.IsAdmin(user.Role.Name))
            throw new BadRequestException($"Không thể thực hiện hành động này lên {UserRoles.Admin}");

        if (!userAuthorizationService.Authorize(userContext, user, ResourceOperation.Update))
            throw new ForbidException();

        var userRole = await userRoleRepository.GetUserRoleAsync(r => r.Name == request.Role)
            ?? throw new BadRequestException(nameof(Role), $"{request.Role}");

        user.RoleId = userRole.Id;
        await userRepository.SaveChanges();
    }
}