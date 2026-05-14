using MediatR;

namespace Application.Users.Commands.ChangeRole;

public class ChangeRoleUserCommand : IRequest
{
    public int Id { get; set; }
    public required string Role { get; set; }
}