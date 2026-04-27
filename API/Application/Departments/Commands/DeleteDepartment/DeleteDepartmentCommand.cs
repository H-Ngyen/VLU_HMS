using MediatR;

namespace Application.Departments.Commands.DeleteDepartment;

public class DeleteDepartmentCommand(int departmentId) : IRequest
{
    public int Id { get; } = departmentId;
}