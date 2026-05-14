using MediatR;

namespace Application.Users.Commands.ChangeStatusActive;

public class ChangeStatusActiveCommand : IRequest
{
    public int Id { get; set; }
    public required bool Active { get; set; }
}