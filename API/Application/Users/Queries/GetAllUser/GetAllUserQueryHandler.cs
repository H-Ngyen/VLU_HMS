using Application.Users.Dtos;
using AutoMapper;
using Domain.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Users.Queries.GetAllUser;

public class GetAllUserQueryHandler(ILogger<GetAllUserQueryHandler> logger,
    IUserContext userContext,
    IMapper mapper,
    IUserRepository userRepository,
    IUserAuthorizationService userAuthorizationService) : IRequestHandler<GetAllUserQuery, IEnumerable<UserDto>?>
{
    public async Task<IEnumerable<UserDto>?> Handle(GetAllUserQuery request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser();
         
        logger.LogInformation("User {userId} getting all user", user.Id);
        var users = await userRepository.GetAllAsync();

        if (!userAuthorizationService.Authorize(user, ResourceOperation.Read))
            throw new ForbidException();

        var usersDto = mapper.Map<IEnumerable<UserDto>>(users);
        return usersDto;
    }
}