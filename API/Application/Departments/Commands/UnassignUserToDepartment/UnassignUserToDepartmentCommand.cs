using MediatR;

namespace Application.Departments.Commands.UnassignUserToDepartment;

public class UnassignUserToDepartmentCommand(int departmentId, int userId) : IRequest
{
    public int DepartmentId { get; set; } = departmentId;
    public int UserId { get; set; } = userId;
}