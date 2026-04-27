using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Users.Commands.ChangeStatusActive;

public class ChangeStatusActiveCommandHandler(ILogger<ChangeStatusActiveCommandHandler> logger,
    IUserContext _userContext,
    IUserRepository userRepository,
    IUserAuthorizationService userAuthorizationService) : IRequestHandler<ChangeStatusActiveCommand>
{
    public async Task Handle(ChangeStatusActiveCommand request, CancellationToken cancellationToken)
    {
        var userContext = await _userContext.GetCurrentUser() ?? throw new UnauthorizedException();
            
        logger.LogInformation("User {UserId} changing status active of user {Auth0Id}", userContext.Id , request.Id);

        var user = await userRepository.FindOneAsync(u => u.Id == request.Id)
            ?? throw new NotFoundException(nameof(User), $"{request.Id}");

        if (UserRoles.IsAdmin(user.Role.Name))
            throw new BadRequestException($"Không thể ngừng hoạt động {UserRoles.Admin}");

        if(!userAuthorizationService.Authorize(userContext, user, ResourceOperation.Update))
            throw new ForbidException();
            
        // if(UserRoles.IsInRoles(userRole))
        //     throw new BadRequestException($"Role người dùng không hợp lệ");

        user.Active = request.Active;
        await userRepository.SaveChanges();
    }
}