using AutoMapper;
using Domain.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Users.Commands.CreateCurrentUser;

public class CreateCurrentUserCommandHandler(ILogger<CreateCurrentUserCommandHandler> logger,
    IUserRepository userRepository,
    IUserRoleRepository roleRepository,
    IMapper mapper,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<CreateCurrentUserCommand, (int id, bool isNew)>
{
    public async Task<(int id, bool isNew)> Handle(CreateCurrentUserCommand request, CancellationToken cancellationToken)
    {
        var isNew = true;
        logger.LogInformation("Creating new user {UserEmail}",
            request.Email);

        var userExisting = await userRepository.FindOneAsync(u => u.Auth0Id == request.Auth0Id);
        if (userExisting != null)
        {
            isNew = false;
            var userId = userExisting.Id;
            return (userId, isNew);
        }

        var roleName = ResolveRoleFromEmail(request.Email)
            ?? throw new BadRequestException($"Email không được phép truy cập vào hệ thống {request.Email}");

        var userRole = await roleRepository.GetUserRoleAsync(r => r.Name == roleName)
            ?? throw new NotFoundException(nameof(Role), $"{roleName}");

        var newUser = CreateUserEntity(request, userRole.Id);
        var newUserId = await userRepository.CreateAsync(newUser);
        return (newUserId, isNew);
    }

    private string? ResolveRoleFromEmail(string email)
    {
        var domain = EmailDomain.GetDomainEmail(email);
        
        return domain switch
        {
            EmailDomain.Admin => UserRoles.Admin,
            EmailDomain.Teacher => UserRoles.Teacher,
            EmailDomain.Student => UserRoles.Student,
            _ => null
        };
    }

    private User CreateUserEntity(CreateCurrentUserCommand request, int roleId)
    {
        var user = mapper.Map<User>(request);
        user.RoleId = roleId;
        user.CreateAt = dateTimeProvider.Now;
        user.UpdateAt = dateTimeProvider.ConvertToVietnamTime(request.UpdateAt);
        user.Active = true;

        return user;
    }
}