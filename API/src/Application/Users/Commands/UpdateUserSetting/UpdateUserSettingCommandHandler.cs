using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Users.Commands.UpdateUserSetting;

public class UpdateUserSettingCommandHandler(ILogger<UpdateUserSettingCommandHandler> logger,
    IUserContext userContext,
    IUserAuthorizationService userAuthorizationService,
    IUserRepository userRepository) : IRequestHandler<UpdateUserSettingCommand>
{
    public async Task Handle(UpdateUserSettingCommand request, CancellationToken cancellationToken)
    {
        var currentUser = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        logger.LogInformation("User {UserId} changes setting config", request.Id);

        var user = await userRepository.FindOneAsync(u => u.Id == request.Id) ?? throw new NotFoundException($"Không tìm thấy người dùng {request.Id} trong hệ thống");
        if(!userAuthorizationService.Authorize(currentUser, user, ResourceOperation.Update))
            throw new ForbidException();

        user.IsReceivedEmail = request.IsReceivedEmail;
        await userRepository.SaveChanges();
    }
}