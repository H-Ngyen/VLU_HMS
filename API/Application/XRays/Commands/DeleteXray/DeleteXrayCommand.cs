using MediatR;

namespace Application.XRays.Commands.DeleteXray;

public class DeleteXrayCommand(int id) : IRequest
{
    public int Id { get; set; } = id;
}