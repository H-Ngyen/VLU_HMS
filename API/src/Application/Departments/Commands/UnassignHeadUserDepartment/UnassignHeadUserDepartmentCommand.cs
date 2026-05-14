using MediatR;

namespace Application.Departments.Commands.UnassignHeadUserDepartment;

public class UnassignHeadUserDepartmentCommand(int departmentId, int HeadUserId) : IRequest
{
    public int Id { get; set; } = departmentId;
    public int HeadUserId { get; set; } = HeadUserId;
}