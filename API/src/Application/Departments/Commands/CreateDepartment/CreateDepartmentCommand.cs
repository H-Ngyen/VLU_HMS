using MediatR;

namespace Application.Departments.Commands.CreateDepartment;

public class CreateDepartmentCommand : IRequest<int>
{
    public string Name { get; set; } = null!;
}