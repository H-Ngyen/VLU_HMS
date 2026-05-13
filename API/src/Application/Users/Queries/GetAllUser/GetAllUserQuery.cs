using Application.Users.Dtos;
using MediatR;

namespace Application.Users.Queries.GetAllUser;

public class GetAllUserQuery : IRequest<IEnumerable<UserDto>?>
{
    
}