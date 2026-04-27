using MediatR;

namespace Application.Departments.Commands.UpdateDepartment;

public class UpdateDepartmentCommand : IRequest
{
    public int Id { get; set; }
    public required string Name { get; set; }
}