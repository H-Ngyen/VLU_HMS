using MediatR;

namespace Application.Notifications.Commands.MarkRead;

public class MarkReadCommand(int id) : IRequest
{
    public int Id { get; set; } = id;
}