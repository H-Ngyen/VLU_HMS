using Application.Users.Dtos;
using AutoMapper;
using Domain.Constants;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Users.Queries.GetAllUser;

public class GetAllUserQueryHandler(ILogger<GetAllUserQueryHandler> logger,
    IMapper mapper,
    IUserRepository userRepository) : IRequestHandler<GetAllUserQuery, IEnumerable<UserDto>?>
{
    public async Task<IEnumerable<UserDto>?> Handle(GetAllUserQuery request, CancellationToken cancellationToken)
    {
        var userId = 1; // this is not for production, update soon
        logger.LogInformation("User {userId} getting all user", userId);
        var users = await userRepository.GetAllAsync();
        var usersDto = mapper.Map<IEnumerable<UserDto>>(users);
        return usersDto;
    }
}