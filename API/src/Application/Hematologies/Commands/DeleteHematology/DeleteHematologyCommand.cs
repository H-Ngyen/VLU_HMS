using MediatR;

namespace Application.Hematologies.Commands.DeleteHematology;

public class DeleteHematologyCommand(int id) : IRequest
{
    public int Id { get; set; } = id;
}