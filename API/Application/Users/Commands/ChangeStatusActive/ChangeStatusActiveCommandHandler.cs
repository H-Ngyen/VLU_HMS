using Domain.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Users.Commands.ChangeStatusActive;

public class ChangeStatusActiveCommandHandler(ILogger<ChangeStatusActiveCommandHandler> logger,
    IUserContext _userContext,
    IUserRepository userRepository) : IRequestHandler<ChangeStatusActiveCommand>
{
    public async Task Handle(ChangeStatusActiveCommand request, CancellationToken cancellationToken)
    {
        var userContext = await _userContext.GetCurrentUser();
        logger.LogInformation("User {UserId} changing status active of user {Auth0Id}", userContext!.Id, request.Id);

        var user = await userRepository.FindOneAsync(u => u.Id == request.Id)
            ?? throw new NotFoundException(nameof(User), $"{request.Id}");

        if (UserRoles.IsAdmin(user.Role.Name))
            throw new BadRequestException($"Không thể ngừng hoạt động {UserRoles.Admin}");

        // if(UserRoles.IsInRoles(userRole))
        //     throw new BadRequestException($"Role người dùng không hợp lệ");

        user.Active = request.Active;
        await userRepository.SaveChanges();
    }
}