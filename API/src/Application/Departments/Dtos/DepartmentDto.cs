using Application.Users.Dtos;

namespace Application.Departments.Dtos;

public class DepartmentDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public UserDto? HeadUser { get; set; }
    public ICollection<UserDto> Users { get; set; } = [];
}