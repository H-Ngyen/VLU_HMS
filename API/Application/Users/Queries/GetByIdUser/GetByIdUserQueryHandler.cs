using Application.Users.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Users.Queries.GetByIdUser;

public class GetByIdUserQueryHandler(ILogger<GetByIdUserQueryHandler> logger,
    IUserRepository userRepository,
    IMapper mapper) : IRequestHandler<GetByIdUserQuery, UserDto?>
{
    public async Task<UserDto?> Handle(GetByIdUserQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting user {userId}", request.Id);
        var user = await userRepository.FindOneAsync(u => u.Id == request.Id)
            ?? throw new NotFoundException(nameof(User), $"{request.Id}");
        var userDto = mapper.Map<UserDto>(user);
        return userDto;
    }
}