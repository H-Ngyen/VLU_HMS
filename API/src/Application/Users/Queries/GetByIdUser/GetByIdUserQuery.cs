using Application.Users.Dtos;
using MediatR;

namespace Application.Users.Queries.GetByIdUser;

public class GetByIdUserQuery(int userId) : IRequest<UserDto?>
{
    public int Id { get; set; } = userId;
}