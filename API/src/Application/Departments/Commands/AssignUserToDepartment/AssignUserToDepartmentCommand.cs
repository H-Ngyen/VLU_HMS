using MediatR;

namespace Application.Departments.Commands.AssignUserToDepartment;

public class AssignUserToDepartmentCommand(int departmentId, int userId) : IRequest
{
    public int Id { get; } = departmentId;
    public int UserId { get; } = userId;
}