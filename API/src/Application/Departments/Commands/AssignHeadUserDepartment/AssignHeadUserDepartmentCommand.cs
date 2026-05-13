using MediatR;

namespace Application.Departments.Commands.AssignHeadUserDepartment;

public class AssignHeadUserDepartmentCommand(int departmentId, int userId) : IRequest
{
    public int Id { get; } = departmentId;
    public int UserId { get; } = userId;
}